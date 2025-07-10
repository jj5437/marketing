import React, { useState } from 'react';
import './History.css';

const History = ({ history, onLoad, onDelete, onClear, isVisible }) => {
  const [expandedItems, setExpandedItems] = useState({});

  const toggleExpanded = (id) => {
    setExpandedItems(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const truncateText = (text, maxLength) => {
    if (!text || text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <div className={`history-panel ${isVisible ? 'visible' : ''}`}>
      <div className="history-header">
        <h2>历史记录</h2>
        {history.length > 0 && (
          <button onClick={onClear} className="clear-history-button">
            清空全部
          </button>
        )}
      </div>
      <div className="history-list">
        {history.length === 0 ? (
          <p className="no-history-message">暂无历史记录。</p>
        ) : (
          history.map((item) => (
            <div key={item.id} className="history-item">
              <div
                className="history-item-content"
                onClick={() => toggleExpanded(item.id)}
              >
                <p className="history-item-text">
                  <strong>原始:</strong>{' '}
                  {expandedItems[item.id]
                    ? item.inputText
                    : truncateText(item.inputText, 40)}
                </p>
                <p className="history-item-text">
                  <strong>生成:</strong>{' '}
                  {expandedItems[item.id]
                    ? item.generatedText
                    : truncateText(item.generatedText, 50)}
                </p>
                <div className="history-item-meta">
                  <span className="history-item-model">{item.model}</span>
                  <span className="history-item-timestamp">{item.timestamp}</span>
                </div>
              </div>
              <div className="history-item-actions">
                <button
                  onClick={() => onLoad(item)}
                  className="history-action-button"
                >
                  加载
                </button>
                <button
                  onClick={() => onDelete(item.id)}
                  className="history-action-button delete"
                >
                  删除
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default History;
