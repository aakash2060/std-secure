import React, { useState } from "react";
import {
  FaPencil,
  FaTrashCan,
  FaUserTie,
  FaMagnifyingGlass,
  FaThumbsUp,
  FaRegThumbsUp,
} from "react-icons/fa6";
import Linkify from "react-linkify";
import { Link } from "react-router-dom";
import { Button, Modal } from "react-bootstrap";
import Countdown from "react-countdown";

export default function Card({
  postLists,
  onDelete,
  isAuth,
  isAdmin,
  setPostLists,
  getPosts,
}) {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState("");
  const [search, setSearch] = useState("");

  const uid = localStorage.getItem("uid") || "";

  const openPost = (postId) => {
    sessionStorage.setItem("postId", postId);
    window.open("/view", "_blank");
  };

  const onChangeSearch = (e) => {
    const searchValue = e.target.value;
    setSearch(searchValue);
    e.preventDefault();
    const searchRegex = new RegExp(search, "i");
    const filteredPosts = postLists.filter((post) =>
      post.title.match(searchRegex)
    );
    if (filteredPosts.length !== 0) {
      setPostLists(filteredPosts);
    }
    if (searchValue === "") {
      getPosts();
    }
    
  };

  const handleDelete = (props) => {
    onDelete(props);
    setShowDeleteModal(false);
  };
  const handleLikeClick = (postId) => {
    const updatedPostLists = postLists.map((post) =>
      post.id === postId ? { ...post, liked: !post.liked } : post
    );

    // Update the state with the new postLists data
    setPostLists(updatedPostLists);
  };

  const renderer = ({ days, hours, minutes, seconds, completed }) => {
    if (completed) {
      return;
    } else {
      return (
        <div>
          <div className="countdown-timer">
            <span style={{ color: "black", opacity: "0.8" }}>
              Time Remaining &nbsp;
            </span>
            {days > 0 ? `${days}:` : ""}
            {hours > 0 ? `${hours}:` : ""}
            &nbsp;{minutes}:&nbsp;
            {seconds} &nbsp;&nbsp;
          </div>

          {/* <div className="countdown-units">
          {hours === 1 ? "hour" : "hours"} {minutes === 1 ? "minute" : "minutes"}{" "}
          {seconds === 1 ? "second" : "seconds"}
        </div> */}
        </div>
      );
    }
  };

  return (
    <div className="homePage">
      <form onSubmit={onChangeSearch}>
        <div className="search-bar">
          <input
            type="text"
            value={search}
            onChange={onChangeSearch}
            style={{ width: "160px" }}
            placeholder="Search Topic..."
          />
          <span className="search-icon">
            <FaMagnifyingGlass />
          </span>
        </div>
      </form>
      {postLists.map((post, index) => {
        return (
          <div className="post" key={index}>
            {post.expiryDate === "" ||
            new Date(post.expiryDate).getTime() > new Date() ? (
              <div className="postWrapper">
                <div className="postTop">
                  <div className="postTopLeft">
                    <FaUserTie />
                    <span className="postUsername">{post.author.name}</span>
                    <span className="postDate">
                      {post.date.toDate().toLocaleString("en-US", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "numeric",
                        minute: "numeric",
                      })}
                    </span>
                  </div>
                  <div className="postTopRight">
                    {/* <div className="hover-message">
                        Text message will be sent to your contacts
                      </div> */}
                    <Countdown date={post.expiryDate} renderer={renderer} />

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
                        &nbsp;&nbsp;&nbsp;
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
                      componentDecorator={(
                        decoratedHref,
                        decoratedText,
                        key
                      ) => (
                        <a
                          key={key}
                          href={"_blank"}
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
                    <span
                      className="postLikeCounter"
                      onClick={() => handleLikeClick(post.id)}
                    >
                      {post.liked ? (
                        <FaThumbsUp color="green" />
                      ) : (
                        <FaRegThumbsUp />
                      )}
                    </span>
                  </div>
                  <div className="postBottomRight">
                    <span className="postCommenttext"> </span>
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <div className="postWrapper">
                  <div className="postTop">
                    <div className="postTopLeft">
                      <FaUserTie />
                      <span className="postUsername">{post.author.name}</span>
                      <span className="postDate" style={{ color: "red" }}>
                        {new Date(post.expiryDate).toLocaleString("en-US", {
                          month: "long",
                          day: "numeric",
                          weekday: "long",
                          year: "numeric",
                          hour: "numeric",
                          minute: "numeric",
                          hour12: true,
                        })}
                      </span>
                      <div className="hover-message">
                        <strong>Expired at</strong>
                      </div>
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
                          &nbsp;&nbsp;&nbsp;
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
                  <div className="postHeader" style={{ opacity: "0.5" }}>
                    <div className="title">
                      <h3>
                        <strong> {post.title}</strong>
                      </h3>
                    </div>
                  </div>
                  <div className="postCenter" style={{ opacity: "0.5" }}>
                    <div className="postTextContainer">
                      <center>
                        <p style={{ color: "red", fontSize: "20px" }}>
                          The post has been expired
                        </p>
                      </center>
                    </div>
                  </div>
                </div>
              </div>
            )}
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
