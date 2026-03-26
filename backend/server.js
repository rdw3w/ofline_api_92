import express from "express";
import fs from "fs";
import axios from "axios";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors());

if (!fs.existsSync("./models")) {
  fs.mkdirSync("./models");
}

const MODELS = [
  {
    name: "tinyllama",
    size: 500,
    url: "https://huggingface.co/TheBloke/TinyLlama-1.1B-Chat-v1.0-GGUF/resolve/main/tinyllama-1.1b-chat-v1.0.Q4_K_M.gguf"
  },
  {
    name: "gemma-2b",
    size: 2000,
    url: "https://huggingface.co/google/gemma-2b-it-GGUF/resolve/main/gemma-2b-it.Q4_K_M.gguf"
  },
  {
    name: "mistral-7b",
    size: 4000,
    url: "https://huggingface.co/TheBloke/Mistral-7B-Instruct-v0.1-GGUF/resolve/main/mistral-7b-instruct-v0.1.Q4_K_M.gguf"
  }
];

app.get("/models", (req, res) => {
  res.json(MODELS);
});

app.get("/best-model", (req, res) => {
  const storage = parseInt(req.query.storage);

  const best = MODELS
    .filter(m => m.size < storage * 0.7)
    .sort((a, b) => b.size - a.size)[0];

  res.json(best || { error: "No suitable model" });
});

app.get("/download", async (req, res) => {
  const name = req.query.name;
  const model = MODELS.find(m => m.name === name);

  if (!model) return res.status(404).send("Model not found");

  const path = `./models/${name}.gguf`;

  const response = await axios({
    url: model.url,
    method: "GET",
    responseType: "stream"
  });

  const writer = fs.createWriteStream(path);
  response.data.pipe(writer);

  writer.on("finish", () => {
    res.send("Downloaded: " + name);
  });

  writer.on("error", () => {
    res.status(500).send("Download failed");
  });
});

app.listen(3000, () => console.log("✅ Server running on http://localhost:3000"));
