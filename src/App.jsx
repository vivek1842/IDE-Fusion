import { BrowserRouter, Routes, Route } from "react-router-dom" 
import Home from "./pages/Home"
import Editor from "./pages/Editor"
import IDEFusion from "./pages/IDEFusion"

const App = () => {
  return (
    <>
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