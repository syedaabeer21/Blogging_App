// import { onAuthStateChanged } from 'firebase/auth';
// import React, { useEffect, useState } from 'react'
// import { useNavigate } from 'react-router-dom';
// import { auth } from '../config/firebaseConfig';

// const ProtectedRoutes = ({ component }) => {
//     const [bloggers, setBloggers] = useState(false);


//       // use navigate 
//       const navigate = useNavigate()
//       useEffect(() => {
//           onAuthStateChanged(auth, (bloggers) => {
//               if (bloggers) {
//                   setBloggers(true)
//                   return
//               }
//               navigate('/login')
//           })
//       }, [])

//     return (
//         bloggers ? component : <h1>Loading...</h1>
//     )
// }

// export default ProtectedRoutes
import React, { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { auth } from '../config/firebaseConfig';

const ProtectedRoutes = ({ component }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsAuthenticated(true);
      } else {
        navigate('/login');
      }
    });
    return unsubscribe;
  }, [navigate]);

  return isAuthenticated ? component : <h1>Loading...</h1>;
};

export default ProtectedRoutes;
