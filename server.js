const express = require("express");
const cors = require("cors");
const { Configuration, OpenAIApi } = require("openai");

const app = express();
app.use(cors());
app.use(express.json());

// Make sure you set OPENAI_API_KEY in Railway variables
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

// Minimal /chat endpoint
app.post("/chat", async (req, res) => {
  try {
    const userMessage = req.body.message; // Roblox will send { message: "..." }

    if (!userMessage) {
      return res.status(400).json({ error: "No message provided" });
    }

    const completion = await openai.createChatCompletion({
      model: "gpt-4",
      messages: [
        { role: "system", content: "You are a Roblox NPC." },
        { role: "user", content: userMessage }
      ],
    });

    const aiResponse = completion.data.choices[0].message.content;
    res.json({ reply: aiResponse });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "AI request failed" });
  }
});

// Dynamic port for Railway
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
