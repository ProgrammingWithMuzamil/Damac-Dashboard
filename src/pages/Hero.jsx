import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';  // ← added for better confirmation dialog
import { heroAPI } from '../services/modules';

const Hero = () => {
  const [heroes, setHeroes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    type: 'image',
    heading: '',
    subheading: '',
    cta_text: '',
    cta_link: '',
    video: '',
    is_active: true,
  });
  const [selectedHero, setSelectedHero] = useState(null);
  const [mediaFile, setMediaFile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchHeroes();
  }, []);

  const fetchHeroes = async () => {
    try {
      setLoading(true);
      const data = await heroAPI.getAll();
      setHeroes(data.results || data);
    } catch (error) {
      toast.error('Failed to fetch heroes');
      console.error('Error fetching heroes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) setMediaFile(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let heroData = { ...formData };

      if (mediaFile && formData.type === 'image') {
        const formDataUpload = new FormData();
        formDataUpload.append('media', mediaFile);
        formDataUpload.append('type', formData.type);
        formDataUpload.append('heading', formData.heading);
        formDataUpload.append('subheading', formData.subheading);
        formDataUpload.append('cta_text', formData.cta_text);
        formDataUpload.append('cta_link', formData.cta_link);
        formDataUpload.append('video', formData.video);
        formDataUpload.append('is_active', formData.is_active);

        if (isEditing && selectedHero) {
          await heroAPI.uploadMedia(selectedHero.id, formDataUpload);
          toast.success('Hero updated successfully');
        } else {
          await heroAPI.create(formDataUpload);
          toast.success('Hero created successfully');
        }
      } else {
        if (isEditing && selectedHero) {
          await heroAPI.update(selectedHero.id, heroData);
          toast.success('Hero updated successfully');
        } else {
          await heroAPI.create(heroData);
          toast.success('Hero created successfully');
        }
      }

      resetForm();
      fetchHeroes();
    } catch (error) {
      toast.error('Failed to save hero');
      console.error('Error saving hero:', error);
    }
  };

  const handleEdit = (hero) => {
    setFormData({
      type: hero.type,
      heading: hero.heading || '',
      subheading: hero.subheading || '',
      cta_text: hero.cta_text || '',
      cta_link: hero.cta_link || '',
      video: hero.video || '',
      is_active: hero.is_active ?? true,
    });
    setSelectedHero(hero);
    setIsEditing(true);
    setMediaFile(null);
  };

  const handleDelete = async (heroId) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this action!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#3b82f6',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
      reverseButtons: true,
    });

    if (!result.isConfirmed) return;

    try {
      await heroAPI.delete(heroId);
      toast.success('Hero deleted successfully');
      fetchHeroes();
    } catch (error) {
      toast.error('Failed to delete hero');
      console.error('Error deleting hero:', error);
    }
  };

  const handleToggleActive = async (hero) => {
    try {
      await heroAPI.update(hero.id, { is_active: !hero.is_active });
      toast.success(`Hero ${hero.is_active ? 'deactivated' : 'activated'} successfully`);
      fetchHeroes();
    } catch (error) {
      toast.error('Failed to toggle hero status');
      console.error('Error toggling hero:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      type: 'image',
      heading: '',
      subheading: '',
      cta_text: '',
      cta_link: '',
      video: '',
      is_active: true,
    });
    setSelectedHero(null);
    setIsEditing(false);
    setMediaFile(null);
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center h-64">
        <div className="text-lg text-gray-600 animate-pulse">Loading luxury heroes...</div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Hero Management</h1>
        <p className="text-gray-600">Control the premium banner showcase on your Dubai properties website</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Form */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            {isEditing ? 'Edit Hero Section' : 'Create New Hero'}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Hero Type</label>
              <select
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="image">Image</option>
                <option value="video">Video</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Heading *</label>
              <input
                type="text"
                name="heading"
                value={formData.heading}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g. EXCLUSIVE LUXURY PROPERTIES IN DUBAI"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Subheading</label>
              <textarea
                name="subheading"
                value={formData.subheading}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g. Starting from AED 680,000 • Villas, Townhouses & Apartments"
              />
            </div>

            {formData.type === 'image' ? (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Hero Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
                {mediaFile && (
                  <p className="mt-2 text-sm text-gray-600">Selected: {mediaFile.name}</p>
                )}
              </div>
            ) : (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Video URL</label>
                <input
                  type="url"
                  name="video"
                  value={formData.video}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="https://www.youtube.com/embed/..."
                />
              </div>
            )}

            <div className="flex items-center">
              <input
                type="checkbox"
                name="is_active"
                checked={formData.is_active}
                onChange={handleInputChange}
                className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label className="ml-3 text-sm text-gray-700 font-medium">Set as Active Hero</label>
            </div>

            <div className="flex space-x-4 pt-4">
              <button
                type="submit"
                className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
              >
                {isEditing ? 'Update Hero' : 'Create Hero'}
              </button>
              {isEditing && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-6 py-3 bg-gray-200 text-gray-800 font-medium rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Existing Heroes */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Existing Heroes</h2>

          {heroes.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              No hero sections created yet.
            </div>
          ) : (
            <div className="space-y-6">
              {heroes.map((hero) => (
                <div
                  key={hero.id}
                  className="rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 group relative"
                  style={{
                    backgroundImage:
                      hero.type === 'image' && hero.media
                        ? `url(${hero.media})`
                        : 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    minHeight: hero.type === 'image' && hero.media ? '320px' : '240px',
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent" />

                  <div className="relative h-full p-6 flex flex-col justify-end">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <h3 className="text-2xl font-bold text-white drop-shadow-md">
                            {hero.heading}
                          </h3>
                          <span
                            className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${hero.is_active ? 'bg-green-600 text-white' : 'bg-gray-700 text-gray-200'
                              }`}
                          >
                            {hero.is_active ? 'Active' : 'Inactive'}
                          </span>
                        </div>

                        {hero.subheading && (
                          <p className="text-gray-100 text-base mb-4 drop-shadow">
                            {hero.subheading}
                          </p>
                        )}

                        <div className="text-xs text-gray-200 space-y-1">
                          <p>
                            Type: <span className="font-medium">{hero.type === 'image' ? 'Image' : 'Video'}</span>
                          </p>
                          {hero.type === 'video' && hero.video && (
                            <p className="truncate max-w-xs">Video: {hero.video}</p>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-2">
                        <button
                          onClick={() => handleEdit(hero)}
                          className="px-4 py-2 bg-blue-600/90 hover:bg-blue-700 text-white text-sm rounded-lg backdrop-blur-sm transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleToggleActive(hero)}
                          className={`px-4 py-2 text-white text-sm rounded-lg backdrop-blur-sm transition-colors ${hero.is_active ? 'bg-orange-600/90 hover:bg-orange-700' : 'bg-green-600/90 hover:bg-green-700'
                            }`}
                        >
                          {hero.is_active ? 'Deactivate' : 'Activate'}
                        </button>
                        <button
                          onClick={() => handleDelete(hero.id)}
                          className="px-4 py-2 bg-red-600/90 hover:bg-red-700 text-white text-sm rounded-lg backdrop-blur-sm transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="mt-10 bg-blue-50 border border-blue-200 rounded-xl p-6">
        <h4 className="text-sm font-semibold text-blue-800 mb-3">Hero Section Tips</h4>
        <ul className="text-sm text-blue-700 space-y-2">
          <li>• Only <strong>one hero</strong> should be active at a time</li>
          <li>• Use high-resolution images (min 1920×1080) for best results</li>
          <li>• Active hero appears prominently on the homepage</li>
          <li>• Video heroes currently use external URLs (YouTube/Vimeo/embed)</li>
        </ul>
      </div>
    </div>
  );
};

export default Hero;