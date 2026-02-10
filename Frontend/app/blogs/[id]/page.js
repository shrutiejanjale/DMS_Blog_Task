import BlogForm from '../../components/BlogForm';

export default async function EditBlog({ params }) {

    const { id } = await params;

  const res = await fetch(`http://192.168.1.180:5000/api/blogs/${id}`);
  const blog = await res.json();
  return <BlogForm initialData={blog} isEdit={true} />;
}