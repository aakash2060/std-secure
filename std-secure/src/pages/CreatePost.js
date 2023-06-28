import React, { useEffect, useState } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db, auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import { storage } from "../firebase";
import "firebase/firestore";
import "firebase/storage"; // <----
import "../App.css"

function CreatePost(props) {
  const { isAuth } = props;
  const [title, setTitle] = useState("");
  const [postText, setPostText] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setconfirmPassword] = useState("");
  const [file, setFile] = useState("");
  const [error, setError] = useState("");

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
    createPost();
  };

  useEffect(() => {
    if (!isAuth) {
      navigate("/login");
    }
  }, []);

  return (
    <form onSubmit={handleSubmit}>
      <div className="post-container">
        <div className="post-box">
          <h1 className="post-title">Create A Post</h1>
          <div className="form-group">
            <label className="form-label">Title:</label>
            <input
              className="form-input"
              placeholder="Title..."
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
              onChange={(event) => {
                setPostText(event.target.value);
              }}
            />
          </div>
          <div>
            <div className="form-group">
              <label className="form-label">Password:</label>
              <input
                className="form-input"
                style={{ borderColor: error.password ? "red" : "" }}
                type="password"
                placeholder="Password..."
                onChange={handlePasswordChange}
              />
              <br />
              <label className="form-label">Confirm Password:</label>
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
            Post
          </button>
        </div>
      </div>
    </form>
  );
}

export default CreatePost;
