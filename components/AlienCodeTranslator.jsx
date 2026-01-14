
'use client';

import { useState, useRef } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { translateQuestionDemo } from '@/lib/demoTranslator';
import { validateTranslatorQuestion } from '@/lib/validation';
import { logUserActionError } from '@/lib/errorLogger';

export default function AlienCodeTranslator() {
  const [question, setQuestion] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [copySuccess, setCopySuccess] = useState(false);
  const responseRef = useRef(null);

  const handleTranslate = async () => {
    // Validate question
    const validation = validateTranslatorQuestion(question);
    if (!validation.valid) {
      setError(validation.errors[0]);
      return;
    }

    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      // Always use demo responses - no API needed!
      const data = await translateQuestionDemo(question, language);
      setResponse(data);
    } catch (err) {
      // Log the error
      logUserActionError('alien-translator', err, {
        question: question.substring(0, 50),
        language
      });

      setError('🛸 Transmission error! Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      setError('Failed to copy to clipboard');
    }
  };

  const exampleQuestions = [
    "Explain async/await",
    "How do React hooks work?",
    "What is a closure?",
    "Show me array map vs forEach",
    "How to use destructuring?",
    "Explain spread operator",
    "Show me useEffect examples",
    "How to handle events in React?",
    "What is localStorage?",
    "Explain template literals"
  ];

  return (
    <div className="alien-translator-container">
      {/* Floating Particles */}
      <div className="particle"></div>
      <div className="particle"></div>
      <div className="particle"></div>
      
      {/* Header */}
      <div className="translator-header">
        <div className="header-icon">🛸</div>
        <h2 className="header-title">Alien Code Translator</h2>
        <p className="header-subtitle">
          Learn coding through cosmic metaphors - 15+ topics, always free, no limits!
        </p>
      </div>

      {/* Input Section */}
      <div className="translator-input">
        <div className="input-controls">
          <select 
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="language-selector"
            disabled={loading}
          >
            <option value="javascript">JavaScript</option>
            <option value="typescript">TypeScript</option>
            <option value="python">Python</option>
            <option value="react">React/JSX</option>
            <option value="css">CSS</option>
          </select>
        </div>

        <div className="input-wrapper">
          <div className="input-glow"></div>
          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                handleTranslate();
              }
            }}
            placeholder="Ask your cosmic coding question... (Cmd/Ctrl + Enter to send)"
            className="question-textarea"
            disabled={loading}
            rows={4}
          />
        </div>

        <div className="input-footer">
          <button 
            onClick={handleTranslate}
            disabled={loading || !question.trim()}
            className="translate-button"
          >
            {loading ? (
              <>
                <span className="loading-spinner">🛸</span>
                Receiving transmission...
              </>
            ) : (
              <>
                <span>⚡</span>
                Translate to Alien Wisdom
              </>
            )}
          </button>
        </div>

        {/* Example Questions */}
        <div className="example-questions">
          <p className="example-label">Try asking:</p>
          <div className="example-chips">
            {exampleQuestions.map((q, i) => (
              <button
                key={i}
                onClick={() => setQuestion(q)}
                className="example-chip"
                disabled={loading}
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="error-message">
          <span className="error-icon">⚠️</span>
          <p>{error}</p>
        </div>
      )}

      {/* Response Display */}
      {response && (
        <div ref={responseRef} className="translator-response">
          {/* Alien Insight */}
          <section className="response-section insight-section">
            <h3 className="section-title">
              <span className="section-icon">🛸</span>
              Alien Insight
            </h3>
            <div className="section-content">
              <p className="insight-text">{response.insight}</p>
            </div>
          </section>

          {/* Code */}
          {response.code && (
            <section className="response-section code-section">
              <div className="section-header">
                <h3 className="section-title">
                  <span className="section-icon">👽</span>
                  Earthling-Friendly Code
                </h3>
                <button 
                  onClick={() => handleCopy(response.code)}
                  className="copy-button"
                  title="Copy to clipboard"
                >
                  {copySuccess ? '✅ Copied!' : '📋 Copy'}
                </button>
              </div>
              <div className="code-wrapper">
                <SyntaxHighlighter
                  language={response.language}
                  style={tomorrow}
                  customStyle={{
                    margin: 0,
                    padding: '1.5rem',
                    borderRadius: '0',
                    fontSize: '0.95rem',
                    backgroundColor: '#000000',
                    fontFamily: "'Fira Code', 'Monaco', 'Courier New', monospace",
                    lineHeight: '1.7',
                  }}
                  showLineNumbers
                  lineNumberStyle={{
                    color: '#6B7280',
                    paddingRight: '1.5rem',
                    minWidth: '3rem',
                    textAlign: 'right',
                    userSelect: 'none',
                  }}
                  wrapLines={true}
                  wrapLongLines={false}
                >
                  {response.code}
                </SyntaxHighlighter>
              </div>
            </section>
          )}

          {/* Principles */}
          {response.principles && (
            <section className="response-section principles-section">
              <h3 className="section-title">
                <span className="section-icon">🌌</span>
                Universal Principles
              </h3>
              <div className="section-content">
                <p className="principles-text">{response.principles}</p>
              </div>
            </section>
          )}

          {/* Related Posts */}
          {response.related && (
            <section className="response-section related-section">
              <h3 className="section-title">
                <span className="section-icon">🔮</span>
                Related Transmissions
              </h3>
              <div className="section-content">
                <p className="related-text">{response.related}</p>
              </div>
            </section>
          )}

          {/* Next Mission */}
          {response.nextMission && (
            <section className="response-section mission-section">
              <h3 className="section-title">
                <span className="section-icon">⚡</span>
                Next Mission
              </h3>
              <div className="section-content">
                <p className="mission-text">{response.nextMission}</p>
              </div>
            </section>
          )}

          {/* Follow-up Question */}
          <div className="follow-up">
            <p className="follow-up-label">Continue the transmission:</p>
            <button 
              onClick={() => setQuestion('')}
              className="follow-up-button"
            >
              Ask another question ✨
            </button>
          </div>
        </div>
      )}

      {/* Info Footer */}
      <div className="translator-footer">
        <p className="footer-text">
          <span className="footer-icon">💚</span>
          Powered by cosmic intelligence and alien-signal-blog wisdom
        </p>
      </div>
    </div>
  );
}
