import {
    useState,
    useTransition,
    useOptimistic,
    useActionState,
} from "react";
import { useNavigate } from "react-router-dom";
import "./App.css";

interface FormState {
    success: boolean;
    error?: string;
}

interface User {
    name: string;
    role: string;
    classID?: string | null;
    photo?: string | null;
}

export default function Login() {
    const navigate = useNavigate();

    const [role, setRole] = useState("teacher");
    const [name, setName] = useState("");
    const [classID, setClassID] = useState("");
    const [password, setPassword] = useState("");
    const [photo, setPhoto] = useState<File | null>(null);

    const [isPending, startTransition] = useTransition();
    const [optimisticMessage, setOptimisticMessage] =
        useOptimistic<string | null>(null);

    const [formState, formAction] = useActionState<FormState, FormData>(
        async (_prevState: FormState, formData: FormData) => {
            const nameValue = formData.get("name")?.toString().trim();
            const passwordValue = formData.get("password")?.toString().trim();
            const roleValue = formData.get("role")?.toString();
            const classIDValue = formData.get("classID")?.toString().trim();

            if (!nameValue) return { success: false, error: "Name is required" };
            if (!passwordValue) return { success: false, error: "Password is required" };
            if (roleValue === "teacher" && !classIDValue)
                return { success: false, error: "Class ID is required for teacher" };

            try {
                const res = await fetch("http://localhost:4000/api/login", {
                    method: "POST",
                    body: formData,
                });

                const data = await res.json();
                if (data.success) {
                    const user: User = {
                        name: nameValue,
                        role: roleValue || "student",
                        classID: roleValue === "teacher" ? classIDValue : null,
                        photo: data.photo || null,
                    };

                    // Save JWT in localStorage
                    localStorage.setItem("token", data.token);
                    localStorage.setItem("user", JSON.stringify(user));

                    setOptimisticMessage("Logging in...");
                    startTransition(() => navigate("/dashboard"));

                    return { success: true };
                } else {
                    return { success: false, error: data.message || "Login failed" };
                }
            } catch {
                return { success: false, error: "Could not connect to server" };
            }
        },
        { success: false }
    );

    return (
        <div className="container">
            <h2>Login</h2>

            {formState.error && <p className="error">{formState.error}</p>}
            {optimisticMessage && <p className="success">{optimisticMessage}</p>}

            <form
                className="form"
                action={(formData: FormData) => {
                    formData.append("role", role);
                    formData.append("name", name.trim());
                    formData.append("password", password.trim());
                    if (role === "teacher") formData.append("classID", classID.trim());
                    if (photo) formData.append("photo", photo);

                    startTransition(() => {
                        formAction(formData);
                    });
                }}
            >

                <div className="input-group">
                    <label>Role:</label>
                    <select value={role} onChange={(e) => setRole(e.target.value)}>
                        <option value="teacher">Teacher</option>
                        <option value="student">Student</option>
                    </select>
                </div>

                <div className="input-group">
                    <label>Name:</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter your name"
                    />
                </div>

                {role === "teacher" && (
                    <div className="input-group">
                        <label>Class ID:</label>
                        <input
                            type="text"
                            value={classID}
                            onChange={(e) => setClassID(e.target.value)}
                            placeholder="Enter your Class ID"
                        />
                    </div>
                )}

                <div className="input-group">
                    <label>Password:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                    />
                </div>

                <div className="input-group">
                    <label>Profile Photo:</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setPhoto(e.target.files?.[0] || null)}
                    />
                </div>

                <button type="submit" className="btn" disabled={isPending}>
                    {isPending ? "Logging in..." : "Login"}
                </button>

            </form>
        </div>
    );
}
