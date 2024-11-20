import React, { useEffect, useState } from 'react';
import { auth, db } from '../config/firebaseConfig';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { updateEmail, updatePassword } from 'firebase/auth';

const Profile = () => {
  const [blogger, setBlogger] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const [newFullName, setNewFullName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');

  useEffect(() => {
    const fetchBlogger = async () => {
      const user = auth.currentUser;
      if (!user) {
        setError('No user is logged in');
        setLoading(false);
        return;
      }

      try {
        const docRef = doc(db, 'bloggers', user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setBlogger(data);
          setNewFullName(data.fullName); // Pre-fill the current full name
          setNewEmail(user.email); // Pre-fill the current email
        } else {
          setError('Blogger not found in database');
        }
      } catch (e) {
        console.error('Error fetching blogger:', e);
        setError('Error loading profile');
      } finally {
        setLoading(false);
      }
    };

    fetchBlogger();
  }, []);

  const handleFullNameUpdate = async () => {
    try {
      const user = auth.currentUser;
      const docRef = doc(db, 'bloggers', user.uid);
      await updateDoc(docRef, { fullName: newFullName });
      setBlogger((prev) => ({ ...prev, fullName: newFullName }));
      setSuccess('Full name updated successfully!');
      setTimeout(()=>{
        setSuccess(null)
      },2000)
    } catch (e) {
      console.error('Error updating full name:', e);
      setError('Failed to update full name');
    }
  };

  const handleEmailUpdate = async () => {
    try {
      const user = auth.currentUser;
      await updateEmail(user, newEmail); // Update email in Firebase Auth
      const docRef = doc(db, 'bloggers', user.uid);
      await updateDoc(docRef, { email: newEmail }); // Sync with Firestore
      setSuccess('Email updated successfully!');
      setTimeout(()=>{
        setSuccess(null)
      },2000)
    } catch (e) {
      console.error('Error updating email:', e);
      setError('Failed to update email');
    }
  };

  const handlePasswordUpdate = async () => {
    try {
      const user = auth.currentUser;
      await updatePassword(user, newPassword);
      setSuccess('Password updated successfully!');
      setTimeout(()=>{
        setSuccess(null)
      },2000)
    } catch (e) {
      console.error('Error updating password:', e);
      setError('Failed to update password');
    }
  };

  if (loading) return <p className="text-violet-500 flex justify-center mt-10">
  <span className="loading loading-spinner loading-lg"></span>
</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="flex flex-col items-center mt-10">
      <h1 className="text-3xl font-bold text-violet-600">Profile</h1>
      <p className="text-gray-600 mt-2">{blogger.email}</p>

      {success && (
              <div role="alert" className="w-96 alert alert-success mb-3 mt-3">
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
                <span>{success}</span>
              </div>
            )}
      {error && <p className="text-red-500 mt-4">{error}</p>}

      <div className="w-full max-w-md mt-5">
        <div className="mb-4">
          <label className="block font-semibold">Full Name</label>
          <input
            type="text"
            value={newFullName}
            onChange={(e) => setNewFullName(e.target.value)}
            className="input input-bordered w-full"
          />
          <button
            onClick={handleFullNameUpdate}
            className="btn bg-violet-600 text-white w-full mt-2"
          >
            Update Full Name
          </button>
        </div>

        <div className="mb-4">
          <label className="block font-semibold">Email</label>
          <input
            type="email"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            className="input input-bordered w-full"
          />
          <button
            onClick={handleEmailUpdate}
            className="btn bg-violet-600 text-white w-full mt-2"
          >
            Update Email
          </button>
        </div>

        <div className="mb-4">
          <label className="block font-semibold">Password</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="input input-bordered w-full"
          />
          <button
            onClick={handlePasswordUpdate}
            className="btn bg-violet-600 text-white w-full mt-2"
          >
            Update Password
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
