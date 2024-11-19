// import React, { useRef } from 'react'
// import image from '../assets/images/rb_855.png'
// import { createUserWithEmailAndPassword } from 'firebase/auth';
// import { auth,db} from '../config/firebaseConfig';
// import { useNavigate } from 'react-router-dom';
// import { collection , addDoc } from 'firebase/firestore';

// const Register = () => {
  
//   //Taking values from form
//   const fullName = useRef()
//   const email = useRef()
//   const password = useRef()

//   //For NAvigation
//   const navigate = useNavigate()
 
//   const registerUser = (event) => {
//     event.preventDefault();
//     createUserWithEmailAndPassword(auth, email.current.value, password.current.value)
//     .then((userCredential) => {
//       const user = userCredential.user;
//       register()
//       navigate('/login')
//     })
//     .catch((error) => {
//       const errorCode = error.code;
//       const errorMessage = error.message;
//       // ..
//   });
//   }

//   const register = async () => {
//     try {
//       const docRef = await addDoc(collection(db, "bloggers"), {
//         fullName: fullName.current.value,
//         email:email.current.value,
//         password:password.current.value
//       });
//       console.log("Document written with ID: ", docRef.id);
//     } catch (e) {
//       console.error("Error adding document: ", e);
//     }

//   }

//   return (
//     <>
//     <div className="flex justify-center items-center h-[calc(100vh-84px)]">
//       <div className="flex w-[60%] h-[70vh] border  rounded-lg overflow-hidden shadow-lg">
//         {/* Image Section */}
//         <div className="w-1/2">
//           <img src={image} alt="Registration" className="object-cover w-full h-full" />
//         </div>

//         {/* Form Section */}
//         <div className="w-1/2 p-8 flex flex-col justify-center">
//           <h2 className="text-2xl font-bold text-center mb-6 text-violet-500">REGISTER</h2>
//           <form  className="space-y-4">
//             <input
//               type="text"
//               placeholder="Enter Your Fullname" ref={fullName}
//               className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//             />
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
//               type="submit" onClick={registerUser}
//               className="w-full p-3 bg-violet-500 text-white rounded-lg hover:bg-violet-600 transition duration-300"
//             >
//               Register
//             </button>
//           </form>
//         </div>
//       </div>
//     </div>

//     </>
//   )
// }
// export default Register

import React, { useRef, useState } from 'react';
import image from '../assets/images/rb_855.png';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../config/firebaseConfig';
import { useNavigate } from 'react-router-dom';
import { doc, setDoc } from 'firebase/firestore';

const Register = () => {
  // Taking values from the form
  const fullName = useRef();
  const email = useRef();
  const password = useRef();

  // For Navigation
  const navigate = useNavigate();

  // For error and success handling
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const registerUser = (event) => {
    event.preventDefault();
    // Clear previous messages
    setError(null);
    setSuccess(null);

    const emailValue = email.current.value;
    const passwordValue = password.current.value;

    if (!emailValue || !passwordValue || !fullName.current.value) {
      setError("Please fill in all fields.");
      return;
    }

    createUserWithEmailAndPassword(auth, emailValue, passwordValue)
      .then((userCredential) => {
        const user = userCredential.user;
        // Create the user document in Firestore
        register(user);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        setError("Invalid email or password");
        console.error("Error registering user:", errorCode, errorMessage);
      });
  };

  const register = async (user) => {
    try {
      await setDoc(doc(db, "bloggers", user.uid), {
        fullName: fullName.current.value,
        email: email.current.value,
        uid: user.uid,
      });
      console.log("Blogger registered with UID as document ID:", user.uid);
      setSuccess("User registered successfully! ");
      setTimeout(() => navigate('/login'), 2000); // Redirect after 3 seconds
    } catch (e) {
      console.error("Error adding document:", e);
      setError("An error occurred while registering.");
    }
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
            <h2 className="text-3xl font-bold text-center mb-6 text-violet-600">REGISTER</h2>

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
                <span>Successfully registered!</span>
              </div>
            )}

            <form className="space-y-4">
              <input
                type="text"
                placeholder="Enter Your Fullname"
                ref={fullName}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
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
                onClick={registerUser}
                className="font-bold w-full p-3 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition duration-300"
              >
                Register
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;

