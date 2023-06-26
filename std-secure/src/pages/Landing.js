import React from "react";

function Landing() {
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
          Login to see the announcements
          <br />
          <br />
          {/* <button to='/login'> LOGIN</button> */}
        </p>
      </center>
    </div>
  );
}

export default Landing;
