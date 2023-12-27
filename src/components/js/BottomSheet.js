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

  const apiUrl = "https://f7team.vercel.app/api/autostells/join_waitlist/";
  const [email, setEmail] = useState("");
  const [role, setRole] = useState(null);
  const [data, setData] = useState(null);
  const [sending, setSending] = useState(false);
  const [alert, setAlert] = useState({ success: false, message: '' });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(apiUrl);
        const jsonData = await response.json();
        setData(jsonData);
      } catch (error) {
        console.error("Error during data fetching:", error);
      }
    };

    fetchData();
  }, []); 

  const handleJoinWaitlist = async () => {
    const requestData = { role, email };
    if (requestData.role === null) {
      setAlertAndTimeout(false, 'Please select a role before joining the waitlist.');
      return;
    }
    
    if (requestData.email.trim() === '') {
      setAlertAndTimeout(false, 'Please enter a valid email address.');
      return;
    }

    setSending(true);
    try {
      // Make POST request
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });

      // If the POST request is successful, fetch data again
      if (response.ok) {
        fetchWaitlistData();
        setAlertAndTimeout(true, 'Successfully joined the waitlist.');
      } else {
        const errorMessage = await response.json();
        const alertMessage =
          errorMessage.message === "Joined Already!"
            ? "Failed to Join, You already joined using this email"
            : "Failed to join the waitlist. Please try again.";

        setAlertAndTimeout(false, alertMessage);
      }
    } catch (error) {
      console.error("Error during POST request:", error);
      setAlertAndTimeout(false, 'An error occurred. Please try again later.');
    } finally {
      setSending(false);
    }
  };

  const setAlertAndTimeout = (success, message) => {
    setAlert({ success, message });
    setTimeout(() => setAlert({ success: false, message: '' }), 3000);
  };

  const fetchWaitlistData = async () => {
    try {
      const response = await fetch(apiUrl);
      const jsonData = await response.json();
      setData(jsonData);
    } catch (error) {
      console.error("Error during GET request:", error);
    }
  };

  return (
    <div className={`bottom-sheet ${isOpen ? "open" : ""}`}>
      <div className="wait-list-drawer">
        <div className="head">
          <p onClick={toggleBottomSheet}>Waitlist: {data ? data.waitlist : 0}</p>
          {isOpen ? (
            <img src={closeBtn} alt="close-btn" onClick={toggleCloseBottomSheet} />
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
