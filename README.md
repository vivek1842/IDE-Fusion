# IDE Fusion 🔥

**Real-Time Collaborative Code Editor with Multi-User Syncing & Live Execution**

[![Live Demo](https://img.shields.io/badge/demo-live-brightgreen)](https://ide-fusion.vercel.app)
![Tech Stack](https://img.shields.io/badge/stack-MERN-61DAFB?logo=react&logoColor=white)

A Google Docs-style collaborative coding environment where developers can:
- 👥 **Code together in real-time** with live cursor synchronization
- 🎨 **See teammates' cursors** with unique colors and username labels
- 💻 **Execute code** directly in 5+ languages (JavaScript, Python, Java, etc.)
- 🔗 **Share rooms** via unique URLs with auto-generated IDs
- 📱 **Responsive UI** optimized for desktop and tablet

## 🌟 Key Features
- **Real-Time Collaboration**  
  Multi-user code syncing with <100ms latency using WebSocket
- **Smart Cursor Tracking**  
  Color-coded cursors with username tooltips (persistent for 2s)
- **Code Execution Sandbox**  
  Integrated with Judge0 API for safe code execution
- **Room Management**  
  Auto-cleanup of empty rooms and code history
- **Modern Editor Features**  
  Syntax highlighting, auto-completion, and VSCode-like shortcuts

## 🛠 Tech Stack
| Frontend               | Backend              | Services          |
|------------------------|----------------------|-------------------|
| React + Vite           | Node.js/Express      | Socket.io         |
| Monaco Editor (VS Code)| WebSocket Server     | Judge0 API        |
| Tailwind CSS           | Redis (Optional)     | GSAP Animations   |
| React Router           | UUID Generation      | Clipboard API     |

## 🧠 Concepts Demonstrated
- **Real-Time Communication**  
  WebSocket-based bidirectional event handling
- **Conflict Resolution**  
  Last-write-wins strategy for code synchronization
- **Cursors-as-a-Service**  
  Dynamic CSS injection for multi-user cursors
- **State Management**  
  Optimized React state updates for collaborative editing
- **Security**  
  Code sanitization and isolated execution environments

## 🚀 Getting Started
1. Clone repo & install dependencies:
```bash
git clone https://github.com/yourusername/ide-fusion.git
cd ide-fusion && npm install
```
2. Configure environment variables:
```env
VITE_SERVER_URL=ws://localhost:5000
JUDGE0_API_KEY=your_api_key
```
3. Start development servers:
```bash
npm run dev  # Frontend (Port 5173)
npm run server  # Backend (Port 5000)
```

**Like the project?** ⭐ Star the repo to support development!
```
