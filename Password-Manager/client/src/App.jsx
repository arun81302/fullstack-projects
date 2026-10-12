import { useState,useEffect } from "react";
import axios from "axios";

const App = () => {
  const [password, setPassword] = useState("");
  const [title, setTitle] = useState("");

  useEffect(()=>{
    axios.get("http://localhost:3000/showpasswords").then((res)=>console.log(res.data))
  },[])

  async function addPassword() {
    try {
      const response = await axios.post(
        "http://localhost:3000/addpassword",
        {
          password: password,
          title: title,
        }
      );

      
      setPassword("");
      setTitle("");

      console.log("Password saved:", response.data);
    } catch (error) {
      console.error("Error saving password:", error);
    }
  }



  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-lg rounded-2xl border border-gray-200 bg-white p-6 shadow-lg sm:p-8">
        
        <h1 className="mb-2 text-center text-3xl font-bold text-gray-800">
          Password Manager
        </h1>

        <p className="mb-8 text-center text-sm text-gray-500">
          Store and manage your passwords easily.
        </p>

        
        <div className="flex flex-col gap-5">
          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Password
            </label>

            <input
              type="password"
              value={password}
              placeholder="Enter password"
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Website / Title
            </label>

            <input
              type="text"
              value={title}
              placeholder="e.g., Facebook"
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            />
          </div>

          
          <button
            type="button"
            onClick={addPassword}
            className="w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white shadow-md transition hover:bg-blue-700 active:scale-[0.98] cursor-pointer"
          >
            + Add Password
          </button>
        </div>
      </div>
    </div>
  );
};

export default App;