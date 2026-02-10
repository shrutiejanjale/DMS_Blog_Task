'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { Save, Upload, X, Tag, FileText, User, Folder, Image as ImageIcon, Star, Link as LinkIcon, Clock, AlertCircle } from 'lucide-react';
import { API_BASE_URL } from '../api/constant';

// Import ReactQuill dynamically with SSR disabled
const ReactQuill = dynamic(() => import('react-quill-new'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[400px] border border-slate-300 rounded-lg flex items-center justify-center bg-slate-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-indigo-600 border-t-transparent mx-auto mb-2"></div>
        <p className="text-slate-600">Loading editor...</p>
      </div>
    </div>
  )
});

export default function BlogForm({ initialData = {}, isEdit = false }) {
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    authorName: '',
    authorId: '',
    category: '',
    tags: [],
    featuredImage: null,
    metaTitle: '',
    metaDescription: '',
    content: '',
    seoKeywords: [],
    isFeatured: false,
    status: 'Draft',
    readTime: 0,
    ...initialData
  });
  const [errors, setErrors] = useState({});
  const [imagePreview, setImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);
  const [slugValidation, setSlugValidation] = useState({ checking: false, isUnique: true, message: '' });
  const router = useRouter();

  // Load ReactQuill CSS on client side only
  useEffect(() => {
    import('react-quill-new/dist/quill.snow.css');
  }, []);

  useEffect(() => {
    if (initialData.featuredImage) {
      setImagePreview(`${API_BASE_URL}${initialData.featuredImage}`);
    }
    // If editing, mark slug as manually edited to prevent auto-regeneration
    if (isEdit && initialData.slug) {
      setSlugManuallyEdited(true);
    }
  }, [initialData.featuredImage, initialData.slug, isEdit]);

  // Auto-generate slug from title
  useEffect(() => {
    if (formData.title && !slugManuallyEdited && !isEdit) {
      const generatedSlug = generateSlug(formData.title);
      setFormData(prev => ({ ...prev, slug: generatedSlug }));
    }
  }, [formData.title, slugManuallyEdited, isEdit]);

  // Auto-calculate read time from content
  useEffect(() => {
    const readTime = calculateReadTime(formData.content);
    setFormData(prev => ({ ...prev, readTime }));
  }, [formData.content]);

  // Validate slug uniqueness when it changes
  useEffect(() => {
    if (formData.slug) {
      const debounceTimer = setTimeout(() => {
        validateSlugUniqueness(formData.slug);
      }, 500); // Debounce for 500ms
      return () => clearTimeout(debounceTimer);
    }
  }, [formData.slug]);

  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const calculateReadTime = (content) => {
    if (!content) return 0;
    const text = content.replace(/<[^>]*>/g, '');
    const wordCount = text.split(/\s+/).filter(Boolean).length;
    const wordsPerMinute = 200;
    return Math.ceil(wordCount / wordsPerMinute) || 1;
  };

  const validateSlugUniqueness = async (slug) => {
    if (!slug) return;

    setSlugValidation({ checking: true, isUnique: true, message: '' });

    try {
      const response = await axios.get(`${API_BASE_URL}/api/blogs/check-slug/${slug}`, {
        params: isEdit ? { excludeId: initialData._id } : {}
      });

      if (response.data.isUnique) {
        setSlugValidation({
          checking: false,
          isUnique: true,
          message: '✓ Slug is available'
        });
      } else {
        setSlugValidation({
          checking: false,
          isUnique: false,
          message: '✗ This slug is already in use'
        });
      }
    } catch (error) {
      // If endpoint doesn't exist yet, skip validation
      setSlugValidation({ checking: false, isUnique: true, message: '' });
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
  };

  const handleSlugChange = (e) => {
    const slug = e.target.value.toLowerCase().replace(/[^\w-]/g, '');
    setFormData({ ...formData, slug });
    setSlugManuallyEdited(true);
  };

  const handleTags = (e) => {
    setFormData({ ...formData, tags: e.target.value.split(',').map(tag => tag.trim()) });
  };

  const handleKeywords = (e) => {
    setFormData({ ...formData, seoKeywords: e.target.value.split(',').map(kw => kw.trim()) });
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, featuredImage: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setFormData({ ...formData, featuredImage: null });
    setImagePreview(null);
  };

  const validate = () => {
    let errs = {};
    if (!formData.title) errs.title = 'Title is required';
    if (!formData.slug) errs.slug = 'Slug is required';
    if (!slugValidation.isUnique) errs.slug = 'Slug must be unique';
    if (!formData.authorName) errs.authorName = 'Author name is required';
    if (!formData.authorId) errs.authorId = 'Author ID is required';
    if (!formData.category) errs.category = 'Category is required';
    if (!formData.content) errs.content = 'Content is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    const data = new FormData();

    Object.keys(formData).forEach(key => {
      if (key === 'tags' || key === 'seoKeywords') {
        data.append(key, formData[key].join(','));
      } else if (key === 'featuredImage' && formData[key] instanceof File) {
        data.append('featuredImage', formData[key]);
      } else {
        data.append(key, formData[key]);
      }
    });

    try {
      if (isEdit) {
        await axios.put(`${API_BASE_URL}/api/blogs/${initialData._id}`, data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      } else {
        await axios.post(`${API_BASE_URL}/api/blogs`, data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }
      router.push('/blogs');
    } catch (err) {
      console.error(err);
      setErrors({ submit: err.response?.data?.error || 'Error saving blog. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      [{ 'color': [] }, { 'background': [] }],
      ['link', 'image'],
      ['clean']
    ],
  };

  const wordCount = formData.content ? formData.content.replace(/<[^>]*>/g, '').split(/\s+/).filter(Boolean).length : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-8 px-4">
      {/* Rest of your JSX remains exactly the same... */}
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-slate-200">
          <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
            <FileText className="text-indigo-600" size={32} />
            {isEdit ? 'Edit Blog Post' : 'Create New Blog Post'}
          </h1>
          <p className="text-slate-600 mt-2">Fill in the details below to {isEdit ? 'update' : 'create'} your blog post</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information Card */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-slate-200">
            <h2 className="text-xl font-semibold text-slate-800 mb-6 flex items-center gap-2">
              <FileText size={24} className="text-indigo-600" />
              Basic Information
            </h2>

            <div className="space-y-5">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Blog Title <span className="text-red-500">*</span>
                </label>
                <input
                  name="title"
                  placeholder="Enter an engaging title for your blog post"
                  value={formData.title}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all ${errors.title ? 'border-red-500' : 'border-slate-900'
                    }`}
                />
                {errors.title && <p className="text-red-500 text-sm mt-1 flex items-center gap-1">{errors.title}</p>}
              </div>

              {/* Slug */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                  <LinkIcon size={16} className="text-indigo-600" />
                  URL Slug <span className="text-red-500">*</span>
                  {!slugManuallyEdited && !isEdit && (
                    <span className="text-xs text-slate-500 font-normal">(Auto-generated from title)</span>
                  )}
                </label>
                <div className="relative">
                  <input
                    name="slug"
                    placeholder="url-friendly-slug"
                    value={formData.slug}
                    onChange={handleSlugChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all font-mono text-sm ${errors.slug ? 'border-red-500' :
                      slugValidation.checking ? 'border-yellow-500' :
                        !slugValidation.isUnique ? 'border-red-500' :
                          slugValidation.message ? 'border-green-500' : 'border-slate-300'
                      }`}
                  />
                  {slugValidation.checking && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-indigo-600 border-t-transparent"></div>
                    </div>
                  )}
                </div>
                {errors.slug && (
                  <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle size={14} /> {errors.slug}
                  </p>
                )}
                {!errors.slug && slugValidation.message && (
                  <p className={`text-sm mt-1 flex items-center gap-1 ${slugValidation.isUnique ? 'text-green-600' : 'text-red-500'
                    }`}>
                    {slugValidation.message}
                  </p>
                )}
                <p className="text-xs text-slate-500 mt-1">
                  URL: yoursite.com/blog/<span className="font-semibold text-indigo-600">{formData.slug || 'your-slug'}</span>
                </p>
              </div>

              {/* Author Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                    <User size={16} className="text-indigo-600" />
                    Author Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="authorName"
                    placeholder="Author's name"
                    value={formData.authorName}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all ${errors.authorName ? 'border-red-500' : 'border-slate-300'
                      }`}
                  />
                  {errors.authorName && <p className="text-red-500 text-sm mt-1">{errors.authorName}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Author ID <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="authorId"
                    placeholder="Unique author identifier"
                    value={formData.authorId}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all ${errors.authorId ? 'border-red-500' : 'border-slate-300'
                      }`}
                  />
                  {errors.authorId && <p className="text-red-500 text-sm mt-1">{errors.authorId}</p>}
                </div>
              </div>

              {/* Category and Status */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                    <Folder size={16} className="text-indigo-600" />
                    Category <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="category"
                    placeholder="e.g., Technology, Lifestyle, Business"
                    value={formData.category}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all ${errors.category ? 'border-red-500' : 'border-slate-300'
                      }`}
                  />
                  {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Status <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all appearance-none bg-white cursor-pointer"
                  >
                    <option value="Draft">Draft</option>
                    <option value="Published">Published</option>
                    <option value="Archived">Archived</option>
                  </select>
                </div>
              </div>

              {/* Featured Post */}
              <div className="flex items-center">
                <label className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-amber-50 to-yellow-50 rounded-lg border-2 border-amber-200 cursor-pointer hover:border-amber-300 transition-all">
                  <input
                    type="checkbox"
                    name="isFeatured"
                    checked={formData.isFeatured}
                    onChange={handleChange}
                    className="w-5 h-5 text-amber-500 rounded focus:ring-2 focus:ring-amber-400"
                  />
                  <Star size={20} className="text-amber-500" fill={formData.isFeatured ? "currentColor" : "none"} />
                  <span className="font-medium text-slate-700">Mark as Featured Post</span>
                </label>
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                  <Tag size={16} className="text-indigo-600" />
                  Tags
                </label>
                <input
                  name="tags"
                  placeholder="Enter tags separated by commas (e.g., react, javascript, tutorial)"
                  onChange={handleTags}
                  value={formData.tags.join(', ')}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                />
                <p className="text-xs text-slate-500 mt-1">Separate multiple tags with commas</p>
              </div>
            </div>
          </div>

          {/* Featured Image Card */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-slate-200">
            <h2 className="text-xl font-semibold text-slate-800 mb-6 flex items-center gap-2">
              <ImageIcon size={24} className="text-indigo-600" />
              Featured Image
            </h2>

            <div className="space-y-4">
              {imagePreview ? (
                <div className="relative group">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-64 object-cover rounded-lg border-2 border-slate-200"
                  />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute top-3 right-3 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-all shadow-lg opacity-0 group-hover:opacity-100"
                  >
                    <X size={20} />
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-slate-300 rounded-lg cursor-pointer hover:border-indigo-400 hover:bg-indigo-50/50 transition-all group">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-12 h-12 mb-3 text-slate-400 group-hover:text-indigo-500 transition-colors" />
                    <p className="mb-2 text-sm text-slate-600">
                      <span className="font-semibold">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-slate-500">PNG, JPG, GIF up to 10MB</p>
                  </div>
                  <input
                    type="file"
                    name="featuredImage"
                    onChange={handleImage}
                    className="hidden"
                    accept="image/*"
                  />
                </label>
              )}
            </div>
          </div>

          {/* Content Editor Card */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-slate-200">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-slate-800">Blog Content</h2>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2 px-3 py-2 bg-blue-50 rounded-lg border border-blue-200">
                  <FileText size={16} className="text-blue-600" />
                  <span className="text-blue-900 font-medium">{wordCount} words</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-2 bg-green-50 rounded-lg border border-green-200">
                  <Clock size={16} className="text-green-600" />
                  <span className="text-green-900 font-medium">{formData.readTime} min read</span>
                </div>
              </div>
            </div>
            <div className="prose-editor">
              <ReactQuill
                value={formData.content}
                onChange={(val) => setFormData({ ...formData, content: val })}
                modules={modules}
                theme="snow"
                className="bg-white rounded-lg"
                placeholder="Write your blog content here..."
              />
            </div>
            {errors.content && <p className="text-red-500 text-sm mt-2">{errors.content}</p>}
          </div>

          {/* SEO Optimization Card */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl shadow-lg p-8 border-2 border-green-200">
            <h2 className="text-xl font-semibold text-slate-800 mb-2 flex items-center gap-2">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              SEO Optimization
            </h2>
            <p className="text-sm text-slate-600 mb-6">Improve your blog's search engine visibility</p>

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Meta Title
                </label>
                <input
                  name="metaTitle"
                  placeholder="SEO-friendly title (50-60 characters)"
                  value={formData.metaTitle}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all bg-white"
                  maxLength="60"
                />
                <p className="text-xs text-slate-500 mt-1">{formData.metaTitle.length}/60 characters</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Meta Description
                </label>
                <textarea
                  name="metaDescription"
                  placeholder="Brief description for search results (150-160 characters)"
                  value={formData.metaDescription}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all bg-white resize-none"
                  rows="3"
                  maxLength="160"
                />
                <p className="text-xs text-slate-500 mt-1">{formData.metaDescription.length}/160 characters</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  SEO Keywords
                </label>
                <input
                  name="seoKeywords"
                  placeholder="Keywords separated by commas (e.g., web development, react tutorial)"
                  onChange={handleKeywords}
                  value={formData.seoKeywords.join(', ')}
                  className="w-full px-4 py-3 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all bg-white"
                />
                <p className="text-xs text-slate-500 mt-1">Add 3-5 relevant keywords for better SEO</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between gap-4 bg-white rounded-2xl shadow-lg p-6 border border-slate-200">
            <button
              type="button"
              onClick={() => router.push('/blogs')}
              className="px-6 py-3 border-2 border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-all font-medium"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting || !slugValidation.isUnique}
              className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-lg hover:from-indigo-700 hover:to-blue-700 transition-all font-medium shadow-lg hover:shadow-xl flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Saving...
                </>
              ) : (
                <>
                  <Save size={20} />
                  {isEdit ? 'Update Blog Post' : 'Publish Blog Post'}
                </>
              )}
            </button>
          </div>

          {errors.submit && (
            <div className="bg-red-50 border-2 border-red-200 text-red-700 px-6 py-4 rounded-lg flex items-center gap-3">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              {errors.submit}
            </div>
          )}
        </form>
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
  .prose-editor .ql-container {
    font-size: 16px;
    min-height: 400px;
    border-bottom-left-radius: 0.5rem;
    border-bottom-right-radius: 0.5rem;
  }
  .prose-editor .ql-toolbar {
    border-top-left-radius: 0.5rem;
    border-top-right-radius: 0.5rem;
    background: #f8fafc;
  }
  .prose-editor .ql-editor {
    min-height: 400px;
  }
`}} />
    </div>
  );
}