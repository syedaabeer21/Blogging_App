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
import { collection, addDoc ,doc, setDoc} from 'firebase/firestore';

const Register = () => {
  // Taking values from the form
  const fullName = useRef();
  const email = useRef();
  const password = useRef();

  // For Navigation
  const navigate = useNavigate();

  // For error handling
  const [error, setError] = useState(null);

  const registerUser = (event) => {
    event.preventDefault();
    // Clear previous error messages
    setError(null);

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
        // Redirect to the login page
        navigate('/login');
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        setError(errorMessage);
        console.error("Error registering user:", errorCode, errorMessage);
      });
  };

  const register = async (user) => {
    try {
      await setDoc(doc(db, "bloggers", user.uid), { // Set the document ID to user.uid
        fullName: fullName.current.value,
        email: email.current.value,
        uid: user.uid
      });
      console.log("Blogger registered with UID as document ID:", user.uid);
    } catch (e) {
      console.error("Error adding document:", e);
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
            <h2 className="text-2xl font-bold text-center mb-6 text-violet-500">REGISTER</h2>
            {error && (
              <div className="text-red-500 mb-4">
                <strong>{error}</strong>
              </div>
            )}
            <form className="space-y-4">
              <input
                type="text"
                placeholder="Enter Your Fullname" ref={fullName}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
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
                type="submit" onClick={registerUser}
                className="w-full p-3 bg-violet-500 text-white rounded-lg hover:bg-violet-600 transition duration-300"
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
