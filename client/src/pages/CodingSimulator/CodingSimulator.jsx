import React, { useState } from 'react';
import api from '../../utils/api';

const LANGUAGES = [
  { id: 109, name: 'Python 3', slug: 'python' },
  { id: 102, name: 'JavaScript (Node.js)', slug: 'javascript' },
  { id: 105, name: 'C++ 17', slug: 'cpp' },
  { id: 91, name: 'Java', slug: 'java' },
  { id: 107, name: 'Go', slug: 'go' },
  { id: 72, name: 'Ruby', slug: 'ruby' },
];

const STARTERS = {
  python: '# Write your Python solution below\ndef solution():\n    pass\n\nprint(solution())\n',
  javascript: '// Write your JavaScript solution below\nfunction solution() {\n    \n}\n\nconsole.log(solution());\n',
  cpp: '#include <iostream>\nusing namespace std;\n\nint main() {\n    // Your C++ solution here\n    cout << "Hello, World!" << endl;\n    return 0;\n}\n',
  java: 'public class Main {\n    public static void main(String[] args) {\n        // Your Java solution here\n        System.out.println("Hello, World!");\n    }\n}\n',
  go: 'package main\nimport "fmt"\n\nfunc main() {\n    // Your Go solution here\n    fmt.Println("Hello, World!")\n}\n',
  ruby: '# Ruby solution\ndef solution\n  \nend\n\nputs solution\n',
};

const STATUS_COLORS = {
  Accepted:                  'var(--color-success)',
  'Wrong Answer':            'var(--color-danger)',
  'Compilation Error':       'var(--color-danger)',
  'Runtime Error (NZEC)':    'var(--color-danger)',
  'Runtime Error (SIGSEGV)': 'var(--color-danger)',
  'Rate Limited':            'var(--color-warning)',
  'Config Error':            'var(--color-warning)',
  Timeout:                   'var(--color-warning)',
  Error:                     'var(--color-danger)',
};

/**
 * All Judge0 calls go through our own backend /api/execute route.
 * The JUDGE0_API_KEY lives in server/.env and is NEVER sent to the browser.
 */
async function runCode(sourceCode, languageId) {
  try {
    const res = await api.post('/execute', { sourceCode, languageId });
    return res.data;
  } catch (err) {
    const data = err.response?.data;
    if (data) return data; // Structured error from our backend
    const status = err.response?.status;
    if (status === 429) return { error: true, status: { description: 'Rate Limited' }, stderr: 'Too many requests — please wait before running again.' };
    if (status === 503) return { error: true, status: { description: 'Config Error' }, stderr: 'The server is missing its JUDGE0_API_KEY. Add it to server/.env.' };
    return { error: true, status: { description: 'Error' }, stderr: `Unexpected error (${status ?? 'network'}): ${err.message}` };
  }
}

