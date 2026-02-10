import BlogPreview from '../../../components/BlogPreview';

export default async function PreviewBlog({ params }) {
  // Await params in Next.js 15+
  const { id } = await params;
  
  const res = await fetch(`http://192.168.1.180:5000/api/blogs/${id}`);
  
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