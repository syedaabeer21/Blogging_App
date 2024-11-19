import React, { useEffect, useState } from 'react';
import { db } from '../config/firebaseConfig';
import { collection, getDocs, orderBy, query, doc, getDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { auth } from '../config/firebaseConfig';

const Home = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
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
          const userDocRef = doc(db, 'bloggers', data.uid);
          const userDoc = await getDoc(userDocRef);
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

  const handleViewBlogger = (blogUid) => {
    if (auth.currentUser) {
      navigate(`/blogger/${blogUid}`);
    } else {
      setShowAlert(true);
    }
  };

  return (
    <>
      {/* Hero Section */}
      <section className="bg-violet-100 text-center py-10">
        <h1 className="text-4xl font-bold text-violet-600">Explore Blogs from Our Community</h1>
        <p className="mt-3 text-gray-700">Discover insights, share stories, and connect with inspiring minds.</p>
      </section>

      {loading && (
        <p className="text-violet-500 flex justify-center mt-10">
          <span className="loading loading-spinner loading-lg"></span>
        </p>
      )}
      {error && <p className="text-Black-500 flex justify-center mt-10">{error}</p>}

      <div className="mt-10 grid grid-cols-1 gap-6 w-[90%] max-w-4xl mx-auto">
  {blogs.length === 0 && !loading ? (
    <p className="text-gray-500 text-center">No blogs available.</p>
  ) : (
    blogs.map((blog) => (
      <div
        key={blog.id}
        className="p-6 border border-gray-200 rounded-lg shadow-md bg-white hover:shadow-lg transition-shadow duration-300 flex flex-col justify-between h-[350px]"
      >
        <h3 className="text-2xl font-semibold text-violet-700 flex items-center">
          <svg
            className="w-6 h-6 mr-2"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
          {blog.title}
        </h3>
        <p className="mt-3 text-gray-600 leading-relaxed line-clamp-3">{blog.description}</p>
        {blog.createdAt && (
          <strong className="block mt-4 text-gray-500">
            By <span className="font-medium text-violet-500">{blog.bloggerName}</span> on{' '}
            {blog.createdAt.toLocaleString()}
          </strong>
        )}
       <div className='flex justify-end'>
       <button
          onClick={() => handleViewBlogger(blog.uid)}
          className="mt-4 btn bg-violet-600 text-white rounded-full hover:bg-violet-700 px-6 py-2">
          View Blogger's Posts
        </button>
       </div>
      </div>
    ))
  )}
</div>


      {/* DaisyUI Alert Modal */}
      {showAlert && (
        <div className="modal modal-open">
          <div className="modal-box border border-violet-500">
            <h2 className="text-lg font-semibold text-violet-500 flex items-center">
              <svg
                className="w-6 h-6 mr-2"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 9v10M8 9v10M4 4h16" />
              </svg>
              Login Required
            </h2>
            <p className="mt-3 text-gray-600">Please log in to view more posts from this blogger.</p>
            <div className="modal-action flex justify-between">
              <button
                onClick={() => navigate('/login')}
                className="btn bg-violet-500 text-white hover:bg-violet-600 rounded-full px-6"
              >
                Login Now
              </button>
              <button
                onClick={() => setShowAlert(false)}
                className="btn bg-gray-400 text-white hover:bg-gray-500 rounded-full px-6"
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
