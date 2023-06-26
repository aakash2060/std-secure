import { doc, getDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { db } from "../firebase";
import Linkify from "react-linkify";

function ViewPost() {
  const location = useLocation();
  // const PRESET_PASSWORD = "1234";

  const postId = location.state.postId.toString();
  const [post, setPost] = useState(null);
  const [show, setShow] = useState(false);
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
      const password = window.prompt(
        "Please enter the password to enter the website:"
      );
      if (password === pass) {
        setShow(true);
      } else {
        alert("Incorrect password. Access denied.");
      }
    };

    fetchData();
  }, []);

  if (!post) return null;

  return (
    <>
      {show && (
        <div className="homepage">
          <div className="post" style={{ height: "90vh" }}>
            <div className="postHeader">
              <div className="title">
                <h1> {post.title}</h1>
              </div>
              {/* ... */}
            </div>
            <div className="postTextContainer" style={{ height: "80%" }}>
              <Linkify
                componentDecorator={(decoratedHref, decoratedText, key) => (
                  <>
                    <iframe src={decoratedHref} height="90%" width="100%">
                      {" "}
                    </iframe>
                  </>
                )}
              >
                {post.postText}
              </Linkify>
            </div>
            <h3>@{post.author.name}</h3>
          </div>
        </div>
      )}
    </>
  );
}

export default ViewPost;
