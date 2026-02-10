'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Plus, Search, Filter, Eye, Edit, Trash2, Globe, FileText, Clock, TrendingUp, Star, Archive, Link as LinkIcon } from 'lucide-react';

export default function BlogList() {
  const [blogs, setBlogs] = useState([]);
  const [filter, setFilter] = useState('');
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchBlogs();
  }, [filter, search]);

  const fetchBlogs = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get(`http://192.168.1.180:5000/api/blogs?status=${filter}&search=${search}`);
      setBlogs(res.data);
    } catch (error) {
      console.error('Error fetching blogs:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTogglePublish = async (id, currentStatus) => {
    try {
      await axios.patch(`http://192.168.1.180:5000/api/blogs/${id}/toggle-publish`);
      fetchBlogs();
    } catch (error) {
      console.error('Error toggling publish status:', error);
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this blog post? This action cannot be undone.')) {
      try {
        await axios.delete(`http://192.168.1.180:5000/api/blogs/${id}`);
        fetchBlogs();
      } catch (error) {
        console.error('Error deleting blog:', error);
      }
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      Published: 'bg-green-100 text-green-800 border-green-200',
      Draft: 'bg-amber-100 text-amber-800 border-amber-200',
      Archived: 'bg-gray-100 text-gray-800 border-gray-200'
    };
    return styles[status] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getStatusIcon = (status) => {
    const icons = {
      Published: <Globe size={14} />,
      Draft: <FileText size={14} />,
      Archived: <Archive size={14} />
    };
    return icons[status] || null;
  };

  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header Section */}
      <div className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold text-slate-800 flex items-center gap-3">
                <FileText className="text-indigo-600" size={40} />
                Blog Dashboard
              </h1>
              <p className="text-slate-600 mt-2">Manage and monitor all your blog posts</p>
            </div>
            <Link
              href="/blogs/create"
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-lg hover:from-indigo-700 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl font-medium"
            >
              <Plus size={20} />
              Create New Post
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6 border border-slate-200 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Total Posts</p>
                <p className="text-3xl font-bold text-slate-800 mt-2">{blogs.length}</p>
              </div>
              <div className="bg-indigo-100 p-4 rounded-full">
                <FileText className="text-indigo-600" size={28} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border border-slate-200 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Published</p>
                <p className="text-3xl font-bold text-green-600 mt-2">
                  {blogs.filter(b => b.status === 'Published').length}
                </p>
              </div>
              <div className="bg-green-100 p-4 rounded-full">
                <Globe className="text-green-600" size={28} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border border-slate-200 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Drafts</p>
                <p className="text-3xl font-bold text-amber-600 mt-2">
                  {blogs.filter(b => b.status === 'Draft').length}
                </p>
              </div>
              <div className="bg-amber-100 p-4 rounded-full">
                <Edit className="text-amber-600" size={28} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border border-slate-200 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Total Views</p>
                <p className="text-3xl font-bold text-blue-600 mt-2">
                  {blogs.reduce((sum, b) => sum + (b.viewsCount || 0), 0)}
                </p>
              </div>
              <div className="bg-blue-100 p-4 rounded-full">
                <TrendingUp className="text-blue-600" size={28} />
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8 border border-slate-200">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search Bar */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
              <input
                placeholder="Search by title or author..."
                onChange={(e) => setSearch(e.target.value)}
                value={search}
                className="w-full pl-11 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              />
            </div>

            {/* Filter Dropdown */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 pointer-events-none" size={20} />
              <select
                onChange={(e) => setFilter(e.target.value)}
                value={filter}
                className="pl-11 pr-8 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all appearance-none bg-white cursor-pointer min-w-[200px]"
              >
                <option value="">All Posts</option>
                <option value="Draft">Drafts Only</option>
                <option value="Published">Published Only</option>
                <option value="Archived">Archived Only</option>
              </select>
            </div>
          </div>
        </div>

        {/* Blog Table/Cards */}
        {isLoading ? (
          <div className="bg-white rounded-xl shadow-md p-12 text-center border border-slate-200">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-indigo-600 border-t-transparent"></div>
            <p className="text-slate-600 mt-4">Loading blogs...</p>
          </div>
        ) : blogs.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-12 text-center border border-slate-200">
            <FileText className="mx-auto text-slate-300 mb-4" size={64} />
            <h3 className="text-xl font-semibold text-slate-700 mb-2">No blogs found</h3>
            <p className="text-slate-500 mb-6">
              {search || filter ? 'Try adjusting your search or filters' : 'Get started by creating your first blog post'}
            </p>
            <Link
              href="/blogs/create"
              className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <Plus size={20} />
              Create Your First Post
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden">
            {/* Desktop Table View */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-slate-50 to-slate-100 border-b-2 border-slate-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                      Post Details
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                      Slug
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                      Author
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                      Stats
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                      Dates
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-slate-700 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {blogs.map((blog) => (
                    <tr key={blog._id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {blog.isFeatured && (
                            <Star size={16} className="text-amber-500 flex-shrink-0" fill="currentColor" />
                          )}
                          <div>
                            <p className="font-semibold text-slate-800 hover:text-indigo-600 transition-colors">
                              {blog.title}
                            </p>
                            {blog.category && (
                              <p className="text-sm text-slate-500 mt-1">{blog.category}</p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-sm text-slate-600 font-mono">
                          <LinkIcon size={14} className="text-slate-400" />
                          {blog.slug || 'N/A'}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-slate-700">{blog.authorName}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${getStatusBadge(blog.status)}`}>
                          {getStatusIcon(blog.status)}
                          {blog.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1 text-sm">
                          <div className="flex items-center gap-2 text-slate-700">
                            <Eye size={14} className="text-slate-400" />
                            {blog.viewsCount || 0} views
                          </div>
                          <div className="flex items-center gap-2 text-slate-700">
                            <Clock size={14} className="text-slate-400" />
                            {blog.readTime || 0} min read
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1 text-xs text-slate-600">
                          <div>
                            <span className="font-medium">Created:</span> {formatDate(blog.createdAt)}
                          </div>
                          {blog.updatedAt && blog.updatedAt !== blog.createdAt && (
                            <div>
                              <span className="font-medium">Updated:</span> {formatDate(blog.updatedAt)}
                            </div>
                          )}
                          {blog.publishedDate && blog.status === 'Published' && (
                            <div className="text-green-700">
                              <span className="font-medium">Published:</span> {formatDate(blog.publishedDate)}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/blogs/preview/${blog._id}`}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                            title="Preview"
                          >
                            <Eye size={18} />
                          </Link>
                          <Link
                            href={`/blogs/${blog._id}`}
                            className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                            title="Edit"
                          >
                            <Edit size={18} />
                          </Link>
                          <button
                            onClick={() => handleTogglePublish(blog._id, blog.status)}
                            className={`p-2 rounded-lg transition-all ${blog.status === 'Published'
                                ? 'text-amber-600 hover:bg-amber-50'
                                : 'text-green-600 hover:bg-green-50'
                              }`}
                            title={blog.status === 'Published' ? 'Unpublish' : 'Publish'}
                          >
                            <Globe size={18} />
                          </button>
                          <button
                            onClick={() => handleDelete(blog._id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all"
                            title="Delete"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="lg:hidden divide-y divide-slate-200">
              {blogs.map(blog => (
                <div key={blog._id} className="p-6 hover:bg-slate-50 transition-colors">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        {blog.isFeatured && (
                          <Star size={16} className="text-amber-500" fill="currentColor" />
                        )}
                        <h3 className="font-semibold text-slate-800">{blog.title}</h3>
                      </div>
                      <p className="text-sm text-slate-600">By {blog.authorName}</p>
                      {blog.category && (
                        <p className="text-sm text-slate-500 mt-1">{blog.category}</p>
                      )}
                      <div className="flex items-center gap-2 mt-2 text-xs text-slate-500 font-mono">
                        <LinkIcon size={12} />
                        {blog.slug}
                      </div>
                    </div>
                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${getStatusBadge(blog.status)}`}>
                      {getStatusIcon(blog.status)}
                      {blog.status}
                    </span>
                  </div>

                  <div className="flex items-center gap-4 mb-3 text-sm text-slate-600">
                    <div className="flex items-center gap-1">
                      <Eye size={16} className="text-slate-400" />
                      {blog.viewsCount || 0}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock size={16} className="text-slate-400" />
                      {blog.readTime || 0} min
                    </div>
                  </div>

                  <div className="text-xs text-slate-500 mb-4 space-y-1">
                    <div>Created: {formatDate(blog.createdAt)}</div>
                    {blog.updatedAt && blog.updatedAt !== blog.createdAt && (
                      <div>Updated: {formatDate(blog.updatedAt)}</div>
                    )}
                    {blog.publishedDate && blog.status === 'Published' && (
                      <div className="text-green-700">Published: {formatDate(blog.publishedDate)}</div>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <Link
                      href={`/blogs/preview/${blog._id}`}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium"
                    >
                      <Eye size={16} />
                      Preview
                    </Link>
                    <Link
                      href={`/blogs/${blog._id}`}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 rounded-lg hover:bg-indigo-100 transition-colors text-sm font-medium"
                    >
                      <Edit size={16} />
                      Edit
                    </Link>
                    <button
                      onClick={() => handleTogglePublish(blog._id, blog.status)}
                      className={`px-4 py-2 rounded-lg transition-colors text-sm font-medium ${blog.status === 'Published'
                          ? 'bg-amber-50 text-amber-700 hover:bg-amber-100'
                          : 'bg-green-50 text-green-700 hover:bg-green-100'
                        }`}
                    >
                      <Globe size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(blog._id)}
                      className="px-4 py-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}