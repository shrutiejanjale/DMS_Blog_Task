import express from 'express';
import multer from 'multer';
import Blog from '../models/Blog.js';
import slugify from 'slugify';
import path from 'path';
import { fileURLToPath } from 'url';

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Multer setup for image upload
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, path.join(__dirname, '../uploads')),
    filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

// Get all blogs (with filters/search)
router.get('/', async (req, res) => {
    try {
        const { status, search } = req.query;
        let query = {};
        if (status) query.status = status;
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { authorName: { $regex: search, $options: 'i' } }
            ];
        }
        const blogs = await Blog.find(query).sort({ createdAt: -1 });
        res.json(blogs);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Check slug uniqueness - NEW ENDPOINT
router.get('/check-slug/:slug', async (req, res) => {
    try {
        const { slug } = req.params;
        const { excludeId } = req.query;

        let query = { slug };
        if (excludeId) {
            query._id = { $ne: excludeId };
        }

        const existingBlog = await Blog.findOne(query);
        res.json({ isUnique: !existingBlog });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get single blog
router.get('/:id', async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);
        if (!blog) return res.status(404).json({ error: 'Blog not found' });
        res.json(blog);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Create blog
router.post('/', upload.single('featuredImage'), async (req, res) => {
    try {
        const data = req.body;
        if (req.file) data.featuredImage = `/uploads/${req.file.filename}`;

        // Parse arrays from comma-separated strings
        if (typeof data.tags === 'string') {
            data.tags = data.tags.split(',').map(t => t.trim()).filter(Boolean);
        }
        if (typeof data.seoKeywords === 'string') {
            data.seoKeywords = data.seoKeywords.split(',').map(k => k.trim()).filter(Boolean);
        }

        // Check slug uniqueness before saving
        const existingSlug = await Blog.findOne({ slug: data.slug });
        if (existingSlug) {
            return res.status(400).json({ error: 'Slug must be unique. This slug is already in use.' });
        }

        const blog = new Blog(data);
        await blog.save();
        res.json(blog);
    } catch (err) {
        if (err.code === 11000) {
            return res.status(400).json({ error: 'Slug must be unique' });
        }
        res.status(500).json({ error: err.message });
    }
});

// Update blog
router.put('/:id', upload.single('featuredImage'), async (req, res) => {
    try {
        const data = req.body;
        if (req.file) data.featuredImage = `/uploads/${req.file.filename}`;
        data.updatedAt = Date.now();

        // Parse arrays from comma-separated strings
        if (typeof data.tags === 'string') {
            data.tags = data.tags.split(',').map(t => t.trim()).filter(Boolean);
        }
        if (typeof data.seoKeywords === 'string') {
            data.seoKeywords = data.seoKeywords.split(',').map(k => k.trim()).filter(Boolean);
        }

        // Check slug uniqueness if slug changed
        if (data.slug) {
            const existingSlug = await Blog.findOne({
                slug: data.slug,
                _id: { $ne: req.params.id }
            });
            if (existingSlug) {
                return res.status(400).json({ error: 'Slug must be unique. This slug is already in use.' });
            }
        }

        const blog = await Blog.findByIdAndUpdate(req.params.id, data, { new: true });
        if (!blog) return res.status(404).json({ error: 'Blog not found' });

        res.json(blog);
    } catch (err) {
        if (err.code === 11000) {
            return res.status(400).json({ error: 'Slug must be unique' });
        }
        res.status(500).json({ error: err.message });
    }
});

// Delete blog
router.delete('/:id', async (req, res) => {
    try {
        const blog = await Blog.findByIdAndDelete(req.params.id);
        if (!blog) return res.status(404).json({ error: 'Blog not found' });
        res.json({ message: 'Blog deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Toggle publish/unpublish
router.patch('/:id/toggle-publish', async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);
        if (!blog) return res.status(404).json({ error: 'Blog not found' });

        // Toggle between Published and Draft
        blog.status = blog.status === 'Published' ? 'Draft' : 'Published';

        // Set publishedDate when publishing
        if (blog.status === 'Published' && !blog.publishedDate) {
            blog.publishedDate = new Date();
        }

        blog.updatedAt = new Date();
        await blog.save();
        res.json(blog);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Increment view count (simulation)
router.patch('/:id/increment-view', async (req, res) => {
    try {
        const blog = await Blog.findByIdAndUpdate(
            req.params.id,
            {
                $inc: { viewsCount: 1 },
                updatedAt: new Date()
            },
            { new: true }
        );
        if (!blog) return res.status(404).json({ error: 'Blog not found' });
        res.json(blog);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;