import React from "react";

function App() {
  const styles = {
    container: {
      fontFamily: "'Segoe UI', sans-serif",
      background: "linear-gradient(135deg, #ffe0f0, #f9f0ff)",
      height: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      padding: "20px",
    },
    card: {
      backgroundColor: "#fff",
      borderRadius: "20px",
      boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
      padding: "40px",
      textAlign: "center",
      maxWidth: "400px",
      transition: "transform 0.3s",
    },
    title: {
      color: "#d63384",
      fontSize: "2rem",
      marginBottom: "15px",
    },
    text: {
      color: "#555",
      fontSize: "1.1rem",
      marginBottom: "20px",
    },
    button: {
      backgroundColor: "#ff69b4",
      color: "#fff",
      padding: "12px 25px",
      border: "none",
      borderRadius: "25px",
      fontSize: "1rem",
      cursor: "pointer",
      transition: "background 0.3s",
    },
    image: {
      width: "120px",
      marginTop: "20px",
      borderRadius: "10px",
    },
  };

  return (
    <div style={styles.container}>
      <div
        style={styles.card}
        onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.03)")}
        onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
      >
        <h1 style={styles.title}>✨ Hello React World ✨</h1>
        <p style={styles.text}>
          Bienvenue sur ma première page React déployée automatiquement grâce à
          GitHub Actions 💫
        </p>
        <button style={styles.button}>Clique-moi 💖</button>
        <img
          src="https://media.giphy.com/media/LmNwrBhejkK9EFP504/giphy.gif"
          alt="React Fun"
          style={styles.image}
        />
      </div>
    </div>
  );
}

export default App;
