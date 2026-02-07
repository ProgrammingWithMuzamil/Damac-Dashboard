import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { api } from '../services';
import { useAuth } from '../contexts/AuthContext';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    phone: '',
    bio: '',
    password: '',
    confirmPassword: '',
    profile_image: null,
  });

  const [preview, setPreview] = useState(null);

  useEffect(() => {
    if (user) {
      setFormData({
        title: user.title || '',
        phone: user.phone || '',
        bio: user.bio || '',
        password: '',
        confirmPassword: '',
        profile_image: null,
      });
      setPreview(user.profile_image_url || null);
    }
  }, [user]);

  useEffect(() => {
    const hasAnyChange =
      formData.title !== (user?.title || '') ||
      formData.phone !== (user?.phone || '') ||
      formData.bio !== (user?.bio || '') ||
      !!formData.profile_image ||
      (formData.password && formData.password === formData.confirmPassword);

    setHasChanges(hasAnyChange);
  }, [formData, user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImage = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFormData((prev) => ({ ...prev, profile_image: file }));
    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result);
    reader.readAsDataURL(file);
  };

  const removePhoto = () => {
    setFormData((prev) => ({ ...prev, profile_image: null }));
    setPreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!hasChanges) return toast.info('No changes to save');

    if (formData.password && formData.password !== formData.confirmPassword) {
      return toast.error('Passwords do not match');
    }

    setLoading(true);

    try {
      const data = new FormData();
      if (formData.title !== user?.title) data.append('title', formData.title);
      if (formData.phone !== user?.phone) data.append('phone', formData.phone);
      if (formData.bio !== user?.bio) data.append('bio', formData.bio);
      if (formData.profile_image) data.append('profile_image', formData.profile_image);
      if (formData.password) data.append('password', formData.password);

      if ([...data.entries()].length === 0) return toast.info('No changes detected');

      const res = await api.patch('/profile/', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      updateUser(res.data.user || res.data);
      toast.success('Profile updated successfully');

      setFormData((prev) => ({
        ...prev,
        password: '',
        confirmPassword: '',
        profile_image: null,
      }));
      setShowPasswordChange(false);
    } catch (err) {
      const msg =
        err.response?.data?.detail ||
        err.response?.data?.non_field_errors?.[0] ||
        'Failed to update profile';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setFormData({
      title: user?.title || '',
      phone: user?.phone || '',
      bio: user?.bio || '',
      password: '',
      confirmPassword: '',
      profile_image: null,
    });
    setPreview(user?.profile_image_url || null);
    setShowPasswordChange(false);
  };

  return (
    <div className="min-h-screen bg-gray-50/70 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-10 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">Profile Settings</h1>
          <p className="mt-3 text-lg text-gray-600">Update your personal information and account security</p>
        </div>

        {/* Main Card – wider & cleaner */}
        <div className="bg-white shadow-xl shadow-gray-200/30 rounded-2xl border border-gray-200/80 overflow-hidden">
          <form onSubmit={handleSubmit}>
            {/* Avatar + quick info – more spacious */}
            <div className="px-6 py-12 sm:px-10 md:px-12 bg-gradient-to-b from-gray-50 to-white border-b border-gray-200">
              <div className="flex flex-col md:flex-row items-center md:items-start gap-8 md:gap-12">
                <div className="relative group shrink-0">
                  {preview ? (
                    <img
                      src={preview}
                      alt="Profile"
                      className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover border-4 border-white shadow-2xl ring-1 ring-gray-200/60 transition-transform group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center border-4 border-white shadow-2xl ring-1 ring-gray-200/60">
                      <span className="text-5xl md:text-6xl font-semibold text-gray-500/80">
                        {user?.name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || '?'}
                      </span>
                    </div>
                  )}

                  <label
                    htmlFor="avatar"
                    className="absolute -bottom-3 -right-3 bg-blue-600 text-white p-3 rounded-full cursor-pointer shadow-lg hover:bg-blue-700 transition-all duration-200 transform hover:scale-110 ring-2 ring-white"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9zM15 13a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    <input id="avatar" type="file" accept="image/*" onChange={handleImage} className="hidden" />
                  </label>
                </div>

                <div className="text-center md:text-left space-y-2">
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                    {user?.name || 'Your Name'}
                  </h2>
                  <p className="text-base text-gray-600 font-medium">{user?.email}</p>
                  {user?.title && (
                    <p className="text-sm text-gray-500">{user.title}</p>
                  )}

                  <div className="pt-4 flex flex-wrap gap-5 justify-center md:justify-start">
                    <label
                      htmlFor="avatar"
                      className="text-sm font-semibold text-blue-600 hover:text-blue-800 cursor-pointer transition-colors"
                    >
                      Upload new photo
                    </label>
                    {preview && (
                      <button
                        type="button"
                        onClick={removePhoto}
                        className="text-sm font-semibold text-red-600 hover:text-red-800 transition-colors"
                      >
                        Remove photo
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Form content – more breathing room */}
            <div className="px-6 py-10 sm:px-10 md:px-12 space-y-12">
              {/* Personal Information */}
              <div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-6">Personal Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Title / Position</label>
                    <input
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      className="block w-full rounded-xl border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500/30 focus:ring-offset-0 py-3 px-4 text-base transition-all hover:border-gray-400"
                      placeholder="e.g. Senior Real Estate Agent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="block w-full rounded-xl border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500/30 focus:ring-offset-0 py-3 px-4 text-base transition-all hover:border-gray-400"
                      placeholder="+92 300 1234567"
                    />
                  </div>
                </div>

                <div className="mt-8">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                  <textarea
                    name="bio"
                    rows={4}
                    value={formData.bio}
                    onChange={handleChange}
                    className="block w-full rounded-xl border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500/30 focus:ring-offset-0 py-3 px-4 text-base transition-all hover:border-gray-400 resize-none"
                    placeholder="Tell something about yourself..."
                  />
                </div>

                <div className="mt-8">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                  <input
                    type="email"
                    value={user?.email || ''}
                    disabled
                    className="block w-full rounded-xl border-gray-200 bg-gray-50 text-gray-500 py-3 px-4 text-base cursor-not-allowed"
                  />
                </div>
              </div>

              {/* Security */}
              <div className="pt-10 border-t border-gray-200">
                <h3 className="text-2xl font-semibold text-gray-900 mb-6">Security</h3>

                {!showPasswordChange ? (
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between bg-gray-50 rounded-xl p-6 border border-gray-200">
                    <div>
                      <h4 className="text-lg font-medium text-gray-900">Password</h4>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowPasswordChange(true)}
                      className="mt-4 sm:mt-0 px-6 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition shadow-sm"
                    >
                      Change Password
                    </button>
                  </div>
                ) : (
                  <div className="space-y-6 bg-blue-50/30 border border-blue-100 rounded-xl p-6 md:p-8">
                    <div className="text-sm text-blue-800 bg-blue-100/50 p-4 rounded-lg">
                      Leave both fields blank if you don't want to change your password.
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                        <input
                          type="password"
                          name="password"
                          value={formData.password}
                          onChange={handleChange}
                          className="block w-full rounded-xl border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500/30 py-3 px-4 text-base transition-all hover:border-gray-400"
                          placeholder="••••••••"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
                        <input
                          type="password"
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          className="block w-full rounded-xl border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500/30 py-3 px-4 text-base transition-all hover:border-gray-400"
                          placeholder="••••••••"
                        />
                      </div>
                    </div>

                    <div className="flex gap-4 pt-4">
                      <button
                        type="button"
                        onClick={() => {
                          setShowPasswordChange(false);
                          setFormData((p) => ({ ...p, password: '', confirmPassword: '' }));
                        }}
                        className="px-6 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Action buttons – more prominent */}
              <div className="pt-10 flex flex-col sm:flex-row gap-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={reset}
                  className="flex-1 sm:flex-none px-8 py-3.5 border-2 border-gray-300 rounded-xl text-base font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={loading || !hasChanges}
                  className={`
                    flex-1 px-8 py-3.5 rounded-xl text-base font-semibold text-white transition-all duration-200 shadow-md
                    ${hasChanges && !loading
                      ? 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800 shadow-blue-200 hover:shadow-blue-300'
                      : 'bg-gray-400 cursor-not-allowed opacity-70 shadow-none'
                    }
                  `}
                >
                  {loading ? (
                    <div className="flex items-center justify-center gap-3">
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-30" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Saving...
                    </div>
                  ) : (
                    'Save Changes'
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>

        <p className="mt-10 text-center text-sm text-gray-500">
          All changes are saved securely • Last updated: {new Date().toLocaleDateString()}
        </p>
      </div>
    </div>
  );
};

export default Profile;