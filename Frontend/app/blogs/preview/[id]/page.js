import { API_BASE_URL } from '@/app/api/constant';
import BlogPreview from '../../../components/BlogPreview';

export default async function PreviewBlog({ params }) {
  // Await params in Next.js 15+
  const { id } = await params;
  
  const res = await fetch(`${API_BASE_URL}/api/blogs/${id}`);
  
  if (!res.ok) {
    throw new Error('Failed to fetch blog');
  }
  
  const blog = await res.json();
  
  console.log('====================================');
  console.log('Fetched blog:', blog);
  console.log('Blog ID:', blog._id);
  console.log('====================================');
  
  return <BlogPreview blog={blog} />;
}