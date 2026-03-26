import express from "express";
import fs from "fs";
import axios from "axios";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors());

const MODEL_SOURCES = [
  "https://huggingface.co",
  "https://hf-mirror.com",
  "https://huggingface.co/resolve"
];

if (!fs.existsSync("./models")) {
  fs.mkdirSync("./models");
}

const MODELS = [
  {
    name: "tinyllama",
    size: 500,
    path: "/TheBloke/TinyLlama-1.1B-Chat-v1.0-GGUF/resolve/main/tinyllama-1.1b-chat-v1.0.Q4_K_M.gguf"
  }
];

async function downloadWithFallback(modelPath, savePath) {
  for (let base of MODEL_SOURCES) {
    try {
      const url = base + modelPath;
      console.log("Trying:", url);

      const response = await axios({
        url,
        method: "GET",
        responseType: "stream",
        timeout: 10000
      });

      const writer = fs.createWriteStream(savePath);
      response.data.pipe(writer);

      return new Promise((resolve, reject) => {
        writer.on("finish", () => resolve(true));
        writer.on("error", reject);
      });
    } catch (err) {
      console.log("Failed source:", base);
    }
  }
  throw new Error("All sources failed");
}

app.get("/download-advanced", async (req, res) => {
  const name = req.query.name;
  const model = MODELS.find(m => m.name === name);

  if (!model) return res.send("Model not found");

  const savePath = `./models/${name}.gguf`;

  try {
    await downloadWithFallback(model.path, savePath);
    res.send("✅ Download success without VPN");
  } catch (e) {
    res.status(500).send("❌ All sources failed");
  }
});

app.listen(4000, () => console.log("🚀 Advanced server running on 4000"));
