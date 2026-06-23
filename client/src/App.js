import { useState, useEffect } from "react";
import LoginPage from "./pages/LoginPage";
import AdminDashboard from "./pages/Admindashbord";
import StudentDashboard from "./pages/studentdashbord";

export default function App() {
  const [page, setPage] = useState("student");
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const savedPage = localStorage.getItem("page");
    if (token && savedPage === "admin") {
      fetch("https://meru-rental-houses.onrender.com/api/auth/verify", {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.valid) {
            setPage("admin");
          } else {
            localStorage.removeItem("token");
            localStorage.setItem("page", "student");
            setPage("student");
          }
        })
        .catch(() => setPage("student"))
        .finally(() => setChecking(false));
    } else {
      setChecking(false);
    }
  }, []);

  const handleLogin = (t) => {
    localStorage.setItem("token", t);
    localStorage.setItem("page", "admin");
    setPage("admin");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.setItem("page", "student");
    setPage("student");
  };

  const goToStudent = () => {
    localStorage.setItem("page", "student");
    setPage("student");
  };

  const goToLogin = () => {
    localStorage.setItem("page", "login");
    setPage("login");
  };

  if (checking) return <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", fontSize: "16px", color: "#6b6b6b" }}>Loading...</div>;

  if (page === "admin") return <AdminDashboard onLogout={handleLogout} onViewStudent={goToStudent} />;
  if (page === "login") return <LoginPage onLogin={handleLogin} onBack={goToStudent} />;

  return (
    <div>
      <div style={styles.nav}>
        <h2 style={styles.brand}>
          <i className="fi fi-br-home" style={{ marginRight: "15px", color: "#35b715", fontWeight: "600", verticalAlign: "middle" }}></i>
          MERU RENTALS
        </h2>
        <button onClick={goToLogin} style={styles.adminBtn}>Admin Login</button>
      </div>
      <StudentDashboard />
    </div>
  );
}

const styles = {
  nav: {
    display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.8rem 1.2rem",
    zIndex: 1000, top: 0, position: "sticky", background: "#fff", borderBottom: "0.5px solid #e0ddd6"
  },
  brand: { fontSize: "18px", fontWeight: "600", color: "#1a1a1a", margin: 0, border: "0.5px solid #ffffff", padding: "4px 8px", borderRadius: "14px" },
  adminBtn: {
    padding: "8px 16px", background: "#4f46e5", color: "#ffffff", border: "1px solid #ebebf3",
    borderRadius: "5px", cursor: "pointer", fontSize: "14px", boxshadow: "0 2px 4px rgba(0, 0, 0, 0.1)", transition: "background-color 0.3s, color 0.3s"
  },
  adminBtnHover: {
    background: "#4f46e5", color: "#ffffff"
  }
};