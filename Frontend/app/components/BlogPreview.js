'use client';
import { useEffect, useRef } from 'react';
import Image from 'next/image';
import SeoScore from './SeoScore';
import axios from 'axios';
import { Calendar, User, Eye, Clock, Tag, ArrowLeft, Share2, Bookmark, Link as LinkIcon, Edit2 } from 'lucide-react';
import Link from 'next/link';

export default function BlogPreview({ blog }) {

  const hasIncremented = useRef(false);

  // Increment view count when component mounts
useEffect(() => {
  if (!blog?._id) return;
  if (hasIncremented.current) return;

  hasIncremented.current = true;
  incrementViewCount(blog._id);
}, [blog?._id]);


  const incrementViewCount = async (blogId) => {
    try {
      await axios.patch(`http://192.168.1.180:5000/api/blogs/${blogId}/increment-view`);
    } catch (error) {
      console.error('Error incrementing view count:', error);
    }
  };

  if (!blog) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-lg p-12 text-center border border-slate-200 max-w-md">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Blog Not Found</h2>
          <p className="text-slate-600 mb-6">The blog post you're looking for doesn't exist or has been removed.</p>
          <Link 
            href="/blogs"
            className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <ArrowLeft size={20} />
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const formatDate = (date) => {
    if (!date) return 'Date not available';
    return new Date(date).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const getStatusBadge = (status) => {
    const styles = {
      Published: 'bg-green-100 text-green-800 border-green-300',
      Draft: 'bg-amber-100 text-amber-800 border-amber-300',
      Archived: 'bg-gray-100 text-gray-800 border-gray-300'
    };
    return styles[status] || 'bg-gray-100 text-gray-800 border-gray-300';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header Navigation */}
      <div className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link 
              href="/blogs"
              className="flex items-center gap-2 text-slate-600 hover:text-indigo-600 transition-colors font-medium"
            >
              <ArrowLeft size={20} />
              Back to Dashboard
            </Link>
            <div className="flex items-center gap-3">
              <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusBadge(blog.status)}`}>
                {blog.status}
              </span>
              
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Article Header */}
        <article className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200">
          {/* Category Badge */}
          {blog.category && (
            <div className="px-8 pt-8">
              <span className="inline-block px-4 py-2 bg-indigo-100 text-indigo-700 rounded-full text-sm font-semibold">
                {blog.category}
              </span>
            </div>
          )}

          {/* Title */}
          <div className="px-8 pt-6">
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 leading-tight mb-4">
              {blog.title}
            </h1>

            {/* Slug Display */}
            {blog.slug && (
              <div className="flex items-center gap-2 text-sm text-slate-500 mb-6 font-mono">
                <LinkIcon size={16} />
                <span>yoursite.com/blog/<span className="text-indigo-600">{blog.slug}</span></span>
              </div>
            )}

            {/* Meta Information */}
            <div className="flex flex-wrap items-center gap-6 text-slate-600 pb-6 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                  {blog.authorName ? blog.authorName.charAt(0).toUpperCase() : 'A'}
                </div>
                <div>
                  <p className="font-semibold text-slate-800">{blog.authorName || 'Anonymous'}</p>
                  {blog.authorId && (
                    <p className="text-xs text-slate-500">ID: {blog.authorId}</p>
                  )}
                </div>
              </div>

              {blog.createdAt && (
                <div className="flex items-center gap-2">
                  <Calendar size={18} className="text-slate-400" />
                  <span className="text-sm">{formatDate(blog.createdAt)}</span>
                </div>
              )}

              {blog.readTime && (
                <div className="flex items-center gap-2">
                  <Clock size={18} className="text-slate-400" />
                  <span className="text-sm">{blog.readTime} min read</span>
                </div>
              )}

              <div className="flex items-center gap-2">
                <Eye size={18} className="text-slate-400" />
                <span className="text-sm">{blog.viewsCount || 0} views</span>
              </div>

              {blog.isFeatured && (
                <div className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-xs font-semibold flex items-center gap-1">
                  ⭐ Featured
                </div>
              )}
            </div>
          </div>

          {/* Timestamps Section */}
          <div className="px-8 py-4 bg-slate-50 border-b border-slate-200">
            <div className="flex flex-wrap gap-6 text-xs text-slate-600">
              <div>
                <span className="font-semibold">Created:</span> {formatDate(blog.createdAt)}
              </div>
              {blog.updatedAt && blog.updatedAt !== blog.createdAt && (
                <div>
                  <span className="font-semibold">Last Updated:</span> {formatDate(blog.updatedAt)}
                </div>
              )}
              {blog.publishedDate && blog.status === 'Published' && (
                <div className="text-green-700 font-medium">
                  <span className="font-semibold">Published:</span> {formatDate(blog.publishedDate)}
                </div>
              )}
            </div>
          </div>

          {/* Featured Image */}
          {blog.featuredImage && (
            <div className="px-8 py-8">
              <div className="relative w-full h-[400px] md:h-[500px] rounded-xl overflow-hidden shadow-lg">
                <img
                  src={`http://192.168.1.180:5000${blog.featuredImage}`} 
                  alt={blog.title || "Featured image"}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          )}

          {/* Blog Content */}
          <div className="px-8 md:px-16 py-8">
            <div 
              className="prose prose-lg prose-slate max-w-none
                prose-headings:font-bold prose-headings:text-slate-900
                prose-h1:text-3xl prose-h1:mt-8 prose-h1:mb-4
                prose-h2:text-2xl prose-h2:mt-6 prose-h2:mb-3
                prose-h3:text-xl prose-h3:mt-4 prose-h3:mb-2
                prose-p:text-slate-700 prose-p:leading-relaxed prose-p:mb-4
                prose-a:text-indigo-600 prose-a:no-underline hover:prose-a:underline
                prose-strong:text-slate-900 prose-strong:font-semibold
                prose-ul:my-4 prose-ul:list-disc prose-ul:pl-6
                prose-ol:my-4 prose-ol:list-decimal prose-ol:pl-6
                prose-li:text-slate-700 prose-li:my-2
                prose-blockquote:border-l-4 prose-blockquote:border-indigo-500 prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-slate-600
                prose-code:bg-slate-100 prose-code:text-indigo-600 prose-code:px-1 prose-code:py-0.5 prose-code:rounded
                prose-pre:bg-slate-900 prose-pre:text-slate-100
                prose-img:rounded-lg prose-img:shadow-md"
              dangerouslySetInnerHTML={{ __html: blog.content }} 
            />
          </div>

          {/* Tags Section */}
          {blog.tags && blog.tags.length > 0 && (
            <div className="px-8 md:px-16 py-6 border-t border-slate-200">
              <div className="flex items-center gap-3 flex-wrap">
                <Tag size={20} className="text-slate-400" />
                {blog.tags.map((tag, index) => (
                  <span 
                    key={index} 
                    className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-sm hover:bg-slate-200 transition-colors cursor-pointer"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* SEO Score Section */}
          <div className="px-8 md:px-16 py-8 bg-gradient-to-br from-slate-50 to-slate-100">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">SEO Performance</h3>
            <SeoScore blog={blog} />
          </div>
        </article>

        {/* Meta Information Card */}
        {(blog.metaTitle || blog.metaDescription || (blog.seoKeywords && blog.seoKeywords.length > 0)) && (
          <div className="mt-8 bg-white rounded-2xl shadow-xl p-8 border border-slate-200">
            <h3 className="text-xl font-semibold text-slate-800 mb-4">SEO Meta Information</h3>
            <div className="space-y-4">
              {blog.metaTitle && (
                <div>
                  <label className="text-sm font-medium text-slate-600 block mb-2">Meta Title</label>
                  <p className="text-slate-800 bg-slate-50 px-4 py-3 rounded-lg border border-slate-200">
                    {blog.metaTitle}
                  </p>
                </div>
              )}
              {blog.metaDescription && (
                <div>
                  <label className="text-sm font-medium text-slate-600 block mb-2">Meta Description</label>
                  <p className="text-slate-800 bg-slate-50 px-4 py-3 rounded-lg border border-slate-200">
                    {blog.metaDescription}
                  </p>
                </div>
              )}
              {blog.seoKeywords && blog.seoKeywords.length > 0 && (
                <div>
                  <label className="text-sm font-medium text-slate-600 block mb-2">SEO Keywords</label>
                  <div className="flex flex-wrap gap-2">
                    {blog.seoKeywords.map((keyword, index) => (
                      <span 
                        key={index}
                        className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium border border-green-200"
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}