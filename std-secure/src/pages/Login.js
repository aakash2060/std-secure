import React from "react";
import { auth, db, provider } from "../firebase";
import { useNavigate } from "react-router-dom";
import { signInWithPopup } from "firebase/auth";
import {
  addDoc,
  collection,
  doc,
  getDocs,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";

function Login({ setIsAuth }) {
  const navigate = useNavigate();
  const postCollectionRef = collection(db, "users");

  const signInWithGoogle = () => {
    signInWithPopup(auth, provider).then(async (result) => {
      localStorage.setItem("isAuth", true);
      setIsAuth(true);

      const name = auth.currentUser.displayName;
      const email = auth.currentUser.email;
      const id = auth.currentUser.uid;
      const date = serverTimestamp();
      const uid = auth.currentUser.uid;
      localStorage.setItem("uid", uid);
      

      const querySnapshot = await getDocs(
        query(postCollectionRef, where("email", "==", email))
      );
      if (querySnapshot.size > 0) {
        const docRef = doc(postCollectionRef, querySnapshot.docs[0].id);
        await updateDoc(docRef, {
          id,
          date,
          name,
          email,
          isAdmin: false,
        });
      } else {
        await addDoc(postCollectionRef, {
          id,
          date,
          name,
          email,
          isAdmin: false,
        });
      }

      navigate("/posts");
    });
  };

  return (
    <div className="loginPage">
      <p>Sign in With Google to Continue</p>
      <button className="login-with-google-btn" onClick={signInWithGoogle}>
        Sign in with Google
      </button>
    </div>
  );
}

export default Login;
