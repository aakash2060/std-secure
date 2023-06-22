import React, { useEffect, useState } from "react";
import { getDocs, collection, deleteDoc, doc } from "firebase/firestore";
import { auth, db } from "../firebase";
import { useNavigate } from "react-router-dom";
import Linkify from "react-linkify";

function Posts(props) {
  const { isAuth } = props;
  const navigate = useNavigate();
  const [postLists, setPostList] = useState([]);
  const postsCollectionRef = collection(db, "posts");

  async function deletePost(id) {
    const postDoc = doc(db, "posts", id);
    await deleteDoc(postDoc);
    getPosts();
  }
  const getPosts = async () => {
    const data = await getDocs(postsCollectionRef);
    setPostList(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
  };

  useEffect(() => {
    if (!isAuth) {
      navigate("/login");
    } else {
      getPosts();
    }
  }, []);
  


  return (
    <div className="homePage">
      {postLists.map((post) => {
        return (
          <div className="post">
            <div className="postHeader">
              <div className="title">
                <h1> {post.title}</h1>
              </div>
              <div className="deletePost">
                {isAuth && post.author.id === auth.currentUser.uid && (
                  <button
                    onClick={() => {
                      deletePost(post.id);
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      class="bi bi-trash"
                      viewBox="0 0 16 16"
                    >
                      <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6Z" />
                      <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1ZM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118ZM2.5 3h11V2h-11v1Z" />
                    </svg>
                  </button>
                )}
              </div>
              <button onClick={()=>{
                navigate('/view',{state:{postId:[post.id]}})
              }}>Open Post</button>
            </div>
            <div className="postTextContainer">
              <Linkify
                componentDecorator={(decoratedHref, decoratedText, key) => (
                  <>
                    <a
                      href={decoratedHref}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Click here to open the link
                    </a>
                  </>
                )}
              >
                {post.postText}
              </Linkify>
            </div>
            <h3>@{post.author.name}</h3>
          </div>
        );
      })}
    </div>
  );
}

export default Posts;
