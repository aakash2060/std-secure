import {
  collection,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import {
  FaArrowRight,
  FaPencil,
  FaSquareCheck,
  FaSquareXmark,
  FaTrashCan,
} from "react-icons/fa6";
import { Button, Modal } from "react-bootstrap";

function Admin() {
  const [users, Setusers] = useState([]);
  const [selectOption, setSelectOption] = useState("all");
  const [isLoading, setisLoading] = useState(true);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [userToApprove, setUserToApprove] = useState("");
  const uid = localStorage.getItem("uid") || "";

  const fetchUser = async () => {
    const usersCollectionRef = collection(
      db,
      process.env.REACT_APP_ADMIN_USERS
    );
    const usersSnapshot = await getDocs(usersCollectionRef);
    const userdata = usersSnapshot.docs.map((doc) => doc.data());
    Setusers(userdata);
    setisLoading(false);
  };

  let filteredUsers = users;
  if (selectOption === "admin") {
    filteredUsers = users.filter((user) => user.isAdmin && user.id !== uid);
  } else if (selectOption === "user") {
    filteredUsers = users.filter((user) => !user.isAdmin && user.id !== uid);
  } else if (selectOption === "all") {
    filteredUsers = users.filter((user) => user.id !== uid);
  }

  const handleOptionChange = (event) => {
    setSelectOption(event.target.value);
  };

  const toggleApprove = async (user) => {
    try {
      const usersCollectionRef = collection(
        db,
        process.env.REACT_APP_ADMIN_USERS
      );
      const querySnapshot = await getDocs(
        query(usersCollectionRef, where("id", "==", user.id))
      );
      const userRef = doc(usersCollectionRef, querySnapshot.docs[0].id);
      const currentIsApproved = querySnapshot.docs[0].data().isApproved;
      const updatedIsApproved = !currentIsApproved; // Toggle the value

      await updateDoc(userRef, { isApproved: updatedIsApproved });
      setShowConfirmModal(false);
      fetchUser();
    } catch (error) {
      console.error("Error updating user approval", error);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  if (isLoading) {
    return <div></div>;
  }

  return (
    <>
      <div className="admin-container">
        <center>
          <h2> Admin Dashboard</h2>
          <hr />
        </center>
        <div className="option-container" style={{ float: "right" }}>
          <select value={selectOption} onChange={handleOptionChange}>
            <option value="all">Sort by: Show All</option>
            <option value="admin">Sort by: Show Admins</option>
            <option value="user">Sort by: Show Users</option>
          </select>
        </div>
        <div className="admin-list">
          <table className="table table-hover" style={{ width: "100%" }}>
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Name</th>
                <th scope="col">Email</th>
                <th scope="col">Last Login</th>
                <th scope="col">Role</th>
                <th scope="col">Approved</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user, index) => (
                <tr key={index}>
                  <th scope="row">{index + 1}</th>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td style={{ fontSize: "13px" }}>
                    {user.date?.toDate().toLocaleString()}
                  </td>
                  <td>{user.isAdmin ? "Admin" : "User"}</td>
                  <td>
                    {user.isApproved ? (
                      <div>
                        &nbsp; &nbsp; &nbsp;
                        <FaSquareCheck
                          style={{ color: "#17c200", fontSize: "20px" }}
                        />
                      </div>
                    ) : (
                      <div>
                        &nbsp; &nbsp; &nbsp;
                        <FaSquareXmark
                          style={{ color: "red", fontSize: "20px" }}
                        />
                      </div>
                    )}
                  </td>
                  <td>
                    <div>
                      <button
                        className="btn edit-button"
                        style={{ padding: "0px", color: "orange" }}
                        onClick={() => {
                          setUserToApprove(user);
                          setShowConfirmModal(true);
                        }}
                      >
                        <FaPencil />
                      </button>
                      &nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                      <button
                        className="btn edit-button"
                        style={{ padding: "0px", color: "red" }}
                      >
                        <FaTrashCan />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Modal
          show={showConfirmModal}
          keyboard={false}
          onHide={() => setShowConfirmModal(false)}
        >
          <Modal.Header>
            <Modal.Title>Edit Permission</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <strong>User: </strong>
            {userToApprove.name} <br />
            <strong>Change Permission </strong>
            {userToApprove.isApproved ? (
              <div>
                <FaSquareCheck style={{ color: "green", fontSize: "20px" }} />
                <FaArrowRight style={{ fontSize: "25px" }} />
                <FaSquareXmark style={{ color: "red", fontSize: "20px" }} />
              </div>
            ) : (
              <div>
                <FaSquareXmark style={{ color: "red", fontSize: "20px" }} />{" "}
                <FaArrowRight style={{ fontSize: "25px" }} />
                <FaSquareCheck style={{ color: "green", fontSize: "20px" }} />
              </div>
            )}
            <hr />
            Are you sure to approve this changes?
            <br />
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="success"
              onClick={() => toggleApprove(userToApprove)}
            >
              Save
            </Button>
            <Button
              variant="danger"
              onClick={() => {
                setShowConfirmModal(false);
              }}
            >
              Cancel
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </>
  );
}

export default Admin;
