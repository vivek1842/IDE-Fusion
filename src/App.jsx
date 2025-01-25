import { BrowserRouter, Routes, Route } from "react-router-dom" 
import Home from "./pages/Home"
import Editor from "./pages/Editor"

const App = () => {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />}></Route>
          <Route path="/editor/:roomId" element={<Editor />}></Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App