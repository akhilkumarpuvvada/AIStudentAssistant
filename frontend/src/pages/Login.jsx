import React, { useState } from "react";
import toast from "react-hot-toast";
import { useAppContext } from "../context/AppContext";

const Login = () => {
  const [state, setState] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { api, setCurrentUser } = useAppContext();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = state === "login" ? "/auth/login" : "/auth/signup";

    try {
      const { data } = await api.post(url, { name, email, password });

      if (data.success) {
        const { data: userData } = await api.get(`/user/${data.user.id}`);
        setCurrentUser(userData.data);

        toast.success(state === "login" ? "Logged in successfully!" : "Registered successfully!");
        if (state !== "login") {
          setName("");
          setEmail("");
          setPassword("");
          setState("login");
        }
      } else {
        toast.error("Authentication failed!");
      }
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 m-auto items-start p-8 py-12 w-80 sm:w-[352px] text-gray-500 rounded-lg shadow-xl border border-gray-200 bg-white"
    >
      <p className="text-2xl font-medium m-auto">
        <span className="text-purple-700">User</span> {state === "login" ? "Login" : "Sign Up"}
      </p>

      {state === "register" && (
        <div className="w-full">
          <p>Name</p>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Type here"
            className="border border-gray-200 rounded w-full p-2 mt-1 outline-purple-700"
            required
          />
        </div>
      )}

      <div className="w-full">
        <p>Email</p>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Type here"
          type="email"
          className="border border-gray-200 rounded w-full p-2 mt-1 outline-purple-700"
          required
        />
      </div>

      <div className="w-full">
        <p>Password</p>
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Type here"
          type="password"
          className="border border-gray-200 rounded w-full p-2 mt-1 outline-purple-700"
          required
        />
      </div>

      <p className="text-sm text-center w-full">
        {state === "login" ? (
          <>
            Create an account?{" "}
            <span onClick={() => setState("register")} className="text-purple-700 cursor-pointer">
              Click here
            </span>
          </>
        ) : (
          <>
            Already have an account?{" "}
            <span onClick={() => setState("login")} className="text-purple-700 cursor-pointer">
              Click here
            </span>
          </>
        )}
      </p>

      <button
        type="submit"
        className="bg-purple-700 hover:bg-purple-800 transition-all text-white w-full py-2 rounded-md cursor-pointer"
      >
        {state === "register" ? "Create Account" : "Login"}
      </button>
    </form>
  );
};

export default Login;
