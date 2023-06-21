import React, { useEffect, useState } from "react";
import { addDoc, collection } from "firebase/firestore";
import { db, auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import { storage } from "../firebase";
import 'firebase/storage';  // <----

function CreatePost(props) {
  const {isAuth} = props;
  const [title, setTitle] = useState("");
  const [postText, setPostText] = useState("");
  const [file, setFile] = useState("");

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
    await addDoc(postCollectionRef, {
      title,
      postText,
      author: { name: auth.currentUser.displayName, id: auth.currentUser.uid },
    });
    navigate("/");
  };

  
  useEffect(()=>{
    if(!isAuth){
      navigate("/login");
    }

  }, []);

  return (
    <div className="post-container">
      <div className="post-box">
        <h1 className="post-title">Create A Post</h1>
        <div className="form-group">
          <label className="form-label">Title:</label>
          <input
            className="form-input"
            placeholder="Title..."
            onChange={(event) => {
              setTitle(event.target.value);
            }}
          />
        </div>
        <div className="form-group">
          <label className="form-label">Post:</label>
          <textarea
            className="form-textarea"
            style={{ width: "392px", height: "124px" }}
            placeholder="Post..."
            onChange={(event) => {
              setPostText(event.target.value);
            }}
          />
        </div>
        <input type="file" onChange={handleFileChange} className="form-input" />
        <button onClick={upload}> Upload </button><br/><br/>
        <button className="btn btn-primary" type="submit" onClick={createPost}>
          Post
        </button>
      </div>
    </div>
  );
}

export default CreatePost;
