import { useState } from "react";

export default function AddHouseForm({ onAdded }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [price, setPrice] = useState("");
  const [rooms, setRooms] = useState("");
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    setError("");
    if (!name || !location || !price || !rooms) {
      setError("Please fill in all required fields.");
      return;
    }
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      formData.append("location", location);
      formData.append("price", price);
      formData.append("rooms", rooms);
      for (const image of images) {
        formData.append("images", image);
      }

      const res = await fetch("https://meru-rental-houses.onrender.com/api/houses", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message);
      } else {
        onAdded();
      }
    } catch (err) {
      setError("Could not reach the server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Add New House</h2>

      {error && <div style={styles.error}>{error}</div>}

      <div style={styles.field}>
        <label style={styles.label}>House Name *</label>
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Sunset Apartments" style={styles.input} />
      </div>

      <div style={styles.field}>
        <label style={styles.label}>Location *</label>
        <input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="e.g. nchiru,kianjai,maskan" style={styles.input} />
      </div>

      <div style={styles.row}>
        <div style={{ ...styles.field, flex: 1 }}>
          <label style={styles.label}>Price (Ksh/mo) *</label>
          <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="e.g. 15000" style={styles.input} />
        </div>
        <div style={{ ...styles.field, flex: 1 }}>
          <label style={styles.label}>Rooms *</label>
          <input type="number" value={rooms} onChange={(e) => setRooms(e.target.value)} placeholder="e.g. 2" style={styles.input} />
        </div>
      </div>

      <div style={styles.field}>
        <label style={styles.label}>Description</label>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Describe the house..." rows={4} style={styles.textarea} />
      </div>

      <div style={styles.field}>
        <label style={styles.label}>House Images (select multiple)</label>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => setImages(Array.from(e.target.files))}
          style={styles.input}
        />
        {images.length > 0 && <p style={styles.hint}>{images.length} image(s) selected</p>}
      </div>

      <button onClick={handleSubmit} disabled={loading} style={{ ...styles.btn, opacity: loading ? 0.7 : 1 }}>
        {loading ? "Adding..." : "Add House"}
      </button>
    </div>
  );
}

const styles = {
  container: { background: "#fff", borderRadius: "1px", border: "0.5px solid #e0ddd6", padding: "1.5rem", maxWidth: "600px", alignItems: "center", margin: "0 auto" },
  heading: { fontSize: "18px", fontWeight: "600", color: "#1a1a1a", margin: "0 0 1.25rem" },
  error: { background: "#fff0f0", border: "0.5px solid #f5c1c1", color: "#a32d2d", borderRadius: "1px", padding: "10px 14px", fontSize: "13px", marginBottom: "1rem" },
  field: { marginBottom: "1rem" },
  row: { display: "flex", gap: "1rem" },
  label: { display: "block", fontSize: "13px", fontWeight: "500", color: "#3a3a3a", marginBottom: "6px" },
  input: { width: "100%", padding: "10px 12px", fontSize: "14px", borderRadius: "1px", border: "0.5px solid #ccc", outline: "none", boxSizing: "border-box", background: "#fafaf8", color: "#1a1a1a" },
  textarea: { width: "100%", padding: "10px 12px", fontSize: "14px", borderRadius: "1px", border: "0.5px solid #ccc", outline: "none", boxSizing: "border-box", background: "#fafaf8", color: "#1a1a1a", resize: "vertical" },
  btn: { width: "100%", padding: "11px", background: "#4f46e5", color: "#fff", border: "none", borderRadius: "1px", fontSize: "15px", fontWeight: "500", cursor: "pointer" },
  hint: { fontSize: "12px", color: "#6b6b6b", margin: "4px 0 0" },
};