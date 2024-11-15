import React, { useEffect, useState } from 'react';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '../config/firebaseConfig';
import { useParams } from 'react-router-dom';

const SingleBlogger = () => {
  const { uid } = useParams();
  const [blogs, setBlogs] = useState([]);
  const [bloggerName, setBloggerName] = useState("Loading...");
  const [error, setError] = useState(null);

  useEffect(() => {
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
          console.log("Blog Data:", data); // Debugging
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
    };

    fetchBloggerAndBlogs();
  }, [uid]);

  if (error) return <p className="text-red-500 text-center">{error}</p>;

  return (
    <div className="p-5">
      <h1 className="text-3xl font-bold text-center mb-5">{bloggerName}'s Blogs</h1>
      <div className="space-y-4">
        {blogs.length === 0 ? (
          <p className="text-center text-gray-500">No blogs posted by this blogger.</p>
        ) : (
          blogs.map((blog, index) => (
            <div key={index} className="border p-4 rounded-lg shadow-lg">
              <h2 className="text-xl font-semibold">{blog.title}</h2>
              <p className="text-gray-700">{blog.description}</p>
              {blog.timestamp ? (
                <p className="text-sm text-gray-500">
                  Posted on {blog.timestamp.toLocaleDateString()} at {blog.timestamp.toLocaleTimeString()}
                </p>
              ) : (
                <p className="text-sm text-gray-500">Date not available</p>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default SingleBlogger;
