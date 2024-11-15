import React, { useEffect, useRef, useState } from 'react';
import { auth, db } from '../config/firebaseConfig';
import { addDoc, collection, deleteDoc, doc, getDocs, query, where, orderBy, serverTimestamp, updateDoc } from 'firebase/firestore';

const Dashboard = () => {
  const titleRef = useRef();
  const descriptionRef = useRef();

  const [loading, setLoading] = useState(false);
  const [blogs, setBlogs] = useState([]);
  const [error, setError] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [blogToDelete, setBlogToDelete] = useState(null);
  const [editingBlog, setEditingBlog] = useState(null); // Track the blog being edited

  useEffect(() => {
    fetchData();
  }, []);

  const postBlog = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const newBlog = {
        title: titleRef.current.value,
        description: descriptionRef.current.value,
        uid: auth.currentUser.uid,
        createdAt: serverTimestamp(),
      };
      
      await addDoc(collection(db, 'blogs'), newBlog);
      setBlogs((prevBlogs) => [{ ...newBlog, createdAt: new Date() }, ...prevBlogs]);
      titleRef.current.value = '';
      descriptionRef.current.value = '';
    } catch (e) {
      console.error('Error adding document: ', e);
      setError('Error posting blog');
    } finally {
      setLoading(false);
    }
  };

  const fetchData = async () => {
    try {
      const q = query(
        collection(db, 'blogs'),
        where('uid', '==', auth.currentUser.uid),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      const blogsList = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,  // Ensure this is correct
          ...data,
          createdAt: data.createdAt ? data.createdAt.toDate() : null,
        };
      });
      setBlogs(blogsList);
      
    } catch (e) {
      console.error('Error fetching blogs: ', e);
      setError('Error loading blogs');
    }
  };

  const confirmDeleteBlog = (blogId) => {
    console.log('Blog to delete:', blogId);
    setBlogToDelete(blogId);
    setShowDeleteModal(true);
  };

  const deleteBlog = async () => {
    if (!blogToDelete) return;

    try {
      await deleteDoc(doc(db, 'blogs', blogToDelete));
      setBlogs(blogs.filter((blog) => blog.id !== blogToDelete));
    } catch (e) {
      console.error('Error deleting document:', e);
      setError('Error deleting blog');
    } finally {
      setShowDeleteModal(false);
      setBlogToDelete(null);
    }
  };

  const startEditBlog = (blog) => {
    setEditingBlog(blog);
    titleRef.current.value = blog.title;
    descriptionRef.current.value = blog.description;
  };

  const updateBlog = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    if (!editingBlog) return;

    try {
      const updatedBlog = {
        title: titleRef.current.value,
        description: descriptionRef.current.value,
        updatedAt: serverTimestamp(),
      };

      // Update the blog in Firestore
      await updateDoc(doc(db, 'blogs', editingBlog.id), updatedBlog);

      // Update the blog in the state
      setBlogs((prevBlogs) =>
        prevBlogs.map((blog) =>
          blog.id === editingBlog.id ? { ...blog, ...updatedBlog } : blog
        )
      );

      // Reset editing state
      setEditingBlog(null);
      titleRef.current.value = '';
      descriptionRef.current.value = '';
    } catch (e) {
      console.error('Error updating document: ', e);
      setError('Error updating blog');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h1 className='text-center text-4xl font-bold text-violet-500 mt-5'>Dashboard</h1>

      <form className='flex flex-col gap-4 justify-center items-center mt-5' onSubmit={editingBlog ? updateBlog : postBlog}>
        <input
          type="text"
          placeholder="Title"
          className="input input-bordered w-full max-w-xs"
          ref={titleRef}
          required
        />
        <textarea
          className="textarea textarea-bordered w-[20rem]"
          placeholder="What is in your mind?"
          ref={descriptionRef}
          required
        ></textarea>
        <button
          type='submit'
          className="btn bg-violet-500 text-white rounded-lg hover:bg-violet-600"
        >
          {loading ? <span className="loading loading-spinner loading-sm"></span> : editingBlog ? 'Update Blog' : 'Publish Blog'}
        </button>
      </form>

      {error && <p className="text-red-500 mt-4">{error}</p>}

      <div className="mt-10 w-full flex flex-col items-center">
        {blogs.length === 0 ? (
          <p className="text-gray-500">No blogs posted yet.</p>
        ) : (
          blogs.map(blog => (
            <div key={blog.id} className="w-[90%] max-w-xl mb-4 p-4 border rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold">{blog.title}</h3>
              <p className="mt-2 text-gray-700">{blog.description}</p>
              {blog.createdAt && (
                <small className="text-gray-500">
                  Posted on: {blog.createdAt.toLocaleString()}
                </small>
              )}
              <br />
              <div className='flex justify-end'>
                <button
                  onClick={() => startEditBlog(blog)}
                  className="btn bg-violet-500 text-white rounded-lg hover:bg-violet-600 transition duration-300"
                >
                  Edit
                </button>
                <button
                  onClick={() => confirmDeleteBlog(blog.id)}
                  className="btn bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-300"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {showDeleteModal && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="text-lg font-bold">Are you sure you want to delete this blog?</h3>
            <p className="py-4">This action cannot be undone.</p>
            <div className="modal-action">
              <button onClick={() => setShowDeleteModal(false)} className="btn">Cancel</button>
              <button onClick={deleteBlog} className="btn bg-red-500 text-white">Confirm</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Dashboard;
