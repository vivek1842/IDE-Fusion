import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import Editor from '@monaco-editor/react';
import Avatar from 'react-avatar';

const EditorPage = () => {
  const [users, setUsers] = useState([
    { socketsId: 1, name: 'Rakesh K', color: '#4fb0ff' },
    { socketsId: 2, name: 'Priya S', color: '#ff6f91' },
  ]);
  const [roomId] = useState('1234-5678-9012');
  const [code, setCode] = useState('// Write your code here');
  const [output, setOutput] = useState('');
  const [showOutput, setShowOutput] = useState(false);
  const [language, setLanguage] = useState('javascript'); // Default language
  const [customInput, setCustomInput] = useState('');

  const sidebarRef = useRef(null);
  const editorRef = useRef(null);

  useEffect(() => {
    gsap.fromTo(
      sidebarRef.current,
      { x: -50, opacity: 0 },
      { x: 0, opacity: 1, duration: 1, ease: 'power3.out' }
    );

    gsap.fromTo(
      editorRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 1, delay: 0.5, ease: 'power3.out' }
    );
  }, []);

  const handleCopyRoomId = () => {
    navigator.clipboard.writeText(roomId);
    alert('Room ID copied to clipboard!');
  };

  const handleRunCode = async () => {
    setShowOutput(false);

    // API request to execute the code
    const response = await fetch('https://api.judge0.com/submissions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        source_code: code,
        language_id: mapLanguageToId(language),
        stdin: customInput,
      }),
    });

    const { token } = await response.json();

    // Fetch result
    const resultResponse = await fetch(`https://api.judge0.com/submissions/${token}`);
    const result = await resultResponse.json();

    setOutput(result.stdout || result.stderr || 'No output');
    setShowOutput(true);
  };

  const mapLanguageToId = (language) => {
    const languages = {
      javascript: 63,
      python: 71,
      java: 62,
      c: 50,
      'c++': 54,
    };
    return languages[language] || 63; // Default to JavaScript
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-[#0f0f16] via-[#10121b] to-[#1c1f26] text-gray-200">
      {/* Sidebar */}
      <aside
        ref={sidebarRef}
        className="w-64 bg-gradient-to-b from-[#161b22] to-[#10121b] shadow-xl p-4 flex flex-col justify-between"
      >
        <div>
          <h2 className="text-2xl font-extrabold text-[#4fb0ff] mb-4">IDE Fusion</h2>
          <p className="text-sm text-gray-400 mb-6 italic">Room ID: {roomId}</p>
          <div className="space-y-4">
            {users.map((user) => (
              <div
                key={user.socketsId}
                className="flex items-center gap-3 p-3 rounded-lg bg-[#252742] hover:bg-[#2e3248] transition-all duration-150"
              >
                <Avatar name={user.name} size="40" round="10px" />
                <span className="font-medium">{user.name}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-3">
          <button
            onClick={handleCopyRoomId}
            className="w-full bg-[#4fb0ff] hover:bg-[#3998e6] text-[#10121b] py-2 rounded-lg font-semibold transition-all duration-200 focus:outline-none focus:ring focus:ring-[#4fb0ff]/50"
          >
            Copy Room ID
          </button>
          <button
            className="w-full bg-red-500 hover:bg-red-400 text-white py-2 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring focus:ring-red-500/50"
          >
            Leave
          </button>
        </div>
      </aside>

      {/* Code Editor */}
      <main
        ref={editorRef}
        className="flex-1 p-6 bg-[#0f0f16] shadow-inner rounded-tl-xl"
      >
        {/* Top Bar */}
        <div className="flex items-center justify-between mb-4">
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="bg-[#252742] text-gray-200 px-4 py-2 rounded-lg focus:outline-none focus:ring focus:ring-[#4fb0ff]/50"
          >
            <option value="javascript">JavaScript</option>
            <option value="python">Python</option>
            <option value="java">Java</option>
            <option value="c">C</option>
            <option value="c++">C++</option>
          </select>
          <button
            onClick={handleRunCode}
            className="bg-[#4caf50] hover:bg-[#3e8c41] text-white py-2 px-4 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring focus:ring-[#4caf50]/50"
          >
            Run Code
          </button>
        </div>

        {/* Editor */}
        <Editor
          height={showOutput ? '50vh' : '80vh'}
          defaultLanguage="javascript"
          value={code}
          onChange={(value) => setCode(value || '')}
          theme="vs-dark"
          options={{
            fontSize: 16,
            minimap: { enabled: false },
            scrollbar: { verticalScrollbarSize: 6 },
            wordWrap: 'on',
            scrollBeyondLastLine: false,
            smoothScrolling: true,
          }}
        />

        {/* Custom Input */}
        <textarea
          value={customInput}
          onChange={(e) => setCustomInput(e.target.value)}
          placeholder="Enter custom input here (if any)"
          className="mt-4 w-full bg-[#252742] text-gray-200 p-2 rounded-lg focus:outline-none focus:ring focus:ring-[#4fb0ff]/50"
          rows={3}
        ></textarea>

        {/* Output */}
        {showOutput && (
          <div className="mt-4 bg-[#252742] text-gray-200 p-4 rounded-lg shadow-lg">
            <h3 className="text-lg font-bold text-[#4fb0ff]">Output:</h3>
            <pre className="mt-2 whitespace-pre-wrap text-sm">{output}</pre>
          </div>
        )}
      </main>
    </div>
  );
};

export default EditorPage;