export default function CodingSimulator() {
  const [lang, setLang] = useState(LANGUAGES[0]);
  const [code, setCode] = useState(STARTERS[LANGUAGES[0].slug]);
  const [result, setResult] = useState(null);
  const [running, setRunning] = useState(false);

  const handleLangChange = (id) => {
    const l = LANGUAGES.find((x) => x.id === parseInt(id));
    setLang(l);
    setCode(STARTERS[l.slug]);
    setResult(null);
  };

  const handleRun = async () => {
    setRunning(true);
    setResult(null);
    const out = await runCode(code, lang.id);
    setResult(out);
    setRunning(false);
  };

  const statusDesc = result?.status?.description;
  const statusColor = STATUS_COLORS[statusDesc] || 'var(--color-muted)';
  const isError = result?.error || !!result?.stderr || !!result?.compile_output;
  const outputText = result?.stdout || result?.stderr || result?.compile_output || '';
  const outputColor = (result?.stderr || result?.compile_output) ? 'var(--color-danger)' : 'var(--color-text)';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-4 sm:space-y-6 animate-fadeInUp">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Coding Lab</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--color-muted)' }}>
            Write &amp; run code — executed securely via server-side Judge0 proxy
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <select
            className="input"
            value={lang.id}
            onChange={(e) => handleLangChange(e.target.value)}
          >
            {LANGUAGES.map((l) => <option key={l.id} value={l.id}>{l.name}</option>)}
          </select>
          <button
            className="btn-primary whitespace-nowrap"
            onClick={handleRun}
            disabled={running}
            style={{ minWidth: '110px' }}
          >
            {running ? '⏳ Running…' : '▶  Run Code'}
          </button>
        </div>
      </div>



      {/* Rate-limit banner */}
      {result?.status?.description === 'Rate Limited' && (
        <div
          className="p-4 rounded-xl text-sm animate-fadeInUp"
          style={{ background: 'rgba(210,153,34,0.1)', border: '1px solid rgba(210,153,34,0.3)', color: 'var(--color-warning)' }}
        >
          ⏱️ Judge0 rate limit reached. Please wait a moment and try again.
        </div>
      )}

      {/* Editor + Output split */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4" style={{ minHeight: '400px' }}>
        {/* Editor Panel */}
        <div className="card flex flex-col" style={{ padding: 0, overflow: 'hidden' }}>
          <div
            className="flex items-center justify-between px-4 py-2.5"
            style={{ borderBottom: '1px solid var(--color-border)', background: 'var(--color-surface2)' }}
          >
            <span className="text-sm font-medium">{lang.name}</span>
            <button
              onClick={() => { setCode(STARTERS[lang.slug]); setResult(null); }}
              className="text-xs px-2.5 py-1 rounded"
              style={{ background: 'var(--color-border)', color: 'var(--color-muted)', border: 'none', cursor: 'pointer' }}
            >
              Reset
            </button>
          </div>
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            spellCheck={false}
            className="flex-1 resize-none outline-none p-4 font-mono text-sm"
            style={{
              background: '#0d1117',
              color: '#e6edf3',
              lineHeight: '1.65',
              minHeight: '320px',
              tabSize: 2,
            }}
            onKeyDown={(e) => {
              // Tab inserts 2 spaces instead of losing focus
              if (e.key === 'Tab') {
                e.preventDefault();
                const { selectionStart: s, selectionEnd: end } = e.target;
                const next = code.substring(0, s) + '  ' + code.substring(end);
                setCode(next);
                requestAnimationFrame(() => { e.target.selectionStart = e.target.selectionEnd = s + 2; });
              }
            }}
          />
        </div>

        {/* Output Panel */}
        <div className="card flex flex-col" style={{ padding: 0, overflow: 'hidden' }}>
          <div
            className="flex items-center gap-3 px-4 py-2.5"
            style={{ borderBottom: '1px solid var(--color-border)', background: 'var(--color-surface2)' }}
          >
            <span className="text-sm font-medium">Output</span>
            {result && (
              <span
                className="badge text-xs"
                style={{
                  background: `${statusColor}20`,
                  color: statusColor,
                  border: `1px solid ${statusColor}40`,
                }}
              >
                {statusDesc}
              </span>
            )}
            {result?.time && (
              <span className="text-xs ml-auto" style={{ color: 'var(--color-muted)' }}>
                ⏱ {result.time}s &nbsp;|&nbsp; 🧠 {result.memory} KB
              </span>
            )}
          </div>
          <div
            className="flex-1 p-4 font-mono text-sm overflow-auto"
            style={{
              minHeight: '320px',
              color: outputColor,
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
            }}
          >
            {running ? (
              <span style={{ color: 'var(--color-muted)' }}>
                ⏳ Submitting to Judge0 and polling for result…
              </span>
            ) : outputText ? (
              outputText
            ) : (
              <span style={{ color: 'var(--color-muted)' }}>
                Output will appear here after you run your code.
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Architecture note */}
      <div
        className="p-3 rounded-lg text-xs"
        style={{ background: 'var(--color-surface2)', border: '1px solid var(--color-border)', color: 'var(--color-muted)' }}
      >
        🔒 <strong style={{ color: 'var(--color-text)' }}>Security note:</strong> Code is sent to <code>/api/execute</code> on your Express server, which proxies it securely to the public Judge0 CE instance.
      </div>
    </div>
  );
}
