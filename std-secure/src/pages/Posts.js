import React, { useEffect, useState } from "react";
import {
  getDocs,
  collection,
  deleteDoc,
  doc,
  orderBy,
  query,
} from "firebase/firestore";
import { db } from "../firebase";
import { useNavigate } from "react-router-dom";
import Card from "../components/Card";
import { ToastContainer } from "react-bootstrap";

function Posts({ isAuth, isAdmin }) {
  const navigate = useNavigate();
  const [postLists, setPostList] = useState([]);
  const [loading, isLoading] = useState(true);
  const postsCollectionRef = collection(db, "posts");

  async function deletePost(id) {
    const postDoc = doc(db, "posts", id);
    await deleteDoc(postDoc);
    getPosts();
  }

  const getPosts = async () => {
    const q = query(postsCollectionRef, orderBy("date", "desc"));
    const data = await getDocs(q);
    setPostList(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    isLoading(false);
  };

  useEffect(() => {
    if (!isAuth) {
      navigate("/login");
    } else {
      getPosts();
    }
  }, []);
  if (loading) {
    return <div> </div>;
  }

  return (
    <div className="homePage">
      <ToastContainer />

      {postLists.length === 0 ? (
        <div className="homepage-announcement">
          <strong>
            At this time, we do not have any new announcements to share.
            <br />
            Please check back later for updates
          </strong>
        </div>
      ) : (
        <Card
          postLists={postLists}
          onDelete={deletePost}
          isAuth={isAuth}
          isAdmin={isAdmin}
        />
      )}
    </div>
  );
}

export default Posts;
