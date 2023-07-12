import React, { useEffect } from "react";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";

function Landing({ isAuth }) {
  useEffect(() => {
    if (!isAuth) {
      toast.warning("Login to see the announcements!!!", {
        position: toast.POSITION.TOP_CENTER,
      });
    }
  }, [isAuth]);
  return (
    <div
      style={{
        color: "green",
        fontSize: "20px",
        textAlign: "center",
        height: "50%",
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
      }}
    >
      <center>
        <p>
          <b>HI STUDENTS THIS IS YOUR HOME PAGE.</b>
          <br />
          <br />
          <br />
          <br />
          {/* <button to='/login'> LOGIN</button> */}
        </p>
      </center>
    </div>
  );
}

export default Landing;
