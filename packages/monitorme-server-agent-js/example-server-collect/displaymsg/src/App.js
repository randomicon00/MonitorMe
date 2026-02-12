import React, { useEffect, useState } from "react";
import SessionEventTracker from "session-event-tracker";

function App() {
  const [response, setResponse] = useState("");

  useEffect(() => {
    SessionEventTracker.initialize();
  }, []);

  const callService = async () => {
    try {
      const res = await fetch("http://localhost:3003/api/hello");
      const { data } = await res.json();
      console.log(JSON.stringify(data));
      setResponse(data.message || "No message found");
    } catch (error) {
      console.error("Error calling the service:", error);
      setResponse("Failed to fetch data");
    }
  };

  const callInvalidPost = async () => {
    try {
      const res = await fetch("http://localhost:3003/api/invalid-url", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ example: "data" }),
      });

      if (!res.ok) {
        throw new Error(
          `HTTP error! status: ${res.status}, statusText: ${res.statusText}`,
        );
      }

      const data = await res.json();
      console.log(JSON.stringify(data));
      setResponse(data.message || "No message found");
    } catch (error) {
      console.error("Error calling the invalid POST service:", error);
      setResponse("POST request failed to a non-existent URL");
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        marginTop: "20%",
      }}
    >
      <button
        style={{ padding: "10px 20px", fontSize: "16px", cursor: "pointer" }}
        onClick={callService}
      >
        Call Service
      </button>
      <button
        style={{
          padding: "10px 20px",
          fontSize: "16px",
          cursor: "pointer",
          marginTop: "10px",
        }}
        onClick={callInvalidPost}
      >
        Call Invalid POST
      </button>
      <div
        style={{
          marginTop: "20px",
          fontSize: "18px",
          fontFamily: "Arial, sans-serif",
        }}
      >
        {response || "Click the buttons to fetch or test invalid requests!"}
      </div>
    </div>
  );
}

export default App;

// TODO Add the other code here
/*
  1) Add these items 
  import SessionEventTracker from "session-event-tracker";

  useEffect(() => {
    SessionEventTracker.initialize();
  });

  const callService = async () => {
    try {
      const res = await fetch("http://localhost:3003/api/hello");
      const { data } = await res.json();
      console.log(JSON.stringify(data));
      setResponse(data.message || "No message found");
    } catch (error) {
      console.error("Error calling the service:", error);
      setResponse("Failed to fetch data");
    }
  };

  const callInvalidPost = async () => {
    try {
      const res = await fetch("http://localhost:3003/api/invalid-url", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ example: "data" }),
      });

      if (!res.ok) {
        throw new Error(
          `HTTP error! status: ${res.status}, statusText: ${res.statusText}`,
        );
      }

      const data = await res.json();
      console.log(JSON.stringify(data));
      setResponse(data.message || "No message found");
    } catch (error) {
      console.error("Error calling the invalid POST service:", error);
      setResponse("POST request failed to a non-existent URL");
    }
  };

  
  2) Add these two callbacks to buttons in the interface. 
  <button
        style={{ padding: "10px 20px", fontSize: "16px", cursor: "pointer" }}
        onClick={callService}
      >
        Call Service
      </button>
      <button
        style={{
          padding: "10px 20px",
          fontSize: "16px",
          cursor: "pointer",
          marginTop: "10px",
        }}
        onClick={callInvalidPost}
      >

  3) Test and confirm that everything is working as expected!

  4) Store new information for testing purposes.

  5) Make the screenshots tomorrow!
*/
