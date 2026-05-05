import React from "react";

function WelcomeScreen() {
  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg, #020617, #0f172a)",
        color: "white",
        textAlign: "center",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Glow Effect */}
      <div
        style={{
          position: "absolute",
          width: "300px",
          height: "300px",
          background: "radial-gradient(circle, #2563eb55, transparent)",
          filter: "blur(80px)",
          top: "20%",
          left: "30%",
        }}
      />

      {/* Title */}
      <h1
  style={{
    fontSize: "42px",
    fontWeight: "bold",
    marginBottom: "35px",
    lineHeight: "1.2",            
    paddingBottom: "5px",         
    background: "linear-gradient(90deg, #60a5fa, #2563eb)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  }}
>
  Welcome to ChatSphere 💬
</h1>

      {/* Subtitle */}
      <p
        style={{
          fontSize: "16px",
          color: "#9ca3af",
          maxWidth: "400px",
        }}
      >
        Connect instantly. Select a contact from the sidebar and start chatting in real-time.
      </p>
    </div>
  );
}

export default WelcomeScreen;