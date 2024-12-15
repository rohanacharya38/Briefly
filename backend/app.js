import express from "express";
import cors from "cors";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const HUGGING_FACE_API_TOKEN = process.env.LLAMA_TOKEN;

const axiosInstance = axios.create({
  baseURL: "https://api-inference.huggingface.co",
  headers: {
    Authorization: `Bearer ${HUGGING_FACE_API_TOKEN}`,
    "Content-Type": "application/json",
  },
});

const retryAxios = async (config, retries = 3, delay = 1000) => {
  try {
    return await axiosInstance(config);
  } catch (error) {
    if (
      retries > 0 &&
      (error.response?.status === 503 ||
        error.response?.data?.error?.includes("is currently loading"))
    ) {
      console.log(
        `Retrying in ${delay / 1000} seconds... (${retries} attempts left)`
      );
      await new Promise((resolve) => setTimeout(resolve, delay));
      return retryAxios(config, retries - 1, delay * 2);
    }
    throw error;
  }
};

// app.post("/translate", async (req, res) => {
//   const { text, sourceLang, targetLang } = req.body;

//   if (!text || !sourceLang || !targetLang) {
//     return res.status(400).json({ message: "Invalid input" });
//   }

//   const langMap = {
//     en: "eng_Latn",
//     fr: "fra_Latn",
//     ne: "npi_Deva",
//     hi: "hin_Deva",
//   };

//   const src_lang = langMap[sourceLang] || sourceLang;
//   const tgt_lang = langMap[targetLang] || targetLang;

//   try {
//     const response = await retryAxios({
//       method: "post",
//       url: "/models/facebook/nllb-200-distilled-600M",
//       data: {
//         inputs: text,
//         parameters: { src_lang, tgt_lang },
//       },
//     });

//     const translatedText =
//       response.data?.[0]?.translation_text || "Translation failed.";
//     res.json({ translatedText });
//   } catch (error) {
//     console.error("Translation error:", error.response?.data || error.message);
//     res.status(500).json({
//       message: "Error during translation",
//       error: error.response?.data || error.message,
//     });
//   }
// });

app.post("/chat", async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ message: "Invalid input" });
  }

  const prompt = `<human>: ${message}\n<assistant>:`;

  try {
    const response = await retryAxios({
      method: "post",
      url: "/models/TinyLlama/TinyLlama-1.1B-Chat-v1.0",
      data: {
        inputs: prompt,
        parameters: {
          max_new_tokens: 250,
          temperature: 0.7,
          top_p: 0.95,
          do_sample: true,
        },
      },
    });

    const botReply =
      response.data?.[0]?.generated_text?.split("<assistant>:")[1]?.trim() ||
      "I'm sorry, I couldn't generate a response.";
    res.json({ reply: botReply });
  } catch (error) {
    console.error("Chat error:", error.response?.data || error.message);
    if (error.response?.data?.error?.includes("is currently loading")) {
      res.status(503).json({
        message:
          "Model is currently loading. Please try again in a few minutes.",
        estimatedTime: error.response?.data?.estimated_time,
      });
    } else {
      res.status(500).json({
        message: "Error during chat",
        error: error.response?.data || error.message,
      });
    }
  }
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
