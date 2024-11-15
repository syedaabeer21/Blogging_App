import React, { useEffect, useState } from 'react';
import { db } from '../config/firebaseConfig';
import { collection, getDocs, orderBy, query, doc, getDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { auth } from '../config/firebaseConfig'; // Import auth from firebase

const Home = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAlert, setShowAlert] = useState(false); // State to show/hide the alert modal
  const navigate = useNavigate();

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, 'blogs'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const blogsList = await Promise.all(
        querySnapshot.docs.map(async (blogDoc) => {
          const data = blogDoc.data();
          console.log('Blog UID:', data.uid);  // Log the UID from the blog document
          
          // Try to get the blogger document using the UID
          const userDocRef = doc(db, 'bloggers', data.uid);
          console.log('Fetching user document for UID:', data.uid);  // Log to ensure correct UID
  
          const userDoc = await getDoc(userDocRef);
          console.log('UserDoc exists:', userDoc.exists());  // Check if user document exists
          console.log('UserDoc Data:', userDoc.data());  // Log user document data
  
          return {
            id: blogDoc.id,
            ...data,
            createdAt: data.createdAt ? data.createdAt.toDate() : null,
            bloggerName: userDoc.exists() ? userDoc.data().fullName || 'Unknown' : 'Unknown',
          };
        })
      );
      setBlogs(blogsList);
    } catch (e) {
      console.error('Error fetching blogs: ', e);
      setError('Error loading blogs');
    } finally {
      setLoading(false);
    }
  };

  // Function to handle the navigation
  const handleViewBlogger = (blogUid) => {
    if (auth.currentUser) {
      // If logged in, navigate to the blogger's page
      navigate(`/blogger/${blogUid}`);
    } else {
      // If not logged in, show the custom DaisyUI alert modal
      setShowAlert(true);
    }
  };

  return (
    <>
      <h1 className='text-center text-4xl font-bold text-violet-500 mt-5'>All Blogs</h1>
      {loading && <p className="text-violet-500 flex justify-center mt-10 "><span className="loading loading-spinner loading-lg"></span></p>}
      {error && <p className="text-Black-500 flex justify-center mt-10">{error}</p>}
      <div className="mt-10 w-full flex flex-col items-center">
        {blogs.length === 0 && !loading ? (
          <p className="text-gray-500">No blogs available.</p>
        ) : (
          blogs.map(blog => (
            <div key={blog.id} className="w-[90%] max-w-xl mb-4 p-4 border rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold">{blog.title}</h3>
              <p className="mt-2 text-gray-700">{blog.description}</p>
              {blog.createdAt && (
                <small className="text-gray-500">
                  By {blog.bloggerName} on {blog.createdAt.toLocaleString()}
                </small>
              )}
              <br />
              <button
                onClick={() => handleViewBlogger(blog.uid)} // Use the new handler here
                className="btn mt-3 ms-80 bg-violet-500 text-white rounded-lg hover:bg-violet-600 transition duration-300"
              >
                All Blogs from this Blogger
              </button>
            </div>
          ))
        )}
      </div>

      {/* DaisyUI Alert Modal */}
      {showAlert && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h2 className="text-lg font-semibold text-violet-500">Login Required</h2>
            <p>Please log in first to view this blogger's posts.</p>
            <div className="modal-action">
              <button
                onClick={() => navigate('/login')}
                className="btn bg-violet-500 text-white hover:bg-violet-600"
              >
                Go to Login
              </button>
              <button
                onClick={() => setShowAlert(false)}
                className="btn bg-gray-500 text-white hover:bg-gray-600"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Home;
