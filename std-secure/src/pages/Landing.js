import React, { useEffect } from "react";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import dotenv from "dotenv";

dotenv.config();

function Landing({ isAuth }) {
  useEffect(() => {
    if (!isAuth) {
      toast.warning("Login to see the announcements!!!", {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 2000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
  }, [isAuth]);

  return (
    <div
      style={{
        backgroundImage: `url(${process.env.REACT_APP_BG_IMAGE})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        width: "100%",
        height: "100%",
        position: "absolute",
        zIndex: "-1",
      }}
    ></div>
  );
}

export default Landing;
