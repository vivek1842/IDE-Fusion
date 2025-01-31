/* eslint-disable react/prop-types */
import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import Editor from '@monaco-editor/react';
import Avatar from 'react-avatar';
import { initSocket } from '../socket';
import Actions from '../Actions';
import { Navigate, useLocation, useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';

const EditorPage = () => {

  const [code, setCode] = useState('// Write your code here');
  const [output, setOutput] = useState('');
  const [showOutput, setShowOutput] = useState(false);
  const [language, setLanguage] = useState('javascript'); // Default language
  const [customInput, setCustomInput] = useState('');

  const isUserTyping = useRef(false);

  const sidebarRef = useRef(null);
  const editorRef = useRef(null);


  const socketRef = useRef(null);
  const location = useLocation();
  
  const {roomId} = useParams();
  // const params = useParams();
  // console.log(params);

  const [users, setUsers] = useState([]);

  
  const reactNavigator = useNavigate();

  const isSocketInitialized = useRef(false);

  useEffect(() => {
    // GSAP Animation
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

    console.log('EditorPage component mounted');
    if (isSocketInitialized.current) return; // Prevent multiple initializations
    isSocketInitialized.current = true;

    const isUserAlreadyConnected = localStorage.getItem(`user-connected-${roomId}`);
    if (isUserAlreadyConnected) {
        return; // Avoid creating a second socket connection if already connected
    }

    localStorage.setItem(`user-connected-${roomId}`, 'true');

    const init = async () => {
      socketRef.current = await initSocket();

      socketRef.current.on('connect_error', (err) => handleErrors(err));
      socketRef.current.on('connect_failed', (err) => handleErrors(err));

      const handleErrors = (e) => {
        console.log("Socket error:"+e);
        toast.error('Socket connection failed, Try again later.');
        reactNavigator('/');
      }

      socketRef.current.emit(Actions.JOIN, {
        roomId,
        username: location.state?.username,
      });
      console.log(roomId, location.state);

      // listening SYNC Users Event
      socketRef.current.on(Actions.SYNC_USERS, (clients) => {
        setUsers(clients);
      });

      // listening JOINED Event
      socketRef.current.on(Actions.JOINED, ({ clients, username, socketId}) => {
        if(username !== location.state?.username) {
          toast.success(`${username} joined the room.`)
          console.log(`${username} joined`);
        }
        setUsers(clients);
      })

      // listening DISCONNECTED Event
      socketRef.current.on(Actions.DISCONNECTED, ({ socketId, username}) => {
        toast.success(`${username} left the room.`);
        setUsers((prev) => {
          return prev.filter((user) => user.socketId !== socketId);
        })
      })

      //synchronization listener
      socketRef.current.on(Actions.CODE_CHANGE, (newCode) => {
        isUserTyping.current = false;
        setCode(newCode);
      });

      // Receive initial code when joining
      socketRef.current.on(Actions.SYNC_CODE, (code) => {
        setCode(code);
      });
      
    }

    init();
    console.log('Users : '+users);
    
    return () => {
      localStorage.removeItem(`user-connected-${roomId}`); // Cleanup when the user leaves

      if (socketRef.current) {
        socketRef.current.off(Actions.JOINED);
        socketRef.current.off(Actions.SYNC_USERS);
        socketRef.current.off(Actions.DISCONNECTED);
        socketRef.current.disconnect();
        socketRef.current = null;
      }
      isSocketInitialized.current = false; 
    };


  },[]);

  const handleEditorChange = (value) => {
    if (isUserTyping.current) {
      setCode(value);
      socketRef.current.emit(Actions.CODE_CHANGE, {
        roomId,
        code: value
      });
    }
  };


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

  if(!location.state) {
    return <Navigate to='/' />
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-[#0f0f16] via-[#10121b] to-[#1c1f26] text-gray-200">
      {/* Sidebar */}
      <aside
        ref={sidebarRef}
        className="w-full sm:w-64 md:w-72 bg-gradient-to-b from-[#161b22] to-[#10121b] shadow-xl p-4 sm:p-6 flex flex-col justify-between overflow-y-auto"
      >
        <div className="flex flex-col gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#4fb0ff] mb-3 sm:mb-4">
              IDE Fusion
            </h2>
            <p className="text-sm text-gray-400 mb-4 sm:mb-6 break-all">
              <b>Room ID:</b> <i>{roomId}</i>
            </p>
          </div>

          {/* Users Grid */}
          <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
            {users.map((user) => (
              <div
                key={user.socketId}
                className="flex flex-col items-center p-2 bg-[#252742] rounded-lg hover:bg-[#2e3248] transition-colors"
              >
                <Avatar
                  name={user.username}
                  size="40"
                  round="8px"
                  className="w-10 h-10 sm:w-12 sm:h-12"
                />
                <span className="font-medium text-xs sm:text-sm text-center mt-2 break-all line-clamp-1">
                  {user.username}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3 mt-6 sm:mt-8">
          <button
            onClick={handleCopyRoomId}
            className="w-full bg-[#4fb0ff] hover:bg-[#3998e6] text-[#10121b] py-2 sm:py-2.5 rounded-md font-semibold text-sm sm:text-base transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#4fb0ff]/50"
          >
            Copy Room ID
          </button>
          <button className="w-full bg-red-500/90 hover:bg-red-400/90 text-white py-2 sm:py-2.5 rounded-md font-medium text-sm sm:text-base transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-500/50">
            Leave Room
          </button>
        </div>
      </aside>

      {/* Main Editor Area */}
      <main
        ref={editorRef}
        className="flex-1 flex flex-col min-w-0 p-4 sm:p-6 bg-[#0f0f16]"
      >
        {/* Editor Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4 sm:mb-6">
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="w-full sm:w-48 bg-[#252742] text-gray-200 px-4 py-2 rounded-md text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-[#4fb0ff]/50"
          >
            <option value="javascript">JavaScript</option>
            <option value="python">Python</option>
            <option value="java">Java</option>
            <option value="c">C</option>
            <option value="c++">C++</option>
          </select>

          <button
            onClick={handleRunCode}
            className="w-full sm:w-auto bg-[#4caf50] hover:bg-[#3e8c41] text-white px-6 py-2 rounded-md font-medium text-sm sm:text-base transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#4caf50]/50"
          >
            Run Code
          </button>
        </div>

        {/* Editor Content */}
        <div className="flex-1 flex flex-col gap-4">
          <div className="flex-1 overflow-hidden">
            <Editor
              height="100%"
              defaultLanguage="javascript"
              value={code}
              onChange={handleEditorChange}
              theme="vs-dark"
              options={{
                fontSize: 14,
                minimap: { enabled: false },
                scrollbar: { verticalScrollbarSize: 6 },
                wordWrap: "on",
                scrollBeyondLastLine: false,
                smoothScrolling: true,
                automaticLayout: true,
                cursorBlinking: "smooth",
                cursorStyle: "line",
                cursorWidth: 2,
                quickSuggestions: false,
                suggestOnTriggerCharacters: false,
                selectionHighlight: false,
                renderLineHighlight: "none",
                lineNumbersMinChars: 3,
                scrollBeyondLastColumn: 5,
              }}
              beforeMount={(monaco) => {
                monaco.editor.setTheme('vs-dark');
              }}
              onMount={(editor) => {
                // Enable typing detection
                editor.onDidChangeCursorPosition(() => {
                  isUserTyping.current = true;
                });
                
                editor.onDidBlurEditorWidget(() => {
                  isUserTyping.current = false;
                });
              }}
            />
          </div>

          {/* Custom Input */}
          <textarea
            value={customInput}
            onChange={(e) => setCustomInput(e.target.value)}
            placeholder="Enter custom input here..."
            className="w-full bg-[#252742] text-gray-200 p-3 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#4fb0ff]/50 resize-y min-h-[100px] max-h-[200px]"
          />

          {/* Output */}
          {showOutput && (
            <div className="bg-[#252742] text-gray-200 p-4 rounded-md shadow-lg">
              <h3 className="text-sm font-bold text-[#4fb0ff] mb-2">Output:</h3>
              <pre className="whitespace-pre-wrap text-sm font-mono overflow-auto max-h-[200px]">
                {output}
              </pre>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default EditorPage;
