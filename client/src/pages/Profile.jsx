import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  signOutStart,
  updateUser,
} from "../redux/user/userSlice";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

export default function Profile() {
  const fileRef = useRef(null);
  const { currentUser } = useSelector((state) => state.user);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({});
  const navigate = useNavigate();
  // Redirect unauthenticated users
  useEffect(() => {
    if (!currentUser) {
      navigate("/sign-in");
    } else {
      setPreview(currentUser.avatar?.url || "");
    }
  }, [currentUser, navigate]);

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

    const updatedData = new FormData();

    if (file) updatedData.append("avatar", file);
    if (formData.username) updatedData.append("username", formData.username);
    if (formData.email) updatedData.append("email", formData.email);
    if (formData.password) updatedData.append("password", formData.password);

    try {
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "PUT",
        body: updatedData,
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message);

      dispatch(updateUser(data.updatedUser));
    } catch (err) {
      console.error("Update failed:", err.message);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleDeleteUser = async () => {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success === true) {
        dispatch(deleteUserSuccess(data));
      } else {
        dispatch(deleteUserFailure(data.message));
      }
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };

  const handleSignOut = async () => {
    try {
      dispatch(signOutStart());
      const res = await fetch("/api/auth/signout", {
        method: "POST",
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data));
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };

  if (!currentUser) {
    return (
      <div className="text-center mt-10 text-red-500">
        Please sign in to access your profile.
      </div>
    );
  }

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
          value={formData.username || currentUser.username || ""}
          onChange={handleChange}
        />
        <input
          type="email"
          placeholder="email"
          id="email"
          className="border p-3 rounded-lg"
          value={formData.email || currentUser.email || ""}
          onChange={handleChange}
        />
        <input
          type="password"
          placeholder="password"
          id="password"
          className="border p-3 rounded-lg"
          onChange={handleChange}
        />
        <button className="bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80">
          update
        </button>
        <Link to={"/create-listing"} className="bg-green-700 text-white p-3 rounded-lg uppercase
        text-center hover:opacity-75 " >
          Create Listing
        </Link>
      </form>
      <div className="flex justify-between mt-5">
        <span
          onClick={handleDeleteUser}
          className="text-red-700 cursor-pointer"
        >
          Delete account
        </span>
        <span onClick={handleSignOut} className="text-red-700 cursor-pointer">
          Sign out
        </span>
      </div>
    </div>
  );
}
