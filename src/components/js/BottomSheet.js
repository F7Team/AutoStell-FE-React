import React, { useEffect, useState } from "react";
import closeBtn from "../../images/close.svg";
import "../styles/BottomSheet.css";
import "../styles/WaitListComponent.css";
import CustomDropDown from "./CustomDropDown";

const BottomSheet = ({ isOpen, toggleCloseBottomSheet, toggleBottomSheet }) => {
  const roles = [
    "Sell Cars",
    "Buy Cars",
    "Blog About Cars",
    "Get A Repairer",
    "Be A Repairer",
    "Others",
  ];
  const apiUrlPost = "https://f7team.vercel.app/api/autostells/join_waitlist/";
  const apiUrlGet = "https://f7team.vercel.app/api/autostells/";
  const [email, setEmail] = useState("");
  const [role, setRole] = useState(null);
  const [data, setData] = useState(null);
  const [sending, setSending] = useState(false);
  const [alert, setAlert] = useState({
    success: false,
    message: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(apiUrlGet);
        const jsonData = await response.json();
        setData(jsonData);
      } catch (error) {
        console.error("Error during GET request:", error);
      }
    };

    fetchData();
  }, []); // Fetch data when the component mounts

  const handleJoinWaitlist = async () => {
    setSending(true);
    const requestData = {
      role: role,
      email: email
    };

    console.log(requestData);

    try {
      // Make POST request
      const response = await fetch(apiUrlPost, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });

      console.log(response);

      // If the POST request is successful, fetch data again
      if (response.ok) {
        const fetchData = async () => {
          try {
            const response = await fetch(apiUrlGet);
            const jsonData = await response.json();
            setData(jsonData);
          } catch (error) {
            console.error("Error during GET request:", error);
          }
        };

        fetchData();
        setAlert({ success: true, message: 'Successfully joined the waitlist.' });
        setTimeout(() => {
          setAlert({ success: false, message: '' });
        }, 3000);
      }
      else{
        setAlert({ success: false, message: 'Failed to join the waitlist. Please try again.' });
        setTimeout(() => {
          setAlert({ success: false, message: '' });
        }, 3000);
      }
    } catch (error) {
      console.error("Error during POST request:", error);
      setAlert({ success: false, message: 'An error occurred. Please try again later.' });
      setTimeout(() => {
        setAlert({ success: false, message: '' });
      }, 3000);
    }

    setSending(false);
  };

  return (
    <div className={`bottom-sheet ${isOpen ? "open" : ""}`}>
      <div className="wait-list-drawer">
        <div className="head">
          <p onClick={toggleBottomSheet}>Waitlist: {data ? data.length : 0}</p>
          {isOpen ? (
            <img
              src={closeBtn}
              alt="close-btn"
              onClick={toggleCloseBottomSheet}
            />
          ) : (
            <p onClick={toggleBottomSheet} className="head-button">
              Join Waitlist
            </p>
          )}
        </div>
        <div className="content">
          <CustomDropDown options={roles} onChangeRole={setRole} />
          <label>Email Address:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={sending}
          />
          <div className={` alert-box ${alert.success ? 'success' : 'failed'}`}>
            <p>{alert.message}</p>
          </div>
          <button onClick={handleJoinWaitlist} disabled={sending}>
            {sending ? "Joining..." : "Join Waitlist"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BottomSheet;
