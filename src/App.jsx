import { BrowserRouter, Routes, Route } from "react-router-dom" 
import Home from "./pages/Home"
import Editor from "./pages/Editor"
import IDEFusion from "./pages/IDEFusion"
import { Toaster } from "react-hot-toast"

const App = () => {
  return (
    <>
      <div><Toaster position="top-right" toastOptions={
        {
          success: {
            iconTheme:{
              primary: '#22c55e'
            },
            style: {
              background: '#252742',
              color: '#e5e7eb'
            }
          },
          error: {
            iconTheme:{
              primary: '#ff4b4b'
            },
            style: {
              background: '#252742',
              color: '#e5e7eb'
            }
          }
        }
      } /></div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<IDEFusion />}></Route>
          <Route path="/editor/:roomId" element={<Editor />}></Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App