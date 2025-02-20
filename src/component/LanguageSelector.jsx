import { useState } from "react";

// Initialize Summarizer 
async function createSummarizer() {
  try {
    if (!self.ai || !self.ai.summarizer) {
      console.error("Summarizer API is not available.");
      return null;
    }

    const options = {
      format: "plain-text", 
      length: "short", 
      maxLength: 50, 
    };

    const available = (await self.ai.summarizer.capabilities()).available;
    if (available === "no") {
      console.error("Summarizer API isn't usable.");
      return null;
    }

    const summarizer = await self.ai.summarizer.create(options);
    if (available !== "readily") {
      summarizer.addEventListener("downloadprogress", (e) =>
        console.log(`Downloading: ${e.loaded}/${e.total} bytes.`)
      );
      await summarizer.ready;
    }

    return summarizer;
  } catch (error) {
    console.error("Error initializing summarizer:", error);
    return null;
  }
}


// Initialize Translator
async function createTranslator(sourceLanguage, targetLanguage) {
  try {
    if (!self.ai || !self.ai.translator) {
      console.error("AI translation API is not available.");
      return null;
    }

    return await self.ai.translator.create({
      sourceLanguage,
      targetLanguage,
    });
  } catch (error) {
    console.error("Error creating translator:", error);
    return null;
  }
}

// Language Detection
async function detectLanguage(text) {
  try {
    if (!self.ai || !self.ai.languageDetector) {
      console.error("Language Detector API is not available.");
      return null;
    }

    const detector = await self.ai.languageDetector.create();
    const detectedLanguages = await detector.detect(text);

    if (!Array.isArray(detectedLanguages) || detectedLanguages.length === 0) {
      console.error("No valid response from language detector.");
      return null;
    }

    return detectedLanguages[0].detectedLanguage;
  } catch (error) {
    console.error("Error detecting language:", error);
    return null;
  }
}

const TextProcessingInterface = () => {
  const [text, setText] = useState("");
  const [messages, setMessages] = useState([]);
  const [language, setLanguage] = useState("en");
  const [error, setError] = useState("");

  // Handle Sending Input
  const handleSend = async () => {
    if (!text.trim()) {
      setError("Please enter text before sending.");
      return;
    }
    setError("");

    const detectedLanguage = await detectLanguage(text);
    const newMessage = {
      text,
      detectedLanguage,
      summary: "",
      translation: "",
      showSummarize: detectedLanguage === "en" && text.length > 150,
    };

    setMessages((prev) => [...prev, newMessage]);
    setText(""); // Clear input
  };

  // Handle Summarization
  const handleSummarize = async (index) => {
    const summarizer = await createSummarizer();
    if (!summarizer) {
      setError("Summarizer failed to initialize.");
      return;
    }
  
    try {
      const stream = await summarizer.summarize(messages[index].text, {
        context: "This article is intended for a tech-savvy audience.",
      });
  
      let result = "";
  
      for await (const chunk of stream) {
        result += chunk; // Append each chunk correctly
      }
  
      // Remove unnecessary spaces or formatting errors
      const cleanedSummary = result.replace(/\s+/g, " ").trim();
  
      setMessages((prev) =>
        prev.map((msg, i) => (i === index ? { ...msg, summary: cleanedSummary } : msg))
      );
    } catch (error) {
      console.error("Error during summarization:", error);
      setError("Summarization failed.");
    }
  };
  
  

  // Handle Translation
  const handleTranslate = async (index) => {
    const message = messages[index];
    if (!message.text) {
      setError("No text available for translation.");
      return;
    }
  
    if (!message.detectedLanguage) {
      setError("Language detection failed.");
      return;
    }
  
    setError("");
    try {
      const translator = await createTranslator(message.detectedLanguage, language);
      if (!translator) {
        setError("Error initializing translator.");
        return;
      }
  
      const stream = await translator.translate(message.text);
      let result = "";
  
      for await (const chunk of stream) {
        result += chunk;
      }
  
      // Ensure translation is formatted correctly
      const cleanedTranslation = result.replace(/\s+/g, " ").trim();
  
      setMessages((prev) =>
        prev.map((msg, i) => (i === index ? { ...msg, translation: cleanedTranslation } : msg))
      );
    } catch (error) {
      console.error("Translation error:", error);
      setError("Error translating text.");
    }
  };
  

  return (
    <div className="chat-container">
      <div className="chat-output">
        {messages.map((msg, index) => (
          <div key={index} className="chat-message">
            <p className="message-text">{msg.text}</p>
            <p className="language-detected">Language: {msg.detectedLanguage}</p>

            {msg.showSummarize && (
              <button
                className="action-btn"
                onClick={() => handleSummarize(index)}
                aria-label="Summarize text"
              >
                Summarize
              </button>
            )}

            <select
              className="language-dropdown"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              aria-label="Select translation language"
            >
              <option value="en">English</option>
              <option value="pt">Portuguese</option>
              <option value="es">Spanish</option>
              <option value="ru">Russian</option>
              <option value="tr">Turkish</option>
              <option value="fr">French</option>
            </select>

            <button
              className="action-btn"
              onClick={() => handleTranslate(index)}
              aria-label="Translate text"
            >
              Translate
            </button>

            {msg.summary && <p className="summary-text">Summary: {msg.summary}</p>}
            {msg.translation && (
              <p className="translated-text">Translation: {msg.translation}</p>
            )}
          </div>
        ))}
      </div>

      {error && <p className="error-message">{error}</p>}

      <div className="chat-input">
        <textarea
          className="input-textarea"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type or paste text here..."
        ></textarea>

        <button
          className="send-btn"
          onClick={handleSend}
          disabled={!text.trim()}
          aria-label="Send text"
        >
          🚀
        </button>
      </div>
    </div>
  );
};

export default TextProcessingInterface;
