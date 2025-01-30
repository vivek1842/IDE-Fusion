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

      // listening JOINED Event
      socketRef.current.on(Actions.JOINED, ({ clients, username, socketId}) => {
        if(username !== location.state?.username) {
          toast.success(`${username} joined the room.`)
          console.log(`${username} joined`);
        }
        // const uniqueClients = Array.from(new Set(clients.map(client => client.socketId)))
        // .map(socketId => {
        //   return clients.find(client => client.socketId === socketId);
        // });

        setUsers(clients);
      })
      
    }

    init();
    console.log('Users : '+users);
    
    return () => {
      localStorage.removeItem(`user-connected-${roomId}`); // Cleanup when the user leaves

      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
      isSocketInitialized.current = false; 
    };


  },[location.state, reactNavigator, roomId])

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
        className="w-full sm:w-64 md:w-72 bg-gradient-to-b from-[#161b22] to-[#10121b] shadow-xl p-4 sm:p-6 flex flex-col justify-between"
      >
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#4fb0ff] mb-4 sm:mb-6">
            IDE Fusion
          </h2>
          <p className="text-sm text-gray-400 mb-4 sm:mb-6">
            <b>Room ID:</b> <i>{roomId}</i>
          </p>
          {/* Grid layout for users */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {users.map((user) => (
              <div
                key={user.socketId}
                className="flex flex-col items-center gap-2 sm:gap-3"
              >
                <Avatar
                  name={user.username}
                  size="40"
                  round="10px"
                  className="sm:w-12 sm:h-12"
                />
                <span className="font-medium text-sm sm:text-base text-center break-words">
                  {user.username}
                </span>
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-3 mt-6 sm:mt-8">
          <button
            onClick={handleCopyRoomId}
            className="w-full bg-[#4fb0ff] hover:bg-[#3998e6] text-[#10121b] py-2 sm:py-3 rounded-lg font-semibold transition-all duration-200 focus:outline-none focus:ring focus:ring-[#4fb0ff]/50"
          >
            Copy Room ID
          </button>
          <button className="w-full bg-red-500 hover:bg-red-400 text-white py-2 sm:py-3 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring focus:ring-red-500/50">
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
          height={showOutput ? "50vh" : "80vh"}
          defaultLanguage="javascript"
          value={code}
          onChange={(value) => setCode(value || "")}
          theme="vs-dark"
          options={{
            fontSize: 16,
            minimap: { enabled: false },
            scrollbar: { verticalScrollbarSize: 6 },
            wordWrap: "on",
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
