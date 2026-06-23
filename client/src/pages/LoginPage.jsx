import { useState } from "react";

export default function LoginPage({ onSwitch, onLogin, onBack }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleLogin = async () => {
        setError("");
        if (!email || !password) {
            setError("Please fill in all fields.");
            return;
        }
        setLoading(true);
        try {
            const res = await fetch("https://meru-rental-houses.onrender.com/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });
            const data = await res.json();
            if (!res.ok) {
                setError(data.message);
            } else {
                onLogin(data.token);
            }
        } catch (err) {
            setError("Could not reach the server.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.page}>
            <div style={styles.card}>
                {onBack && (
                    <button onClick={onBack} style={styles.backBtn}>← Back to houses</button>
                )}
                <h1 style={styles.heading}>Welcome back Admin</h1>
                <p style={styles.subtext}>Sign in to your account</p>

                {error && <div style={styles.error}>{error}</div>}

                <div style={styles.field}>
                    <label style={styles.label}>Email</label>
                    <input
                        type="email"
                        id="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        style={styles.input}
                    />
                </div>

                <div style={styles.field}>
                    <label style={styles.label}>Password</label>
                    <div style={{ position: "relative" }}>
                        <input
                            type={showPassword ? "text" : "password"}
                            id="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            style={{ ...styles.input, paddingRight: "44px" }}
                        />
                        <button
                            onClick={() => setShowPassword(!showPassword)}
                            style={styles.eyeBtn}
                        >
                            {showPassword ? "😊" : "👁️"}
                        </button>
                    </div>
                </div>

                <button
                    onClick={handleLogin}
                    disabled={loading}
                    style={{ ...styles.btn, opacity: loading ? 0.7 : 1 }}
                >
                    {loading ? "Signing in…" : "Sign in"}
                </button>
            </div>
        </div>
    );
}

const styles = {
    page: { minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f5f4f0", padding: "1rem" },
    card: { background: "#fff", borderRadius: "1px",boxShadow: "0 2px 10px rgba(0,0,0,0.1)", border: "0.5px solid #e0ddd6", padding: "2.5rem 2rem", width: "100%", maxWidth: "400px", boxSizing: "border-box" },
    backBtn: { background: "none", border: "none", color: "#4f46e5", cursor: "pointer", fontSize: "13px", padding: "0 0 1rem", display: "block" },
    heading: { fontSize: "22px", fontWeight: "600", margin: "0 0 4px", color: "#1a1a1a" },
    subtext: { fontSize: "14px", color: "#6b6b6b", margin: "0 0 1.75rem" },
    error: { background: "#fff0f0", border: "0.5px solid #f5c1c1", color: "#a32d2d", borderRadius: "8px", padding: "10px 14px", fontSize: "13px", marginBottom: "1.25rem" },
    field: { marginBottom: "1rem" },
    label: { display: "block", fontSize: "13px", fontWeight: "500", color: "#3a3a3a", marginBottom: "6px" },
    input: { width: "100%", padding: "10px 12px", fontSize: "14px", borderRadius: "8px", border: "0.5px solid #ccc", outline: "none", boxSizing: "border-box", background: "#fafaf8", color: "#1a1a1a" },
    eyeBtn: { position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", fontSize: "16px" },
    btn: { width: "100%", padding: "11px", background: "#4f46e5", color: "#fff", border: "none", borderRadius: "8px", fontSize: "15px", fontWeight: "500", cursor: "pointer", marginBottom: "1.25rem" },
};