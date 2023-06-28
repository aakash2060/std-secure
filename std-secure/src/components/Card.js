import React from "react";
import { auth } from "../firebase";
import { FaTrashCan, FaUserTie } from "react-icons/fa6";
import Linkify from "react-linkify";
import { Link, useNavigate } from "react-router-dom";

export default function Card({ postLists, onDelete, isAuth }) {
  const navigate = useNavigate();

  const openPost = (postId) => {
    sessionStorage.setItem("postId", postId);
    window.open("/view", "_blank");
  };

  return (
    <div>
      {postLists.map((post, index) => {
        return (
          <div className="post" key={index}>
            <div className="postWrapper">
              <div className="postTop">
                <div className="postTopLeft">
                  <FaUserTie />
                  <span className="postUsername">{post.author.name}</span>
                  <span className="postDate">
                    {post.date.toDate().toLocaleString()}
                  </span>
                </div>
                <div className="postTopRight">
                  {isAuth && post.author.id === auth.currentUser.uid && (
                    <button
                      className="btn delete-button"
                      onClick={() => {
                        onDelete(post.id);
                      }}
                    >
                      <FaTrashCan />
                    </button>
                  )}
                </div>
              </div>
              <div className="postHeader">
                <div className="title">
                  <h3>
                    <strong> {post.title}</strong>
                  </h3>
                </div>
              </div>
              <div className="postCenter">
                <div className="postTextContainer">
                  <Linkify
                    componentDecorator={(decoratedHref, decoratedText, key) => (
                    
                        <a
                          key={key}
                          href={""}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {/* Open Post to See the Link */}
                        </a>
                     
                    )}
                  >
                    {post.postText}
                  </Linkify>
                </div>
                <center>
                  <button
                    type="button"
                    className="btn btn-outline-info"
                    onClick={() => openPost([post.id])}
                  >
                    Open Post
                  </button>
                </center>
              </div>
              <div className="postBottom">
                <div className="postBottomLeft">
                  bottom left
                  <span className="postLikeCounter"> people like it</span>
                </div>
                <div className="postBottomRight">
                  <span className="postCommenttext"> comments</span>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
