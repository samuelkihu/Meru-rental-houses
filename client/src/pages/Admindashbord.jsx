import { useState, useEffect } from "react";
import AddHouseForm from "./AddHouseForm";

function Slideshow({ images, onPreview }) {
    const [current, setCurrent] = useState(0);
    return (
        <div style={{ position: "relative" }}>
            <img
               src={images[current]}
                alt="house"
                style={{ width: "100%", height: "220px", objectFit: "cover", cursor: "pointer" }}
               onClick={() => onPreview(images[current])}
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

export default function Admindashbord({ onLogout, onViewStudent }) {
    const [houses, setHouses] = useState([]);
    const [requests, setRequests] = useState([]);
    const [activeTab, setActiveTab] = useState("houses");
    const [previewImg, setPreviewImg] = useState(null);
    const [editHouse, setEditHouse] = useState(null);
    const [newRooms, setNewRooms] = useState("");
    const [visitCount, setVisitCount] = useState(0);

    const fetchHouses = async () => {
        const res = await fetch("https://meru-rental-houses.onrender.com/api/houses");
        const data = await res.json();
        setHouses(data);
    };

    const fetchRequests = async () => {
        const res = await fetch("https://meru-rental-houses.onrender.com/api/requests");
        const data = await res.json();
        setRequests(data);
    };

    useEffect(() => {
        fetchHouses();
        fetchRequests();
        fetch("https://meru-rental-houses.onrender.com/api/visits/count")
            .then((res) => res.json())
            .then((data) => setVisitCount(data.total));
    }, []);

    const deleteHouse = async (id) => {
        await fetch(`https://meru-rental-houses.onrender.com/api/houses/${id}`, { method: "DELETE" });
        fetchHouses();
    };

    const handleRequest = async (id, status) => {
        await fetch(`https://meru-rental-houses.onrender.com/api/requests/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status }),
        });
        fetchRequests();
    };

    const updateRooms = async () => {
        if (!newRooms) return;
        await fetch(`https://meru-rental-houses.onrender.com/api/houses/${editHouse.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ rooms: newRooms }),
        });
        setEditHouse(null);
        setNewRooms("");
        fetchHouses();
    };

    const pending = requests.filter((r) => r.status === "pending").length;

    return (
        <div style={styles.page}>

            {previewImg && (
                <div style={styles.overlay} onClick={() => setPreviewImg(null)}>
                    <img src={previewImg} alt="preview" style={styles.previewImg} />
                    <p style={styles.closeHint}>Click anywhere to close</p>
                </div>
            )}

            {editHouse && (
                <div style={styles.overlay} onClick={() => setEditHouse(null)}>
                    <div style={styles.editModal} onClick={(e) => e.stopPropagation()}>
                        <h2 style={styles.modalTitle}>Update Rooms — {editHouse.name}</h2>
                        <p style={{ fontSize: "13px", color: "#6b6b6b", marginBottom: "1rem" }}>Current rooms: <b>{editHouse.rooms}</b></p>
                        <input
                            type="number"
                            value={newRooms}
                            onChange={(e) => setNewRooms(e.target.value)}
                            placeholder="Enter new number of rooms"
                            style={styles.input}
                        />
                        <div style={{ display: "flex", gap: "8px", marginTop: "1rem" }}>
                            <button onClick={updateRooms} style={styles.approveBtn}>Update</button>
                            <button onClick={() => setEditHouse(null)} style={styles.cancelBtn}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}

            <div style={styles.header}>
                <h1 style={styles.title}>SAMUEL KIHU</h1>
                <div style={{ display: "flex", gap: "8px" }}>
                    <button onClick={onViewStudent} style={styles.studentBtn}>Student View</button>
                    <button onClick={onLogout} style={styles.logoutBtn}>Logout</button>
                </div>
            </div>

            <div style={styles.stats}>
                <div style={styles.statCard}>
                    <p style={styles.statNum}>{houses.length}</p>
                    <p style={styles.statLabel}>Total Houses</p>
                </div>
                <div style={styles.statCard}>
                    <p style={styles.statNum}>{pending}</p>
                    <p style={styles.statLabel}>Pending Requests</p>
                </div>
                <div style={styles.statCard}>
                    <p style={styles.statNum}>{requests.length}</p>
                    <p style={styles.statLabel}>Total Requests</p>
                </div>
                <div style={styles.statCard}>
                    <p style={styles.statNum}>{visitCount}</p>
                    <p style={styles.statLabel}>Total Visits</p>
                </div>
            </div>

            <div style={styles.tabs}>
                <button onClick={() => setActiveTab("houses")} style={{ ...styles.tab, ...(activeTab === "houses" ? styles.activeTab : {}) }}>Houses</button>
                <button onClick={() => setActiveTab("add")} style={{ ...styles.tab, ...(activeTab === "add" ? styles.activeTab : {}) }}>Add House</button>
                <button onClick={() => setActiveTab("requests")} style={{ ...styles.tab, ...(activeTab === "requests" ? styles.activeTab : {}) }}>Requests {pending > 0 && `(${pending})`}</button>
            </div>

            {activeTab === "houses" && (
                <div style={styles.grid}>
                    {houses.map((house) => (
                        <div key={house.id} style={styles.card}>
                            {house.images && house.images.length > 0 && (
                                <Slideshow images={house.images} onPreview={setPreviewImg} />
                            )}
                            <div style={styles.cardBody}>
                                <h3 style={styles.houseName}>{house.name}</h3>
                                <p style={styles.detail}><span style={styles.label}>LOCATION:</span> {house.location}</p>
                                <p style={styles.detail}><span style={styles.label}>RENT:</span> Ksh {house.price}/month</p>
                                <p style={styles.detail}><span style={styles.label}>ROOMS:</span> {house.rooms} rooms available</p>
                                <p style={styles.desc}>{house.description}</p>
                                <div style={{ display: "flex", gap: "8px", marginTop: "8px" }}>
                                    <button onClick={() => { setEditHouse(house); setNewRooms(house.rooms); }} style={styles.editBtn}>Edit Rooms</button>
                                    <button onClick={() => deleteHouse(house.id)} style={styles.deleteBtn}>Delete</button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {activeTab === "add" && (
                <AddHouseForm onAdded={() => { fetchHouses(); setActiveTab("houses"); }} />
            )}

            {activeTab === "requests" && (
                <div>
                    {requests.map((r) => (
                        <div key={r.id} style={styles.requestCard}>
                            <p><b>Student:</b> {r.student_name}</p>
                            <p><b>Phone:</b> {r.student_phone}</p>
                            <p><b>House:</b> {r.house_name}</p>
                            <p><b>Status:</b> <span style={{ color: r.status === "pending" ? "re" : r.status === "approved" ? "green" : "red" }}>{r.status}</span></p>
                            {r.status === "pending" && (
                                <div style={{ display: "flex", gap: "8px" }}>
                                    <button onClick={() => handleRequest(r.id, "approved")} style={styles.approveBtn}>Approve</button>
                                    <button onClick={() => handleRequest(r.id, "rejected")} style={styles.rejectBtn}>Reject</button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

const styles = {
    label: { fontSize: "13px", color: "#6b6b6b", fontWeight: "bold" },
    page: { padding: "2rem", background: "#f5f4f0", minHeight: "100vh" },
    overlay: { position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.85)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", zIndex: 2000, cursor: "pointer" },
    previewImg: { maxWidth: "90%", maxHeight: "80vh", borderRadius: "12px", objectFit: "contain" },
    closeHint: { color: "#fff", marginTop: "1rem", fontSize: "13px" },
    editModal: { background: "#fff", borderRadius: "6px", padding: "2rem", width: "100%", maxWidth: "400px", boxSizing: "border-box" },
    modalTitle: { fontSize: "18px", fontWeight: "600", color: "#1a1a1a", margin: "0 0 1rem" },
    input: { width: "100%", padding: "10px 12px", fontSize: "14px", borderRadius: "6px", border: "0.5px solid #ccc", outline: "none", boxSizing: "border-box", background: "#fafaf8", color: "#1a1a1a" },
    header: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" },
    title: { fontSize: "24px", fontWeight: "600", color: "#1a1a1a" },
    logoutBtn: { padding: "8px 16px", background: "#4f46e5", color: "#fff", border: "1px solid #4f46e5", borderRadius: "6px", cursor: "pointer" },
    studentBtn: { padding: "8px 16px", background: "#fff", color: "#4f46e5", border: "1px solid #4f46e5", borderRadius: "6px", cursor: "pointer" },
    stats: { display: "flex", gap: "0.2rem", marginBottom: "1.5rem" },
    statCard: { background: "#fff", borderRadius: "6px", padding: "0.3rem 0.5rem", flex: 1, textAlign: "center", border: "0.5px solid #e0ddd6" },
    statNum: { fontSize: "28px", fontWeight: "700", color: "#131313", margin: 0 },
    statLabel: { fontSize: "13px", color: "#6b6b6b", margin: "4px 0 0" },
    tabs: { display: "flex", gap: "8px", marginBottom: "1.5rem" },
    tab: { padding: "8px 20px", borderRadius: "6px", border: "0.5px solid #ccc", background: "#fff", cursor: "pointer", fontSize: "14px" },
    activeTab: { background: "#4f46e5", color: "#fff", border: "0.5px solid #4f46e5" },
    grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "1rem" },
    card: { background: "#fff", borderRadius: "1px", border: "0.5px solid #e0ddd6", overflow: "hidden" },
    cardBody: { padding: "1rem" },
    houseName: { fontSize: "16px", fontWeight: "600", margin: "0 0 8px", color: "#1a1a1a" },
    detail: { fontSize: "13px", color: "#6b6b6b", margin: "2px 0" },
    desc: { fontSize: "13px", color: "#3a3a3a", margin: "8px 0" },
    editBtn: { padding: "6px 14px", background: "transparent", color: "#4f46e5", border: "1px solid #4f46e5", borderRadius: "6px", cursor: "pointer", fontSize: "13px" },
    deleteBtn: { padding: "6px 14px", background: "#4f46e5", color: "#fff", border: "1px solid #4f46e5", borderRadius: "6px", cursor: "pointer", fontSize: "13px" },
    requestCard: { background: "#fff", borderRadius: "6px", border: "0.5px solid #e0ddd6", padding: "1rem", marginBottom: "1rem" },
    approveBtn: { padding: "6px 14px", background: "transparent", color: "#4f46e5", border: "1px solid #4f46e5", borderRadius: "6px", cursor: "pointer" },
    rejectBtn: { padding: "6px 14px", background: "#4f46e5", color: "#fff", border: "1px solid #4f46e5", borderRadius: "6px", cursor: "pointer" },
    cancelBtn: { padding: "6px 14px", background: "transparent", color: "#1a1a1a", border: "1px solid #ccc", borderRadius: "6px", cursor: "pointer" },
};
