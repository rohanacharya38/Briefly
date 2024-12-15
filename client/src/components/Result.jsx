import React, { useState } from "react";
import { CiCircleQuestion } from "react-icons/ci";
import {
  useQnaMutation,
  useTranslateMutation,
} from "../slices/summarizeApiSlice";

const Result = ({ res }) => {
  const replyText = res?.data?.reply || "No summary available."; // Safely access the nested structure
  console.log(res); // Debugging log to confirm structure

  const [chat, setChat] = useState(false);
  const [question, setQuestion] = useState("");
  const [qaPairs, setQaPairs] = useState([]);
  const [selectedLang, setSelectedLang] = useState("en");
  const [translatedText, setTranslatedText] = useState("");

  const [qna, { isLoading }] = useQnaMutation();
  const [translate, { isLoading: translating }] = useTranslateMutation();

  const languages = [
    { label: "French", value: "fr" },
    { label: "Nepali", value: "ne" },
    { label: "Hindi", value: "hi" },
  ];

  const handleQuestionSubmit = async () => {
    if (!question.trim()) return;
    try {
      const combinedMessage = `Here is the summary of the paper: "${replyText}". Now, answer the following question based on the summary: ${question}`;
      const qnaRes = await qna({ message: combinedMessage }).unwrap();
      setQaPairs([
        ...qaPairs,
        { question, answer: qnaRes.reply || "No response available." },
      ]);
      setQuestion("");
    } catch (error) {
      console.error("Error fetching answer:", error.message);
    }
  };

  const handleTranslationSubmit = async () => {
    try {
      const translationRes = await translate({
        text: replyText,
        sourceLang: "en",
        targetLang: selectedLang,
      }).unwrap();
      setTranslatedText(translationRes.translatedText);
    } catch (error) {
      console.error("Translation error:", error.message);
    }
  };

  return (
    <div>
      <div className="summary-container">
        <h2>Brief Summary Of The Paper</h2>
        <p>{translatedText || replyText}</p>
        {/* <div className="translation-controls"> */}
          {/* <label htmlFor="language-select">Translate to: </label> */}
          {/* <select
            id="language-select"
            value={selectedLang}
            onChange={(e) => setSelectedLang(e.target.value)}
          >
            <option value="en">English</option>
            {languages.map((lang) => (
              <option key={lang.value} value={lang.value}>
                {lang.label}
              </option>
            ))}
          </select> */}
          {/* <button onClick={handleTranslationSubmit} disabled={translating}>
            {translating ? "Translating..." : "Translate"}
          </button>
        </div> */}
      </div>

      {!chat ? (
        <div className="ask-question">
          Have questions about the paper?{" "}
          <span onClick={() => setChat(true)}>Ask now!</span>
        </div>
      ) : (
        <div className="chat-box">
          <div className="qa-pairs">
            {qaPairs.length === 0 ? (
              <div className="no-questions">
                <CiCircleQuestion size={30} />
                <p>Ask Your First Question</p>
              </div>
            ) : (
              qaPairs.map((qa, index) => (
                <div key={index}>
                  <p>
                    <strong>Q:</strong> {qa.question}
                  </p>
                  <p>
                    <strong>A:</strong> {qa.answer}
                  </p>
                </div>
              ))
            )}
          </div>
          <div className="input-controls">
            <input
              type="text"
              placeholder="Ask a question..."
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
            />
            <button onClick={handleQuestionSubmit} disabled={isLoading}>
              {isLoading ? "Asking..." : "Ask"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Result;
