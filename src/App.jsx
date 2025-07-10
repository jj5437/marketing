import { useState, useEffect } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import Login from './components/Login';
import SkeletonLoader from './components/SkeletonLoader';
import History from './components/History';
import './App.css';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [inputText, setInputText] = useState('');
  const [selectedModel, setSelectedModel] = useState('AIDA');
  const [generatedText, setGeneratedText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [copyButtonText, setCopyButtonText] = useState('复制');
  const [history, setHistory] = useState([]);
  const [isHistoryVisible, setIsHistoryVisible] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedText);
    setCopyButtonText('已复制!');
    setTimeout(() => setCopyButtonText('复制'), 2000);
  };

  useEffect(() => {
    const storedHistory = JSON.parse(localStorage.getItem('marketingCopyHistory')) || [];
    setHistory(storedHistory);
  }, []);

  const saveHistory = (input, output, model) => {
    const newEntry = {
      id: Date.now(),
      inputText: input,
      generatedText: output,
      model: model,
      timestamp: new Date().toLocaleString(),
    };
    const updatedHistory = [newEntry, ...history];
    setHistory(updatedHistory);
    localStorage.setItem('marketingCopyHistory', JSON.stringify(updatedHistory));
  };

  const loadHistoryEntry = (entry) => {
    setInputText(entry.inputText);
    setGeneratedText(entry.generatedText);
    setSelectedModel(entry.model);
    setIsHistoryVisible(false); // Close history panel after loading
  };

  const deleteHistoryEntry = (id) => {
    const updatedHistory = history.filter((item) => item.id !== id);
    setHistory(updatedHistory);
    localStorage.setItem('marketingCopyHistory', JSON.stringify(updatedHistory));
  };

  const clearAllHistory = () => {
    if (window.confirm('确定要清空所有历史记录吗？')) {
      setHistory([]);
      localStorage.removeItem('marketingCopyHistory');
    }
  };

  const models = [
    { key: 'AIDA', name: 'AIDA模型 (经典漏斗式)' },
    { key: 'PAS', name: 'PAS模型 (痛点刺激)' },
    { key: '4C', name: '4C法则 (互联网友好型)' },
    { key: 'FAB', name: 'FAB法则 (产品卖点转化)' },
    { key: 'QUEST', name: 'QUEST模型 (故事化营销)' },
    { key: 'BAB', name: 'Before-After-Bridge (对比冲击)' },
  ];

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputText) {
      setError('请输入原始文案');
      return;
    }
    setIsLoading(true);
    setError('');
    setGeneratedText('');

    const prompt = `请严格使用 ${selectedModel} 模型，对以下文案进行优化和重写，使其更具吸引力、说服力和传播性，更好的应用于短视频脚本创作领域。请直接输出优化后的文案，不要包含任何额外的解释或标题。原始文案：\n\n${inputText}`;

    try {
      let text = '';

      if (import.meta.env.VITE_DEEPSEEK_API_KEY) {
        const response = await fetch("https://api.deepseek.com/chat/completions", {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.VITE_DEEPSEEK_API_KEY}`,
          },
          body: JSON.stringify({
            model: import.meta.env.VITE_DEEPSEEK_MODEL || "deepseek-reasoner",
            messages: [{ role: "user", content: prompt }],
            temperature: 0.7,
            stream: false
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(`DeepSeek API 错误: ${errorData.error.message}`);
        }
        
        const data = await response.json();
        text = data.choices[0].message.content;

      } else if (import.meta.env.VITE_GEMINI_API_KEY) {
        const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
        
        const result = await model.generateContent(prompt);
        const response = await result.response;
        text = response.text();
      } else {
        throw new Error('请在 .env 文件中配置 VITE_DEEPSEEK_API_KEY 或 VITE_GEMINI_API_KEY');
      }
      
      let i = 0;
      setGeneratedText(' ');
      const typingEffect = setInterval(() => {
        setGeneratedText(text.slice(0, i + 1));
        i++;
        if (i > text.length) {
          clearInterval(typingEffect);
          setIsLoading(false);
          saveHistory(inputText, text, selectedModel); // Save to history after typing effect
        }
      }, 20);

    } catch (err) {
      const errorMessage = err.message || '请检查您的API密钥和网络连接。';
      setError(`生成文案时出错: ${errorMessage}`);
      console.error(err);
      setIsLoading(false);
    }
  };

  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className={`fullscreen-container ${isHistoryVisible ? 'history-visible' : ''}`}>
      <button
        className="history-toggle-button"
        onClick={() => setIsHistoryVisible(!isHistoryVisible)}
      >
        {isHistoryVisible ? '关闭历史' : '查看历史'}
      </button>
      <header className="app-header">
        <h1>营销文案智能生成器</h1>
        <p className="subtitle">灵感，一触即发</p>
      </header>
      <main className="main-content">
        <section className="input-section">
          <form onSubmit={handleSubmit} className="input-form">
            <div className="textarea-wrapper">
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="在这里输入或粘贴您的原始文案..."
                className="input-textarea"
              />
            </div>
            <div className="controls">
              <div className="select-wrapper">
                <select
                  value={selectedModel}
                  onChange={(e) => setSelectedModel(e.target.value)}
                  className="model-select"
                >
                  {models.map((model) => (
                    <option key={model.key} value={model.key}>
                      {model.name}
                    </option>
                  ))}
                </select>
              </div>
              <button type="submit" className="generate-button" disabled={isLoading}>
                {isLoading ? ' ' : '生成文案'}
                {isLoading && <div className="loader"></div>}
              </button>
            </div>
             {error && <p className="error-message">{error}</p>}
          </form>
        </section>
        <section className="output-section">
            <div className="output-text-wrapper">
              {isLoading ? (
                <SkeletonLoader />
              ) : (
                <p className="output-text">{generatedText || "AI生成的内容将显示在这里..."}</p>
              )}
            </div>
            {!isLoading && generatedText && (
              <div className="output-actions">
                <button onClick={handleCopy} className="copy-button">
                  {copyButtonText}
                </button>
              </div>
            )}
        </section>
      </main>
      <History
        history={history}
        onLoad={loadHistoryEntry}
        onDelete={deleteHistoryEntry}
        onClear={clearAllHistory}
        isVisible={isHistoryVisible}
      />
    </div>
  );
};

export default App;