import React, { useState } from "react";
import { FaPencil, FaTrashCan, FaUserTie } from "react-icons/fa6";
import Linkify from "react-linkify";
import { Link, useNavigate } from "react-router-dom";
import { Button, Modal } from "react-bootstrap";
import CreatePost from "../pages/CreateEditPost";

export default function Card({ postLists, onDelete, isAuth, isAdmin }) {
  const navigate = useNavigate();

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState("");

  const uid = localStorage.getItem("uid") || "";

  const openPost = (postId) => {
    sessionStorage.setItem("postId", postId);
    window.open("/view", "_blank");
  };

  const handleDelete = (props) => {
    onDelete(props);
    setShowDeleteModal(false);
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
                  {isAuth && (post.author.id === uid || isAdmin) && (
                    <div>
                      <button
                        style={{ padding: "5px 5px" }}
                        className="btn delete-button"
                        onClick={() => {
                          setDeleteId(post.id);
                          setShowDeleteModal(true);
                        }}
                      >
                        <FaTrashCan />
                      </button>
                      <Link
                        to={"/createpost"}
                        state={{ currentState: "edit", id: post.id }}
                      >
                        <button
                          className="btn edit-button"
                          style={{ padding: "0px" }}
                        >
                          <FaPencil />
                        </button>
                      </Link>
                    </div>
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

      <Modal
        show={showDeleteModal}
        keyboard={false}
        onHide={() => setShowDeleteModal(false)}
      >
        <Modal.Header>
          <Modal.Title>Delete Confirmation</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure to delete this post?
          <br />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={() => handleDelete(deleteId)}>
            Delete
          </Button>
          <Button
            variant="info"
            onClick={() => {
              setShowDeleteModal(false);
            }}
          >
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
