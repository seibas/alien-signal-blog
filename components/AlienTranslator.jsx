import React, { useState } from 'react';

const LANGUAGES = [
  { label: 'JavaScript', value: 'javascript' },
  { label: 'Python', value: 'python' },
  { label: 'TypeScript', value: 'typescript' },
  { label: 'Go', value: 'go' },
  { label: 'Java', value: 'java' },
  { label: 'C#', value: 'csharp' },
  { label: 'Ruby', value: 'ruby' },
  { label: 'PHP', value: 'php' },
  { label: 'Other', value: 'other' },
];

export default function AlienTranslator() {
  const [question, setQuestion] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResponse(null);
    try {
      const res = await fetch('/api/alien-translator', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question, language }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Unknown error');
      setResponse(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="alien-translator-container" style={{ maxWidth: 700, margin: '0 auto', padding: 24, background: '#181f2a', borderRadius: 16, boxShadow: '0 4px 24px #0008', color: '#fff' }}>
      <h2 style={{ fontSize: 32, marginBottom: 8 }}>👽 Alien Code Translator</h2>
      <p style={{ marginBottom: 24, color: '#b3e5fc' }}>Ask a cosmic coding question and receive an alien-themed answer!</p>
      <form onSubmit={handleSubmit} style={{ marginBottom: 32 }}>
        <textarea
          value={question}
          onChange={e => setQuestion(e.target.value)}
          placeholder="Type your programming question..."
          rows={4}
          style={{ width: '100%', padding: 12, borderRadius: 8, border: '1px solid #333', fontSize: 16, marginBottom: 12 }}
          maxLength={500}
          required
        />
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 12 }}>
          <label htmlFor="language" style={{ marginRight: 8 }}>Language:</label>
          <select
            id="language"
            value={language}
            onChange={e => setLanguage(e.target.value)}
            style={{ padding: 6, borderRadius: 6, border: '1px solid #333', fontSize: 16 }}
          >
            {LANGUAGES.map(lang => (
              <option key={lang.value} value={lang.value}>{lang.label}</option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          disabled={loading || !question.trim()}
          style={{ background: '#00e676', color: '#181f2a', padding: '10px 24px', border: 'none', borderRadius: 8, fontWeight: 'bold', fontSize: 18, cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1 }}
        >
          {loading ? 'Transmitting...' : 'Send Transmission'}
        </button>
      </form>
      {error && <div style={{ color: '#ff5252', marginBottom: 16 }}>🛸 {error}</div>}
      {response && (
        <div className="alien-response" style={{ background: '#232b3a', borderRadius: 12, padding: 20, marginTop: 12, boxShadow: '0 2px 8px #0006' }}>
          {response.insight && (
            <section style={{ marginBottom: 18 }}>
              <h3 style={{ color: '#b3e5fc', fontSize: 22 }}>🛸 ALIEN INSIGHT</h3>
              <div style={{ whiteSpace: 'pre-line', fontSize: 17 }}>{response.insight}</div>
            </section>
          )}
          {response.code && (
            <section style={{ marginBottom: 18 }}>
              <h3 style={{ color: '#b3e5fc', fontSize: 22 }}>👽 EARTHLING-FRIENDLY CODE</h3>
              <pre style={{ background: '#10151e', color: '#b9f6ca', padding: 16, borderRadius: 8, overflowX: 'auto', fontSize: 15 }}>
                <code>{response.code}</code>
              </pre>
            </section>
          )}
          {response.principles && (
            <section style={{ marginBottom: 18 }}>
              <h3 style={{ color: '#b3e5fc', fontSize: 22 }}>🌌 UNIVERSAL PRINCIPLES</h3>
              <div style={{ whiteSpace: 'pre-line', fontSize: 17 }}>{response.principles}</div>
            </section>
          )}
          {response.related && (
            <section style={{ marginBottom: 18 }}>
              <h3 style={{ color: '#b3e5fc', fontSize: 22 }}>🔮 RELATED TRANSMISSIONS</h3>
              <div style={{ whiteSpace: 'pre-line', fontSize: 17 }}>{response.related}</div>
            </section>
          )}
          {response.nextMission && (
            <section>
              <h3 style={{ color: '#b3e5fc', fontSize: 22 }}>⚡ NEXT MISSION</h3>
              <div style={{ whiteSpace: 'pre-line', fontSize: 17 }}>{response.nextMission}</div>
            </section>
          )}
          <div style={{ marginTop: 18, fontSize: 13, color: '#90caf9' }}>
            <span>Transmission time: {new Date(response.timestamp).toLocaleString()}</span>
          </div>
        </div>
      )}
    </div>
  );
}
