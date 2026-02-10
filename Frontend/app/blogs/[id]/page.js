import { API_BASE_URL } from '@/app/api/constant';
import BlogForm from '../../components/BlogForm';

export default async function EditBlog({ params }) {

    const { id } = await params;

  const res = await fetch(`${API_BASE_URL}/api/blogs/${id}`);
  const blog = await res.json();
  return <BlogForm initialData={blog} isEdit={true} />;
}