import React, { useState, useEffect } from "react";
import logo from "../assets/images/logo.png";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../config/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { FaRegUser } from "react-icons/fa";

const Navbar = () => {
  const [bloggers, setBloggers] = useState(false);
  const [userName, setUserName] = useState("");
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setBloggers(true);
        const userDocRef = doc(db, "bloggers", user.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          setUserName(userDoc.data().fullName);
        }
      } else {
        setBloggers(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const logoutUser = () => {
    signOut(auth)
      .then(() => {
        setSuccess("Logout successful!");
        setTimeout(() => {
          setSuccess(null);
          navigate("/");
        }, 2000);
      })
      .catch((error) => {
        console.error("Error logging out: ", error);
      });
  };

  return (
    <div className="navbar bg-gradient-to-r from-violet-500 to-purple-600 p-3">
      <div className="flex-1">
        <a>
          <img className="w-36" src={logo} alt="Logo" />
        </a>
      </div>
      {success && (
        <div className="flex justify-center">
          <div role="alert" className="alert alert-success">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 shrink-0 stroke-current"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>Successfully Logout!</span>
          </div>
        </div>
      )}
      {bloggers ? (
        <div className="flex items-center gap-4">
          <ul className="menu menu-horizontal px-1">
            <li>
              <a className="text-white text-lg font-semibold" href="/">
                Home
              </a>
            </li>
          </ul>
          <div className="dropdown dropdown-end">
            <div
              tabIndex={0}
              role="button"
              className="flex items-center gap-2 bg-white text-gray-800 px-3 py-2 rounded-full shadow-md cursor-pointer hover:shadow-lg transition"
            >
              <FaRegUser className="text-violet-600" />
              <span className="font-semibold text-sm">{userName.toUpperCase()}</span>
            </div>
            <ul
              tabIndex={0}
              className="dropdown-content menu bg-white rounded-lg shadow-md z-[1] w-48 p-2"
            >
              <li className="hover:bg-violet-100 rounded-lg">
                <a href="/dashboard">Dashboard</a>
              </li>
              <li className="hover:bg-violet-100 rounded-lg">
                <a href="/profile">Profile</a>
              </li>
              <li className="hover:bg-violet-100 rounded-lg">
                <a onClick={logoutUser}>Logout</a>
              </li>
            </ul>
          </div>
        </div>
      ) : (
        <div className="flex-none">
          <ul className="menu menu-horizontal px-1">
            <li>
              <a className="text-white text-lg font-semibold" href="/">
                Home
              </a>
            </li>
            <li>
              <a className="text-white text-lg font-semibold" href="/register">
                Register
              </a>
            </li>
            <li>
              <a className="text-white text-lg font-semibold" href="/login">
                Login
              </a>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default Navbar;
