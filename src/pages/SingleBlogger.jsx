import React, { useEffect, useState } from 'react';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '../config/firebaseConfig';
import { useParams } from 'react-router-dom';

const SingleBlogger = () => {
  const { uid } = useParams();
  const [blogs, setBlogs] = useState([]);
  const [bloggerName, setBloggerName] = useState("Loading...");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setLoading(true)
    const fetchBloggerAndBlogs = async () => {
      try {
        // Fetch blogger name from 'bloggers' collection
        const bloggerRef = doc(db, "bloggers", uid);
        const bloggerSnap = await getDoc(bloggerRef);
        if (bloggerSnap.exists()) {
          setBloggerName(bloggerSnap.data().fullName || "Unknown Blogger");
        } else {
          setBloggerName("Blogger not found");
        }

        // Fetch blogs from 'blogs' collection
        const blogsQuery = query(collection(db, "blogs"), where("uid", "==", uid));
        const querySnapshot = await getDocs(blogsQuery);
        const blogsData = querySnapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            ...data,
            timestamp: data.createdAt ? data.createdAt.toDate() : null, // Convert Firestore Timestamp
          };
        });

        setBlogs(blogsData);
      } catch (e) {
        console.error("Error fetching data:", e);
        setError("Error loading data. Please try again.");
      }
      finally{
        setLoading(false)
      }
    };

    fetchBloggerAndBlogs();
  }, [uid]);

  if (error)
    return <p className="text-red-500 text-center mt-5">{error}</p>;

  return (
    <div className="p-5 max-w-5xl mx-auto">
      <h1 className="text-4xl font-bold text-center text-violet-600 mb-8">
        {bloggerName.toUpperCase()} BLOGS
      </h1>
      {loading && (
        <p className="text-violet-500 flex justify-center mt-10">
          <span className="loading loading-spinner loading-lg"></span>
        </p>
      )}
      {blogs.length === 0 && !loading ? (
    <p className="text-gray-500 text-center">No blogs available.</p>
  ) : (
        <div className="mt-10 grid grid-cols-1 gap-6 w-[90%] max-w-4xl mx-auto">
          {blogs.map((blog, index) => (
            <div
              key={index}
              className="border rounded-lg p-5 shadow-md bg-white hover:shadow-lg transition-shadow duration-300"
            >
              <h2 className="text-2xl font-semibold text-gray-800 mb-3">
                {blog.title}
              </h2>
              <p className="text-gray-600 mb-4">{blog.description}</p>
              {blog.timestamp ? (
                <p className="text-md text-gray-500">
                  Posted on{" "}
                  <span className="font-medium">
                    {blog.timestamp.toLocaleDateString()} at{" "}
                    {blog.timestamp.toLocaleTimeString()}
                  </span>
                </p>
              ) : (
                <p className="text-sm text-gray-500">Date not available</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SingleBlogger;
