import mongoose from 'mongoose';
import slugify from 'slugify';

const blogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, unique: true},
  authorName: { type: String, required: true },
  authorId: { type: String, required: true },
  category: { type: String, required: true },
  tags: [{ type: String }],
  featuredImage: { type: String },
  metaTitle: { type: String },
  metaDescription: { type: String },
  content: { type: String, required: true },
  status: { type: String, enum: ['Draft', 'Published', 'Archived'], default: 'Draft' },
  readTime: { type: Number },
  publishedDate: { type: Date },
  seoKeywords: [{ type: String }],
  viewsCount: { type: Number, default: 0 },
  isFeatured: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Pre-save hook for slug, readTime, etc.
blogSchema.pre('save', function() {
  this.slug = slugify(this.title, { lower: true, strict: true });
  this.updatedAt = Date.now();

  // Calculate read time: assume 200 words/min
  const wordCount = this.content.split(/\s+/).length;
  this.readTime = Math.ceil(wordCount / 200);
});

export default mongoose.model('Blog', blogSchema);