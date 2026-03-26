export default function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");

  const config = {
    engine: "llama.cpp",
    endpoints: {
      chat: "http://127.0.0.1:8080/v1/chat/completions",
      health: "http://127.0.0.1:8080/health"
    },
    instructions: {
      step1: "Download model from /api/models",
      step2: "Store in app storage",
      step3: "Run llama.cpp with model",
      step4: "Use chat endpoint"
    }
  };

  res.status(200).json({ success: true, config });
}
