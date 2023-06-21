import "./App.css";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Login from "./pages/Login"
import Home from "./pages/Home";
import CreatePost from "./pages/CreatePost"

function App() {
  return (
    <Router>
      <nav>
        <Link to="/" >Home</Link>
        <Link to="/createpost" >Post</Link>
        <Link to="/login" >Login</Link>

      </nav>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/createpost' element={<CreatePost/>}/>

      </Routes>

    </Router>
  )
}

export default App;
