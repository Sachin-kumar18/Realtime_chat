import { useState } from "react";
import { registerUser } from "../../api/auth";
import { useAuth } from "../../context/AuthContext";

export default function RegisterForm({ onSwitch }) {
  const { login } = useAuth();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    passwordConfirm: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (form.password !== form.passwordConfirm) {
      setError("Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      const { data } = await registerUser(form);
      login(data.token, data.user);
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    {
      name: "name",
      label: "Full Name",
      type: "text",
      placeholder: "Enter Your Name",
    },
    {
      name: "email",
      label: "Email",
      type: "email",
      placeholder: "Enter Your Email",
    },
    {
      name: "password",
      label: "Password",
      type: "password",
      placeholder: "Min 8 characters",
    },
    {
      name: "passwordConfirm",
      label: "Confirm Password",
      type: "password",
      placeholder: "Repeat password",
    },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {fields.map(({ name, label, type, placeholder }) => (
        <div key={name}>
          <label className="block text-sm text-slate-400 mb-1">{label}</label>
          <input
            name={name}
            type={type}
            value={form[name]}
            onChange={handleChange}
            required
            placeholder={placeholder}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500 transition"
          />
        </div>
      ))}
      {error && (
        <p className="text-sm text-rose-400 bg-rose-500/10 border border-rose-500/20 rounded-lg px-3 py-2">
          {error}
        </p>
      )}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white font-semibold rounded-xl py-2.5 transition"
      >
        {loading ? "Creating account…" : "Create Account"}
      </button>
      <p className="text-center text-sm text-slate-500">
        Already have an account?{" "}
        <button
          type="button"
          onClick={onSwitch}
          className="text-violet-400 hover:text-violet-300 underline"
        >
          Sign in
        </button>
      </p>
    </form>
  );
}
