import React, { useEffect, useState } from "react";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { db, auth } from "../firebase";
import { useLocation, useNavigate } from "react-router-dom";
import { storage } from "../firebase";

import "firebase/firestore";
import "firebase/storage"; // <----
import "../App.css";
import { toast } from "react-toastify";

function CreatePost(props) {
  const location = useLocation();
  let isEditing = false;

  const { isAuth } = props;
  const [post, setPost] = useState("");
  const [title, setTitle] = useState("");
  const [postText, setPostText] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setconfirmPassword] = useState("");
  const [file, setFile] = useState("");
  const [error, setError] = useState("");
  let postid = "";

  if (location && location.state && location.state.currentState) {
    isEditing = true;
    postid = location.state.id;
  }

  useEffect(() => {
    if (isEditing) {
      const getPosts = async () => {
        const postDoc = doc(db, "posts", postid);
        const postData = await getDoc(postDoc);
        setPost(postData.data());
        setTitle(postData.data().title);
        setPostText(postData.data().postText);
      };

      getPosts();
    }
  }, [isEditing, postid]);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);
  };
  const upload = async () => {
    if (file) {
      const storageRef = storage().ref();
      const fileRef = storageRef.child(`files/${file.name}`);
      await fileRef.put(file);
      console.log("File uploaded successfully!");
    }
  };

  const postCollectionRef = collection(db, "posts");
  const navigate = useNavigate();

  const createPost = async () => {
    if (password !== confirmPassword) {
      setError({ password: "Passwords do not match" });
      return;
    }

    if (error != null) {
      await addDoc(postCollectionRef, {
        title,
        postText,
        author: {
          name: auth.currentUser.displayName,
          id: auth.currentUser.uid,
        },
        password,
        date: serverTimestamp(),
      });
      navigate("/posts");
    }
  };
  const savePost = async () => {
    const postRef = doc(postCollectionRef, postid);
    if (password !== confirmPassword) {
      setError({ password: "Passwords do not match" });
      return;
    }

    if (error != null) {
      await updateDoc(postRef, {
        title,
        postText,
        author: {
          name: auth.currentUser.displayName,
          id: auth.currentUser.uid,
        },
        password,
        date: serverTimestamp(),
      });
      toast.success("Successfully Posted!", {
        position: "top-center",
        autoClose: 1000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      navigate("/posts");
    }
  };

  const handlePasswordChange = (event) => {
    let error = {};
    setPassword(event.target.value);
    if (event.target.value !== confirmPassword) {
      error.password = "Passwords do not match";
    }
    setError(error);
  };

  const handleConfirmPasswordChange = (event) => {
    let error = {};
    setconfirmPassword(event.target.value);
    if (event.target.value !== password) {
      error.password = "Passwords do not match";
    }
    setError(error);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (isEditing) {
      savePost();
    } else {
      createPost();
    }
  };

  useEffect(() => {
    if (!isAuth) {
      navigate("/login");
    }
  }, []);

  return (
    <>
      <form onSubmit={handleSubmit}>
        <div className="post-container">
          <div className="post-box">
            <h1 className="post-title">
              {isEditing ? "Edit Post" : "Create A Post"}
            </h1>
            <div className="form-group">
              <label className="form-label">Title:</label>
              <input
                className="form-input"
                placeholder="Title..."
                value={title}
                required
                onChange={(event) => {
                  setTitle(event.target.value);
                }}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Post:</label>
              <textarea
                className="form-textarea"
                required
                style={{ width: "", height: "124px" }}
                placeholder="Post..."
                value={postText}
                onChange={(event) => {
                  setPostText(event.target.value);
                }}
              />
            </div>
            <div>
              <div className="form-group">
                <label className="form-label">
                  {isEditing ? "Reset Password:" : "Password:"}
                </label>
                <input
                  className="form-input"
                  style={{ borderColor: error.password ? "red" : "" }}
                  type="password"
                  placeholder="Password..."
                  onChange={handlePasswordChange}
                />
                <br />
                <br />
                <label className="form-label">
                  {isEditing ? "Confirm Reset Password" : "Confirm Password:"}
                </label>
                <input
                  className="form-input"
                  type="password"
                  style={{ borderColor: error.password ? "red" : "" }}
                  placeholder="Confirm Password..."
                  onChange={handleConfirmPasswordChange}
                />
                {error && <p style={{ color: "red" }}>{error.password}</p>}
              </div>
            </div>
            {/* <input type="file" onChange={handleFileChange} className="form-input" />
        <button onClick={upload}> Upload </button> */}
            <br />
            <br />
            <button className="btn btn-primary" type="submit">
              {isEditing ? "Save" : "Post"}
            </button>
          </div>
        </div>
      </form>
    </>
  );
}

export default CreatePost;
