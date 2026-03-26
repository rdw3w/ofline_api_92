export default function handler(req, res) {
  const models = [
    {
      name: "tinyllama",
      size: "500MB",
      ram: "2GB+",
      download: "https://huggingface.co/TheBloke/TinyLlama-1.1B-Chat-v1.0-GGUF/resolve/main/tinyllama-1.1b-chat-v1.0.Q4_K_M.gguf"
    },
    {
      name: "gemma-2b",
      size: "2GB",
      ram: "4GB+",
      download: "https://huggingface.co/google/gemma-2b-it-GGUF/resolve/main/gemma-2b-it.Q4_K_M.gguf"
    },
    {
      name: "mistral-7b",
      size: "4GB",
      ram: "8GB+",
      download: "https://huggingface.co/TheBloke/Mistral-7B-Instruct-v0.1-GGUF/resolve/main/mistral-7b-instruct-v0.1.Q4_K_M.gguf"
    }
  ];

  res.status(200).json({ success: true, models });
}
