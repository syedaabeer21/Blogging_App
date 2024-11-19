// import React, { useRef } from 'react'
// import image from '../assets/images/rb_855.png'
// import { useNavigate } from 'react-router-dom'
// import {  signInWithEmailAndPassword  } from 'firebase/auth';
// import { auth,db } from '../config/firebaseConfig';
// import { collection , getDocs } from 'firebase/firestore'


// const Login = () => {

//   //Taking Values
//   const email = useRef()
//   const password = useRef()

//   //Navigation
//   const navigate = useNavigate()

//   const loginUser = (event) => {
//     event.preventDefault()
//     signInWithEmailAndPassword(auth, email.current.value, password.current.value)
//     .then((userCredential) => {
//       const user = userCredential.user;
//       login()
//       navigate('/')
//   })
//   .catch((error) => {
//     const errorCode = error.code;
//     const errorMessage = error.message;
//     console.log(error)
//   });
//   } 

//   const login = async () => {
//     const querySnapshot = await getDocs(collection(db, "bloggers"),{
//       email:email.current.value,
//       password:password.current.value
//     });
//         querySnapshot.forEach((doc) => {
//           console.log(`${doc.id} => ${doc.data()}`);
// });
//   }

//   return (
//     <>
//       <div className="flex justify-center items-center h-[calc(100vh-84px)]">
//       <div className="flex w-[60%] h-[70vh] border  rounded-lg overflow-hidden shadow-lg">
//         {/* Image Section */}
//         <div className="w-1/2">
//           <img src={image} alt="Registration" className="object-cover w-full h-full" />
//         </div>

//         {/* Form Section */}
//         <div className="w-1/2 p-8 flex flex-col justify-center">
//           <h2 className="text-2xl font-bold text-center mb-6 text-violet-500">LOGIN</h2>
//           <form className="space-y-4">
//             <input
//               type="email"
//               placeholder="Enter Email" ref={email}
//               className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//             />
//             <input
//               type="password"
//               placeholder="Enter Password" ref={password}
//               className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//             />
//             <button
//               type="submit" onClick={loginUser}
//               className="w-full p-3 bg-violet-500 text-white rounded-lg hover:bg-violet-600 transition duration-300"
//             >
//               Login
//             </button>
//           </form>
//         </div>
//       </div>
//     </div>
//     </>
//   )
// }

// export default Login

import React, { useRef, useState, useEffect } from 'react';
import image from '../assets/images/rb_855.png';
import { Link, useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';
import { auth } from '../config/firebaseConfig';

const Login = () => {
  // Taking values
  const email = useRef();
  const password = useRef();

  // Navigation
  const navigate = useNavigate();

  // For error and success handling
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  
  const loginUser = (event) => {
    event.preventDefault();
    setError(null); // Reset previous error
    setSuccess(null); // Reset previous success
  
    const emailValue = email.current.value;
    const passwordValue = password.current.value;
  
    if (!emailValue || !passwordValue) {
      setError("Please fill in all fields.");
      return;
    }
  
    signInWithEmailAndPassword(auth, emailValue, passwordValue)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log("User logged in:", user);
        setSuccess("Login successful!");
        // Wait for 3 seconds before redirecting
        setTimeout(() => {
          navigate('/'); // Redirect to home page
        }, 3000);
      })
      .catch((error) => {
        const errorMessage = error.message;
        setError("Invalid email or password. Please try again.");
        console.error("Error logging in:", errorMessage);
      });
  };
  

  return (
    <>
      <div className="flex justify-center items-center h-[calc(100vh-84px)]">
        <div className="flex w-[60%] h-[70vh] border rounded-lg overflow-hidden shadow-lg">
          {/* Image Section */}
          <div className="w-1/2">
            <img src={image} alt="Login" className="object-cover w-full h-full" />
          </div>

          {/* Form Section */}
          <div className="w-1/2 p-8 flex flex-col justify-center">
            <h2 className="text-2xl font-bold text-center mb-6 text-violet-500">LOGIN</h2>
            {error && (
              <div className="text-red-500 mb-4">
                <strong>{error}</strong>
              </div>
            )}
            {success && (
              <div role="alert" className="alert alert-success mb-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 shrink-0 stroke-current"
                  fill="none"
                  viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Successfully Login!</span>
              </div>
            )}

            <form className="space-y-4">
              <input
                type="email"
                placeholder="Enter Email"
                ref={email}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="password"
                placeholder="Enter Password"
                ref={password}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                onClick={loginUser}
                className="w-full p-3 bg-violet-500 text-white rounded-lg hover:bg-violet-600 transition duration-300"
              >
                Login
              </button>
              <div className="flex justify-between mt-4">
                <Link className="underline text-violet-500" to="/Register">
                  Create Account
                </Link>
                <Link className="underline text-violet-500" to="/ForgetPassword">
                  Forgot Password?
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
