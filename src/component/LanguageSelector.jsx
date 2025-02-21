import { useEffect, useState } from "react";

// Initialize Summarizer
async function createSummarizer() {
  try {
    if (typeof self === "undefined" || !self.ai || !self.ai.summarizer) {
      console.error("Summarizer API is not available.");
      return null;
    }

    const options = { format: "plain-text", length: "short", maxLength: 50 };
    const capabilities = await self.ai.summarizer.capabilities();
    const available = capabilities.available;

    if (available === "no") {
      console.error("Summarizer API isn't usable.");
      return null;
    }

    const summarizer = await self.ai.summarizer.create(options);
    if (available !== "readily") {
      summarizer.addEventListener("downloadprogress", (e) => {
        console.log(`Downloading: ${e.loaded}/${e.total} bytes.`);
      });
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
    if (typeof self === "undefined" || !self.ai || !self.ai.translator) {
      console.error("AI translation API is not available.");
      return null;
    }
    return await self.ai.translator.create({ sourceLanguage, targetLanguage });
  } catch (error) {
    console.error("Error creating translator:", error);
    return null;
  }
}

// Language Detection
async function detectLanguage(text) {
  try {
    if (typeof self === "undefined" || !self.ai || !self.ai.languageDetector) {
      console.error("Language Detector API is not available.");
      return null;
    }

    const detector = await self.ai.languageDetector.create();
    const detectedLanguages = await detector.detect(text);

    if (!Array.isArray(detectedLanguages) || detectedLanguages.length === 0) {
      console.error("No valid response from language detector.");
      return null;
    }

    const detectedLanguage = detectedLanguages[0].detectedLanguage;
    console.log(`Detected Language: ${detectedLanguage}`);
    return detectedLanguage;
  } catch (error) {
    console.error("Error detecting language:", error);
    return null;
  }
}

const getStoredMessages = () => {
  try {
    return JSON.parse(localStorage.getItem("messages")) || [];
  } catch (error) {
    console.error("Error reading from localStorage:", error);
    return [];
  }
};

const showError = (message, setError, setLoading) => {
  console.error(message);
  setError(message);
  setLoading({ index: null, type: "" });
};

const TextProcessingInterface = () => {
  const [text, setText] = useState("");
  const [messages, setMessages] = useState(getStoredMessages());
  const [language, setLanguage] = useState("en");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState({ index: null, type: "" });

  useEffect(() => {
    console.log("Loading state:", loading);
    localStorage.setItem("messages", JSON.stringify(messages));
  }, [loading, messages]);

  const handleSend = async () => {
    if (!text.trim()) {
      setError("Please enter text before sending.");
      return;
    }
    setError(""); 
  
    const detectedLanguage = await detectLanguage(text);
    console.log("Detected language:", detectedLanguage); 
  
    const newMessage = {
      text,
      detectedLanguage,
      summary: "",
      translation: "",
      showSummarize: detectedLanguage === "en" && text.length > 150,
    };
  
    setMessages([...messages, newMessage]);
    setText("");
    setLoading({ index: null, type: "" }); 
  };
  

  const handleSummarize = async (index) => {
    setLoading({ index, type: "summarizing" });
    setError(""); 
    const summarizer = await createSummarizer();
    if (!summarizer) {
      showError("Summarizer failed to initialize.", setError, setLoading);
      return;
    }

    try {
      const stream = await summarizer.summarize(messages[index].text, {
        context: "This article is intended for a tech-savvy audience.",
      });

      let result = "";
      for await (const chunk of stream) {
        result += chunk;
      }

      setMessages((prevMessages) =>
        prevMessages.map((msg, i) =>
          i === index ? { ...msg, summary: result.trim() } : msg
        )
      );
    } catch (error) {
      showError("Summarization failed.", setError, setLoading);
    } finally {
      setLoading({ index: null, type: "" }); 
    }
  };

  const handleTranslate = async (index) => {
    console.log("Translation started. Loading state:", loading);
    setLoading({ index, type: "translating" });
    setError("");

    try {
      const message = messages[index];
      if (!message.text || !message.detectedLanguage) {
        throw new Error("Text or language detection failed.");
      }

      const translator = await createTranslator(
        message.detectedLanguage,
        language
      );
      if (!translator) {
        throw new Error("Error initializing translator.");
      }

      const stream = await translator.translate(message.text);
      let result = "";
      for await (const chunk of stream) {
        result += chunk;
      }

      setMessages((prevMessages) =>
        prevMessages.map((msg, i) =>
          i === index ? { ...msg, translation: result.trim() } : msg
        )
      );
    } catch (error) {
      showError(error.message, setError, setLoading);
    } finally {
      setLoading({ index: null, type: "" });
    }
  };

  const handleClearAll = () => {
    setMessages([]);
    localStorage.removeItem("messages");
  };

  return (
    <>
      <header className="app-header">
        <h1 className="main-title">Chrome AI</h1>
      </header>
      <div className="chat-container">
        <button className="clear-all-btn" onClick={handleClearAll}>
          Clear all
        </button>
        <div className="chat-output">
          {messages.map((msg, index) => (
            <div key={index} className="chat-message">
              <p className="message-text">{msg.text}</p>
              <p className="language-detected">
                Language: {msg.detectedLanguage}
              </p>

              {msg.showSummarize && (
                <button
                  className="action-btn"
                  onClick={() => handleSummarize(index)}
                  disabled={
                    loading.index === index && loading.type === "summarizing"
                  }
                  aria-label="Summarize text"
                >
                  {loading.index === index && loading.type === "summarizing"
                    ? "Summarizing..."
                    : "Summarize"}
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
                disabled={
                  loading.index === index && loading.type === "translating"
                }
                aria-label="Translate text"
              >
                {loading.index === index && loading.type === "translating"
                  ? "Translating..."
                  : "Translate"}
              </button>

              {msg.summary && (
                <p className="summary-text">Summary: {msg.summary}</p>
              )}
              {msg.translation && (
                <p className="translated-text">
                  Translation: {msg.translation}
                </p>
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
            🡆
          </button>
        </div>
      </div>
    </>
  );
};

export default TextProcessingInterface;
