import React from "react";
import { Link } from "react-router-dom";

const HomePage: React.FC = () => {
  return (
    <div>
      {/* Header */}
      <header style={styles.header}>
        <h2>📱 Phone Store</h2>
        <nav>
          <Link to="/" style={styles.link}>Home</Link>
          <Link to="/products" style={styles.link}>Products</Link>
          <Link to="/login" style={styles.link}>Login</Link>
        </nav>
      </header>

      {/* Banner */}
      <section style={styles.banner}>
        <h1>Welcome to Phone Store</h1>
        <p>Find your favorite smartphone here 🚀</p>
        <Link to="/products">
          <button style={styles.button}>Shop Now</button>
        </Link>
      </section>

      {/* Product preview */}
      <section style={styles.products}>
        <h2>🔥 Featured Products</h2>

        <div style={styles.grid}>
          {[1, 2, 3, 4].map((item) => (
            <div key={item} style={styles.card}>
              <img
                src="https://via.placeholder.com/150"
                alt="phone"
                style={{ width: "100%" }}
              />
              <h3>Phone {item}</h3>
              <p>$999</p>
              <button style={styles.button}>View</button>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer style={styles.footer}>
        <p>© 2026 Phone Store. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default HomePage;

// CSS inline đơn giản
const styles: { [key: string]: React.CSSProperties } = {
  header: {
    display: "flex",
    justifyContent: "space-between",
    padding: "15px 30px",
    background: "#222",
    color: "#fff",
  },
  link: {
    marginLeft: 15,
    color: "#fff",
    textDecoration: "none",
  },
  banner: {
    textAlign: "center",
    padding: "60px 20px",
    background: "#f5f5f5",
  },
  button: {
    padding: "10px 20px",
    marginTop: 10,
    cursor: "pointer",
  },
  products: {
    padding: "40px",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "20px",
  },
  card: {
    border: "1px solid #ddd",
    padding: "15px",
    textAlign: "center",
  },
  footer: {
    marginTop: 40,
    padding: 20,
    textAlign: "center",
    background: "#222",
    color: "#fff",
  },
};