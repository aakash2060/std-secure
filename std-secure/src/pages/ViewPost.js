import { doc, getDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { db } from "../firebase";
import Linkify from "react-linkify";
import { Button, Modal } from "react-bootstrap";

function ViewPost() {
  // const location = useLocation();
  // const queryParams = new URLSearchParams(location.search);
  // const postId = queryParams.get("postId");

  const postId = sessionStorage.getItem("postId");

  // const postId = location.state.postId.toString();
  const [post, setPost] = useState(null);
  const [show, setShow] = useState(false);
  const [password, setPassword] = useState("");
  const [showPasswordModal, setShowPasswordModal] = useState(true);

  let pass = "";

  const getPosts = async () => {
    const postDoc = doc(db, "posts", postId);
    const postData = await getDoc(postDoc);
    setPost(postData.data());
    pass = postData.data().password;
  };

  useEffect(() => {
    const fetchData = async () => {
      await getPosts();
      setShowPasswordModal(true);
    };

    fetchData();
    const handleContextmenu = (e) => {
      e.preventDefault();
    };

    document.addEventListener("contextmenu", handleContextmenu);
    return function cleanup() {
      document.removeEventListener("contextmenu", handleContextmenu);
    };
  }, []);

  const handlePasswordSubmit = () => {
    const correctPassword = post?.password;
    if (password === correctPassword) {
      setShow(true);
      setShowPasswordModal(false);
    } else {
      alert("Incorrect password. Access denied.");
    }
  };

  if (!post) return null;

  return (
    <>
      <Modal show={showPasswordModal} keyboard={false}>
        <Modal.Header>
          <Modal.Title>Password</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Enter the password to get access
          <br />
          <input
            style={{
              borderRadius: "4px",
              boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
              padding: "5px",
              width: "100%",
              maxWidth: "200px",
              boxSizing: "border-box",
            }}
            type="password"
            placeholder="******"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          ></input>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handlePasswordSubmit}>
            Submit
          </Button>
        </Modal.Footer>
      </Modal>

      {show && (
        <div className="homepage">
          <div className="post" style={{ height: "90vh" }}>
            <div className="postHeader">
              <div className="title">
                <h1> {post.title}</h1>
              </div>
            </div>
            <div
              className="postTextContainer"
              style={{ height: "80%" }}
              onContextMenu={(e) => e.preventDefault()}
            >
              <Linkify
                componentDecorator={(decoratedHref, key) => (
                  <iframe
                    key={key}
                    id={postId}
                    src={decoratedHref}
                    height="90%"
                    width="100%"
                  ></iframe>
                )}
              >
                {post.postText}
              </Linkify>
            </div>
            {/* <h3>@{post.author.name}</h3> */}
          </div>
        </div>
      )}
    </>
  );
}

export default ViewPost;
