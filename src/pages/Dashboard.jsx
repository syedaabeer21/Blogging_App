import React, { useEffect, useRef, useState } from 'react';
import { auth, db } from '../config/firebaseConfig';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
  orderBy,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore';

const Dashboard = () => {
  const titleRef = useRef();
  const descriptionRef = useRef();

  const [loading, setLoading] = useState(false);
  const [spin, setSpin] = useState(true);
  const [blogs, setBlogs] = useState([]);
  const [error, setError] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [blogToDelete, setBlogToDelete] = useState(null);
  const [editingBlog, setEditingBlog] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

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

      setSuccessMessage('Blog published successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (e) {
      console.error('Error adding document: ', e);
      setError('Error posting blog');
    } finally {
      setLoading(false);
    }
  };

  const fetchData = async () => {
    setSpin(true);
    try {
      const q = query(
        collection(db, 'blogs'),
        where('uid', '==', auth.currentUser.uid),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      const blogsList = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          createdAt: data.createdAt ? data.createdAt.toDate() : null,
        };
      });
      setBlogs(blogsList);
    } catch (e) {
      console.error('Error fetching blogs: ', e);
      setError('Error loading blogs');
    } finally {
      setSpin(false);
    }
  };

  const confirmDeleteBlog = (blogId) => {
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
      setSuccessMessage('Blog Deleted successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
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

      await updateDoc(doc(db, 'blogs', editingBlog.id), updatedBlog);

      setBlogs((prevBlogs) =>
        prevBlogs.map((blog) =>
          blog.id === editingBlog.id ? { ...blog, ...updatedBlog } : blog
        )
      );
    
      setEditingBlog(null);
      setSuccessMessage('Blog Updated successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
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
      {/* Hero Section */}
      <section className="bg-violet-100 text-center py-10">
        <h1 className="text-4xl font-bold text-violet-600">Your Dashboard</h1>
        <p className="mt-3 text-gray-700">Create, manage, and edit your blogs all in one place.</p>
      </section>

      {/* Blog Form */}
      <form
        className="flex flex-col gap-4 justify-center items-center mt-5 w-full max-w-3xl mx-auto"
        onSubmit={editingBlog ? updateBlog : postBlog}
      >
        <input
          type="text"
          placeholder="Title"
          className="input input-bordered w-full"
          ref={titleRef}
          required
        />
        <textarea
          className="textarea textarea-bordered w-full"
          placeholder="What is on your mind?"
          ref={descriptionRef}
          required
        ></textarea>
        <button
          type="submit"
          className="btn bg-violet-600 text-white rounded-lg hover:bg-violet-700 w-full"
        >
          {loading ? (
            <span className="loading loading-spinner loading-sm"></span>
          ) : editingBlog ? (
            'Update Blog'
          ) : (
            'Publish Blog'
          )}
        </button>
      </form>

      {/* Success Message */}
      <div className='flex justify-center mt-3'>
      {successMessage && (
              <div role="alert" className="alert alert-success mb-3 max-w-3xl  ">
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
                <span>{successMessage}</span>
              </div>
            )}
      </div>

      {/* Error Message */}
      {error && <p className="text-red-500 mt-4">{error}</p>}

      {spin && (
        <p className="text-violet-600 flex justify-center mt-10">
          <span className="loading loading-spinner loading-lg"></span>
        </p>
      )}

      {/* Blogs List */}
      <div className="mt-10 w-full max-w-3xl mx-auto">
        {blogs.length === 0 ? (
          <p className="text-gray-500 text-center text-2xl">No blogs posted yet.</p>
        ) : (
          blogs.map((blog) => (
            <div
              key={blog.id}
              className="mb-6 p-4 border rounded-lg shadow-md bg-white hover:shadow-lg transition-shadow duration-300"
            >
              <h3 className="text-2xl font-semibold text-violet-700">{blog.title}</h3>
              <p className="mt-2 text-gray-600">{blog.description}</p>
              {blog.createdAt && (
                <small className="block mt-4 text-gray-500">
                  Posted on: {blog.createdAt.toLocaleString()}
                </small>
              )}
              <div className="flex justify-end gap-3 mt-4">
                <button
                  onClick={() => startEditBlog(blog)}
                  className="btn bg-violet-500 text-white rounded-lg hover:bg-violet-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => confirmDeleteBlog(blog.id)}
                  className="btn bg-red-500 text-white rounded-lg hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="text-lg font-bold">Are you sure you want to delete this blog?</h3>
            <p className="py-4">This action cannot be undone.</p>
            <div className="modal-action">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="btn bg-gray-500 text-white hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={deleteBlog}
                className="btn bg-red-500 text-white hover:bg-red-600"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Dashboard;
