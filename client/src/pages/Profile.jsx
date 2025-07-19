import React, { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateUser } from "../redux/user/userSlice";

export default function Profile() {
  const fileRef = useRef(null);
  const { currentUser } = useSelector((state) => state.user);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(currentUser.avatar.url || "");
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({})

  // Handle File Select
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = () => {
      if (reader.readyState === 2) {
        setPreview(reader.result);
      }
    };

    if (file) {
      reader.readAsDataURL(file);
      setFile(file);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (file) {
      const formData = new FormData();
      formData.append("avatar", file); 
      formData.append("email", currentUser.email);

      try {
        const res = await fetch("/api/upload", {
          method: "PUT",
          body: formData,
        });

        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.message || "Upload failed");
        }

        dispatch(updateUser(data.user))
        
      } catch (err) {
        console.error("Upload error:", err.message);
      }
    }

    // Optionally send avatarUrl to update user profile in DB here
  };

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>
      <form className="flex flex-col gap-4" onSubmit={handleUpdate}>
        <input
          type="file"
          ref={fileRef}
          hidden
          accept="image/*"
          onChange={handleFileChange}
        />
        <img
          onClick={() => fileRef.current.click()}
          src={preview}
          alt="profile"
          className="rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2"
        />
        <input
          type="text"
          placeholder="username"
          id="username"
          className="border p-3 rounded-lg"
        />
        <input
          type="email"
          placeholder="email"
          id="email"
          className="border p-3 rounded-lg"
        />
        <input
          type="text"
          placeholder="password"
          id="password"
          className="border p-3 rounded-lg"
        />
        <button className="bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80">
          update
        </button>
      </form>
      <div className="flex justify-between mt-5">
        <span className="text-red-700 cursor-pointer">Delete account</span>
        <span className="text-red-700 cursor-pointer">Sign out</span>
      </div>
    </div>
  );
}
