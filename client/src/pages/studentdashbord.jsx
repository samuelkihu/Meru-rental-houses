import { useState, useEffect } from "react";

function Slideshow({ images, onPreview }) {
  const [current, setCurrent] = useState(0);
  return (
    <div style={{ position: "relative" }}>
      <img
        src={`https://meru-rental-houses.onrender.com${images[current]}`}
        alt="house"
        style={{ width: "100%", height: "220px", objectFit: "cover", cursor: "pointer" }}
        onClick={() => onPreview(`https://meru-rental-houses.onrender.com${images[current]}`)}
      />
      {images.length > 1 && (
        <>
          <button onClick={() => setCurrent((p) => (p === 0 ? images.length - 1 : p - 1))} style={ss.prevBtn}>❮</button>
          <button onClick={() => setCurrent((p) => (p === images.length - 1 ? 0 : p + 1))} style={ss.nextBtn}>❯</button>
          <div style={ss.dots}>
            {images.map((_, i) => (
              <span key={i} onClick={() => setCurrent(i)} style={{ ...ss.dot, background: i === current ? "#fff" : "rgba(255,255,255,0.5)" }} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

const ss = {
  prevBtn: { position: "absolute", left: "8px", top: "50%", transform: "translateY(-50%)", background: "rgba(0,0,0,0.4)", color: "#fff", border: "none", borderRadius: "50%", width: "32px", height: "32px", cursor: "pointer", fontSize: "14px" },
  nextBtn: { position: "absolute", right: "8px", top: "50%", transform: "translateY(-50%)", background: "rgba(0,0,0,0.4)", color: "#fff", border: "none", borderRadius: "50%", width: "32px", height: "32px", cursor: "pointer", fontSize: "14px" },
  dots: { position: "absolute", bottom: "8px", left: "50%", transform: "translateX(-50%)", display: "flex", gap: "6px" },
  dot: { width: "8px", height: "8px", borderRadius: "50%", cursor: "pointer", display: "inline-block" },
};

export default function StudentDashboard() {
  const [houses, setHouses] = useState([]);
  const [selectedHouse, setSelectedHouse] = useState(null);
  const [studentName, setStudentName] = useState("");
  const [studentPhone, setStudentPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [previewImg, setPreviewImg] = useState(null);

  const fetchHouses = async () => {
    const res = await fetch("https://meru-rental-houses.onrender.com/api/houses");
    const data = await res.json();
    const shuffled=[...data].sort(() => Math.random() - 0.5);
    setHouses(shuffled);
  };

  useEffect(() => {
    fetchHouses();
    fetch("https://meru-rental-houses.onrender.com/api/visits", { method: "POST" });
  }, []);

  const handleRequest = async () => {
    setError("");
    setMessage("");
    if (!studentName || !studentPhone) {
      setError("Please fill in your name and phone.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("https://meru-rental-houses.onrender.com/api/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          house_id: selectedHouse.id,
          student_name: studentName,
          student_phone: studentPhone,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message);
      } else {
        setMessage("Request submitted successfully!");
        setSelectedHouse(null);
        setStudentName("");
        setStudentPhone("");
      }
    } catch (err) {
      setError("Could not reach the server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>

      {previewImg && (
        <div style={styles.overlay} onClick={() => setPreviewImg(null)}>
          <img src={previewImg} alt="preview" style={styles.previewImg} />
          <p style={styles.closeHint}>Click anywhere to close</p>
        </div>
      )}

      <div style={styles.header}>
        <h1 style={styles.title}>  AVAILABLE HOUSES</h1>
        <p style={styles.subtitle}>Find your perfect student accommodation with price of your choice 
         <span style={styles.span}>. You can contact landlords or caretakers directly through the contact details provided</span>  OR request for a house and the admin will contact you to finalize the deal.
          Or you can also contact the admin directly through the email:<span style={styles.span}>kihusamuel986@gmail.com</span> or phone number:<span style={styles.span}>+254 768368729</span>.
        </p>
      </div>

      {message && <div style={styles.success}>{message}</div>}

      <div style={styles.grid}>
        {houses.map((house) => (
          <div key={house.id} style={styles.card}>
            {house.images && house.images.length > 0 && (
              <Slideshow images={house.images} onPreview={setPreviewImg} />
            )}
            <div style={styles.cardBody}>
              <h3 style={styles.houseName}>{house.name}</h3>
              <p style={styles.detail}><b>LOCATION:</b> {house.location}</p>
              <p style={styles.detail}><b>RENT:</b> {house.price} Ksh/month</p>
              <p style={styles.detail}><b>ROOMS:</b> {house.rooms} rooms available</p>
              <p style={styles.desc}>{house.description}</p>
              {house.rooms > 0 ? (
                <button onClick={() => setSelectedHouse(house)} style={styles.requestBtn}>
                  <i className="fi fi-ss-home" style={{ marginRight: "8px", color: "#ffffff", verticalAlign: "middle" }}></i>Request House
                </button>
              ) : (
                <button disabled style={styles.fullyBookedBtn}>
                  Fully Booked
                </button>
              )}

            </div>
          </div>
        ))}
      </div>

      {selectedHouse && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <h2 style={styles.modalTitle}>Request — {selectedHouse.name}</h2>
            {error && <div style={styles.error}>{error}</div>}
            <div style={styles.field}>
              <label style={styles.label}>Your Name</label>
              <input value={studentName} onChange={(e) => setStudentName(e.target.value)} placeholder="name" style={styles.input} />
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Phone Number</label>
              <input value={studentPhone} onChange={(e) => setStudentPhone(e.target.value)} placeholder="07XXXXXXXX" style={styles.input} />
            </div>
            <div style={{ display: "flex", gap: "8px" }}>
              <button onClick={handleRequest} disabled={loading} style={{ ...styles.submitBtn, opacity: loading ? 0.7 : 1 }}>
                {loading ? "Submitting..." : "Submit Request"}
              </button>
              <button onClick={() => setSelectedHouse(null)} style={styles.cancelBtn}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      <footer style={styles.footer}>
        <p style={styles.footerText}>Making house hunting easy for students joining university.</p>
        <p style={styles.footerText}>© {new Date().getFullYear()} Student Housing Portal · All rights reserved</p>
        <p style={styles.footerSub}>
          For support, contact{" "}
          <a href="mailto:kihusamuel986@gmail.com" style={styles.footerLink}>kihusamuel986@gmail.com or call +254 768368729</a>
        </p>
      </footer>
    </div>
  );
}

const styles = {
  span: { color: "#000000", fontSize: "13px",fontWeight: "500" },
  fullyBookedBtn: { width: "100%", padding: "8px", background: "#ccc", color: "#666", border: "none", borderRadius: "8px", fontSize: "14px", cursor: "not-allowed" },
  page: { padding: "2rem", paddingBottom: "8rem", background: "#f5f4f0", minHeight: "100vh" },
  overlay: { position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.85)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", zIndex: 2000, cursor: "pointer" },
  previewImg: { maxWidth: "90%", maxHeight: "80vh", borderRadius: "12px", objectFit: "contain" },
  closeHint: { color: "#fff", marginTop: "1rem", fontSize: "13px" },
  header: {
    marginBottom: "1.5rem",
    background: "#fff",
    borderRadius: "1px",
    // boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
    border: "0.5px solid rgba(96, 89, 35, 0.2)",
    padding: "1rem",
    width: "100%",
    maxWidth: "800px",
    boxSizing: "border-box",   // padding no longer adds to width
    margin: "0 auto",
    overflow: "hidden",        // safety net, clips anything that still escapes
  },

  subtitle: {
    fontSize: "0.95rem",
    lineHeight: "1.5",
    color: "#555",
    margin: "0.5rem 0 0",
    wordBreak: "break-word",     // lets long words/emails wrap instead of overflowing
    overflowWrap: "break-word",  // belt-and-suspenders, same purpose, wider support
    maxWidth: "100%",
  },
  title: { fontSize: "24px", fontWeight: "600", color: "#1a1a1a", textAlign: "center" },
  success: { background: "#f0fff4", border: "0.5px solid #86efac", color: "#166534", borderRadius: "8px", padding: "10px 14px", fontSize: "13px", marginBottom: "1rem" },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "1rem" },
  card: { background: "#ffffff", borderRadius: "1px", border: "0.5px solid #e0ddd6", marginTop: "3rem", overflow: "hidden", boxShadow: "0 2px 4px rgba(0,0,0,0.1)" },
  cardBody: { padding: "1rem" },
  houseName: { fontSize: "16px", fontWeight: "600", margin: "0 0 8px", color: "#1a1a1a" },
  detail: { fontSize: "13px", color: "#6b6b6b", margin: "2px 0" },
  desc: { fontSize: "13px", color: "#3a3a3a", margin: "8px 0" },
  requestBtn: { width: "100%", padding: "8px", background: "#4f46e5", color: "#fff", border: "none", borderRadius: "8px", cursor: "pointer", fontSize: "14px" },
  modalOverlay: { position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 },
  modal: { background: "#fff", borderRadius: "16px", padding: "2rem", width: "100%", maxWidth: "400px", boxSizing: "border-box" },
  modalTitle: { fontSize: "18px", fontWeight: "600", color: "#1a1a1a", margin: "0 0 1.25rem" },
  error: { background: "#fff0f0", border: "0.5px solid #f5c1c1", color: "#a32d2d", borderRadius: "8px", padding: "10px 14px", fontSize: "13px", marginBottom: "1rem" },
  field: { marginBottom: "1rem" },
  label: { display: "block", fontSize: "13px", fontWeight: "500", color: "#3a3a3a", marginBottom: "6px" },
  input: { width: "100%", padding: "10px 12px", fontSize: "14px", borderRadius: "8px", border: "0.5px solid #ccc", outline: "none", boxSizing: "border-box", background: "#fafaf8", color: "#1a1a1a" },
  submitBtn: { flex: 1, padding: "10px", background: "#4f46e5", color: "#fff", border: "none", borderRadius: "8px", cursor: "pointer", fontSize: "14px" },
  cancelBtn: {
    flex: 1, padding: "10px", background: "rgba(35, 62, 116, 0.1)", color: "#000000", border: "0.5px solid #ccc",
    borderRadius: "8px", cursor: "pointer", fontSize: "14px"
  },
  footer: {
    position: "fixed", bottom: 0, left: 0, right: 0, background: "rgba(255, 255, 255, 0.99)",
    borderTop: "0.5px solid #e0ddd6", padding: "0.1rem", textAlign: "center", zIndex: 500
  },
  footerText: { fontSize: "13px", color: "#6b6b6b", margin: "0" },
  footerSub: { fontSize: "11px", color: "#9b9b9b", margin: "4px 0 0" },
  footerLink: { color: "#4f46e5", textDecoration: "none" },
};