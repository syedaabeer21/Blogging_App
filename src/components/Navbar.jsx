import React, { useState, useEffect } from 'react';
import logo from '../assets/images/logo.png';
import { signOut, onAuthStateChanged } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../config/firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';

const Navbar = () => {
  const [bloggers, setBloggers] = useState(false); // Track user authentication state
  const [userName, setUserName] = useState(''); // Track user name
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setBloggers(true); // User is logged in
        console.log('User UID:', user.uid); // Check the UID being used

        // Fetch user details
        const userDocRef = doc(db, 'bloggers', user.uid);
        const userDoc = await getDoc(userDocRef);
        console.log('UserDoc exists:', userDoc.exists());  // Check if user document exists
        if (userDoc.exists()) {
          setUserName(userDoc.data().fullName); // Set the user's name
          console.log('User Name:', userDoc.data().fullName); // Log the user's name
        } else {
          console.log('No document found for UID:', user.uid); // Log if the document doesn't exist
        }
      } else {
        setBloggers(false); // User is logged out
      }
    });

    return () => unsubscribe();
  }, []);


  const logoutUser = () => {
    signOut(auth)
      .then(() => {
        navigate('/'); // Redirect to login after logout
      })
      .catch((error) => {
        console.error("Error logging out: ", error);
      });
  };

  return (
    <div className="navbar bg-violet-300 p-3">
      <div className="flex-1">
        <a>
          <img className="w-36" src={logo} alt="Logo" />
        </a>
      </div>

      {bloggers ? (
        <div>
          <ul className="menu menu-horizontal px-1"><li><a className="text-white text-lg font-semibold" href="/">Home</a></li></ul>
          <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className="btn">
             {userName }
            </div>
            <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-[1] w-44 p-2 shadow">
              <li className="hover:bg-violet-200 rounded-lg"><a href='/dashboard'>Dashboard</a></li>
              <li className="hover:bg-violet-200 rounded-lg"><a href='/profile'>Profile</a></li>
              <li className="hover:bg-violet-200 rounded-lg"><a onClick={logoutUser}>Logout</a></li>
            </ul>
          </div>
        </div>
      ) : (
        <div className="flex-none">
          <ul className="menu menu-horizontal px-1">
            <li><a className="text-white text-lg font-semibold" href="/">Home</a></li>
            <li><a className="text-white text-lg font-semibold" href="/register">Register</a></li>
            <li><a className="text-white text-lg font-semibold" href="/login">Login</a></li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default Navbar;
