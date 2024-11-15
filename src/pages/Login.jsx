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
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../config/firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';

const Login = () => {
  // Taking values
  const email = useRef();
  const password = useRef();

  // Navigation
  const navigate = useNavigate();

  // For error handling
  const [error, setError] = useState(null);

  // Redirect if the user is already logged in
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        navigate('/'); // Redirect to home if already logged in
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const loginUser = (event) => {
    event.preventDefault();
    setError(null); // Reset previous error
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
        navigate('/'); // Redirect to home page after successful login
      })
      .catch((error) => {
        const errorMessage = error.message;
        setError(errorMessage);
        console.error("Error logging in:", errorMessage);
      });
  };

  return (
    <>
      <div className="flex justify-center items-center h-[calc(100vh-84px)]">
        <div className="flex w-[60%] h-[70vh] border rounded-lg overflow-hidden shadow-lg">
          {/* Image Section */}
          <div className="w-1/2">
            <img src={image} alt="Registration" className="object-cover w-full h-full" />
          </div>

          {/* Form Section */}
          <div className="w-1/2 p-8 flex flex-col justify-center">
            <h2 className="text-2xl font-bold text-center mb-6 text-violet-500">LOGIN</h2>
            {error && (
              <div className="text-red-500 mb-4">
                <strong>{error}</strong>
              </div>
            )}
            <form className="space-y-4">
              <input
                type="email"
                placeholder="Enter Email" ref={email}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="password"
                placeholder="Enter Password" ref={password}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit" onClick={loginUser}
                className="w-full p-3 bg-violet-500 text-white rounded-lg hover:bg-violet-600 transition duration-300"
              >
                Login
              </button>
              <div className='flex justify-between'>
              <Link className='underline text-violet-500 ' to={'../Register'}>Create Account</Link>
              <Link className='underline text-violet-500 ' >Forget Password</Link>
              </div>
    
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
