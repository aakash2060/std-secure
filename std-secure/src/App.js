import "bootstrap/dist/css/bootstrap.css";
import "./App.css";

import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Login from "./pages/Login";
import CreatePost from "./pages/CreatePost";
import { useEffect, useState } from "react";
import { signOut } from "firebase/auth";
import { auth, db } from "./firebase";
import Landing from "./pages/Landing";
import Posts from "./pages/Posts";
import ViewPost from "./pages/ViewPost";
import "./auth/create-admin";
import IsAuth from "./auth/isAuth";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";

function App() {
  const AUTO_LOGOUT_TIME = 60 * 30 * 1000; // 30 min
  const [isAuth, setIsAuth] = useState(() => {
    const storedAuth = localStorage.getItem("isAuth");
    return storedAuth ? JSON.parse(storedAuth) : false;
  });
  const [isAdmin, setisAdmin] = useState(false);

  const uid = localStorage.getItem("uid") || "";

  function Unauthorized() {
    return window.alert("UNAUTHORIZED. CALLING 911");
  }

  const signUserOut = () => {
    signOut(auth).then(() => {
      localStorage.clear();
      setIsAuth(false);
      window.location.pathname = "/";
    });
  };

  const checkAdmin = async () => {
    const userDocRef = collection(db, "users");
    const getUser = await getDocs(userDocRef);
    getUser.forEach((doc) => {
      if (doc.data().id == uid) {
        if (doc.data().isAdmin == true) {
          setisAdmin(true);
        }
      }
    });
  };

  useEffect(() => {
    checkAdmin();
  }, [uid]);

  useEffect(() => {
    let timer;
    const handleUserActivity = () => {
      clearTimeout(timer);
      timer = setTimeout(() => signUserOut(), AUTO_LOGOUT_TIME);
    };

    document.addEventListener("mousemove", handleUserActivity);
    document.addEventListener("keydown", handleUserActivity);

    return () => {
      document.removeEventListener("mousemove", handleUserActivity);
      document.removeEventListener("keydown", handleUserActivity);
    };
  }, []);

  return (
    <>
      <nav>
        <Link to="/">Home</Link>
        {!isAuth ? (
          <Link to="/login">Login</Link>
        ) : (
          <>
            <Link to="/posts">Post</Link>
            {isAdmin && (
              <div>
                <Link to="/createpost">Create Post</Link>
              </div>
            )}
            <Link onClick={signUserOut}>Log Out</Link>
          </>
        )}
      </nav>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/posts" element={<Posts isAuth={isAuth} />} />
        <Route path="/view" element={<ViewPost />} />
        <Route path="/login" element={<Login setIsAuth={setIsAuth} />} />
        {isAdmin ? (
          <Route path="/createpost" element={<CreatePost isAuth={isAuth} />} />
        ) : (
          <Route path="/createpost" element={<Unauthorized />} />
        )}
      </Routes>
    </>
  );
}

export default App;
