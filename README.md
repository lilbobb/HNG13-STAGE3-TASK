# AI-Powered Text Processing Interface  

## 🚀 Overview  
The **AI-Powered Text Processing Interface** is a web application that allows users to input text and utilize **Chrome's AI APIs** for summarization, translation, and language detection. The UI is designed to function like a **chat interface**, ensuring a seamless and accessible experience.  

## 🎯 Features  
### 🔹 Input & Display  
- Users can **input text** in a large, user-friendly textarea.  
- The **"Send" button** (with only an icon) allows users to submit text.  
- The input text **immediately appears in the output area**, similar to a chat interface.  

### 🔹 Language Detection  
- The **Language Detection API** automatically identifies the language of the input text.  
- The detected language is displayed **below the output text**.  

### 🔹 Summarization  
- If the detected language is **English** and the text exceeds **150 characters**, a **"Summarize" button** appears.  
- Clicking the button **summarizes** the text using the **Summarizer API**.  

### 🔹 Translation  
- Users can **select a target language** from the dropdown menu:  
  - **English (en)**  
  - **Portuguese (pt)**  
  - **Spanish (es)**  
  - **Russian (ru)**  
  - **Turkish (tr)**  
  - **French (fr)**  
- Clicking the **"Translate" button** translates the output text using the **Translator API**.  

### 🔹 Output Display  
- The **translated and/or summarized** text is displayed **below the original output text**.  

## 🛠️ Tech Stack  
- **React + Vite** (for frontend development)  
- **Vanilla CSS** (for styling)  
- **Chrome AI APIs** (Summarization, Translation, Language Detection)  

## 🔗 Study Material  
- 📖 **Chrome AI APIs Overview:** [Chrome AI APIs](https://developer.chrome.com/docs/ai/)  
- 📖 **Summarizer API:** [Summarizer API Docs](https://developer.chrome.com/docs/ai/summarizer-api)  
- 📖 **Translator API:** [Translator API Docs](https://developer.chrome.com/docs/ai/translator-api)  
- 📖 **Language Detection API:** [Language Detection API Docs](https://developer.chrome.com/docs/ai/language-detection)  
- 📖 **Asynchronous JavaScript Handling:** [MDN Docs](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Asynchronous)  
- 📖 **Responsive Web Design Basics:** [Web.dev Guide](https://web.dev/responsive-web-design-basics/)  
- 📖 **Accessible UI Design:** [Digital A11Y](https://www.digitala11y.com/)  

**🔔 Note:** You may need to enable the **experimental feature flag** in your Chrome browser to access these APIs.  

## ✅ Acceptance Criteria  
### ✔️ Functionality  
- Users can **input text**, send it, and **see it render** in the output area.  
- Users can **summarize** texts (if in English and over 150 characters).  
- Users can **translate** texts into the supported languages.  
- The app **communicates with Chrome AI APIs** and retrieves **accurate results**.  
- Processed results are **displayed below the original text** after API calls.  

### ✔️ Error Handling  
- Show an **error message** if:  
  - The **API call fails**.  
  - The **input text is empty** or invalid.  
- Error messages should be **clear and user-friendly**.  

### ✔️ Responsive Design  
- The interface **adapts to different screen sizes** (desktop, tablet, mobile).  
- Uses a **flexible grid/stacked layout** for an optimal experience.  

### ✔️ Code Quality  
- **Modular, readable code** with proper comments and structure.  
- Implements **async/await or Promises** for API calls and error handling.  

## 🔧 Installation & Setup  
1. **Clone the repository:**  
   ```bash
   git clone https://github.com/lilbobb(https://github.com/lilbobb/HNG13-STAGE3-TASK)/ai-text-processing.git)
  
