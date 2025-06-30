import { useState } from "react";

function Signup({ setUser }) {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();
    fetch("http://localhost:5555/signup", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((r) => {
        if (!r.ok) {
          throw new Error(`HTTP error! status: ${r.status}`);
        }
        return r.json();
      })
      .then((data) => {
        if (data.error) {
          alert(data.error);
        } else {
          setUser(data); // ✅ Set user state
        }
      })
      .catch((error) => {
        console.error("Signup error:", error);
        alert(
          "Backend server is not running. Please start the Flask server on port 5555.",
        );
      });
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>Sign Up</h2>
      <input name="username" placeholder="Username" onChange={handleChange} />
      <input name="email" placeholder="Email" onChange={handleChange} />
      <input
        name="password"
        type="password"
        placeholder="Password"
        onChange={handleChange}
      />
      <button type="submit">Sign Up</button>
    </form>
  );
}

export default Signup;
