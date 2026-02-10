# 📝 Blog Management Dashboard

A full-featured Blog Management Dashboard built as a full-stack application. Create, manage, and publish blog posts with advanced SEO-focused features, real-time slug validation, and a modern, responsive interface.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?logo=mongodb&logoColor=white)

## ✨ Features

### 📋 Comprehensive Blog Post Management

Each blog post includes:

- **Title** - Main post heading
- **Slug** - Auto-generated from title with real-time uniqueness validation
- **Author Information** - Name and ID tracking
- **Category** - Post categorization
- **Tags** - Multi-select, comma-separated input
- **Featured Image** - Upload support with preview
- **Meta Title & Description** - SEO optimization
- **Rich Text Content** - Full-featured editor with formatting tools
- **Status Management** - Draft / Published / Archived
- **Read Time** - Auto-calculated based on content (200 words/min)
- **Publication Date** - Automatically set when published
- **SEO Keywords** - Comma-separated for search optimization
- **View Counter** - Tracks post engagement
- **Featured Flag** - Highlight important posts
- **Timestamps** - Created and Updated tracking

### 🎯 Dashboard Features

- **Advanced Filtering** - Filter by status (Draft/Published/Archived/All)
- **Smart Search** - Search by title or author name
- **Quick Actions** - Inline publish/unpublish toggle
- **Safe Deletion** - Confirmation dialog for post removal
- **Analytics Overview** - Total posts, published count, drafts, and total views
- **Responsive Design** - Optimized table/card view for desktop and mobile

### 🚀 Advanced Features

- **Real-time Slug Validation** - Instant uniqueness check with visual feedback
- **Blog Preview Mode** - Full preview before publishing with SEO meta display
- **View Count Simulation** - Automatic increment on preview/view
- **SEO Score Indicator** - Real-time scoring based on meta fields, keywords, and content
- **Auto-slug Generation** - Created from title, fully editable
- **Word Count Display** - Live tracking in editor
- **Character Limits** - Enforced for meta descriptions and titles
- **Image Management** - Upload, preview, and remove functionality
- **Modern UI/UX** - Gradients, shadows, smooth animations
- **Error Handling** - Comprehensive validation and user feedback

## 🛠️ Tech Stack

### Frontend
- **Next.js** - React framework for production
- **React** - UI library
- **React Quill** - Rich text editor
- **Lucide React** - Modern icon library
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client for API requests

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **Mongoose** - MongoDB object modeling
- **Multer** - File upload middleware
- **Slugify** - URL-friendly slug generation

### Database
- **MongoDB** - NoSQL database

## 📦 Installation

### Prerequisites

- Node.js (v18+ recommended)
- MongoDB (local instance or MongoDB Atlas)
- Git

### Setup Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/shrutiejanjale/DMS_Blog_Task.git
   cd blog-management-dashboard
   ```

2. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

4. **Configure environment variables**
   
   Create a `.env` file in the backend root
   
   For MongoDB Atlas, use your connection string:
   ```env
   MONGODB_URI=mongodb+srv://shrutijanjale6_db_user:abcabc@cluster0.nkslmmm.mongodb.net/?appName=Cluster0
   PORT=5000
   ```

5. **Start the backend server**
   ```bash
   cd backend
   npm start
   ```
   Backend will run on `http://localhost:5000`

6. **Start the frontend development server**
   ```bash
   cd frontend
   npm run dev
   ```
   Frontend will run on `http://localhost:3000`

7. **Access the application**
   
   Open your browser and navigate to:
   ```
   http://localhost:3000/blogs
   ```

### Database Setup

- Ensure MongoDB is running locally or have a valid MongoDB Atlas connection
- The application will automatically create the required collections via Mongoose schemas
- No manual database setup required

## 🎮 Usage

### Creating a New Post
1. Navigate to `/blogs/create`
2. Fill in the post details
3. Add rich text content using the editor
4. Upload a featured image (optional)
5. Add SEO metadata
6. Save as draft or publish immediately

### Managing Posts
1. View all posts at `/blogs`
2. Use filters to find specific posts
3. Click on a post to edit
4. Use inline toggle to publish/unpublish
5. Preview posts before publishing at `/blogs/preview/:id`

### SEO Optimization
- Fill in meta title and description
- Add relevant keywords
- Monitor the SEO score indicator
- Ensure content meets recommended length

## 📸 Screenshots

<img width="877" height="894" alt="image" src="https://github.com/user-attachments/assets/fd7c821a-3c91-4944-ae81-dfdf77f5799a" />
<img width="1307" height="660" alt="Screenshot 2026-02-10 170010" src="https://github.com/user-attachments/assets/94bd295e-9345-4a97-a70b-960a67cdb681" />
<img width="877" height="894" alt="Screenshot 2026-02-10 170020" src="https://github.com/user-attachments/assets/7a694a6b-0614-42ba-87db-e10cff686b8c" />
<img width="1901" height="892" alt="Screenshot 2026-02-10 165832" src="https://github.com/user-attachments/assets/615fd0e6-8aca-4e48-a494-286acc7b9223" />

## ⚙️ Configuration Notes

### API URL Configuration
If running backend on a different port or IP:
- Update API base URL in frontend code
- Replace `http://192.168.1.180:5000` with your backend URL
- For production, use environment variables

### File Uploads
- Images are stored in `/uploads` directory by default
- For production, consider using cloud storage (AWS S3, Cloudinary, etc.)

## 🔧 Assumptions & Design Decisions

### Assumptions
- User authentication is handled externally (admin access assumed)
- Categories and tags are free-text input (no predefined lists)
- SEO score uses basic calculation (can be extended with advanced metrics)
- View count increments on preview (simulation for demo purposes)

### Trade-offs
- **Client-side rendering** for forms (could optimize with SSR if needed)
- **Real-time slug validation** debounced to reduce API calls
- **No pagination** on listing page (suitable for moderate post counts)
- **Local file storage** for images (use cloud storage for production)
- **Basic error handling** with alerts (could integrate toast notifications)

## 🚀 Future Enhancements

- [ ] User authentication and role-based access
- [ ] Pagination for blog listing
- [ ] Advanced analytics dashboard
- [ ] Comment management system
- [ ] Social media integration
- [ ] Cloud storage for images (S3/Cloudinary)
- [ ] Email notifications
- [ ] Scheduled publishing
- [ ] Version history for posts
- [ ] Multi-language support

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 🙏 Acknowledgments

- React Quill for the rich text editor
- Lucide React for beautiful icons
- Tailwind CSS for rapid UI development
- MongoDB for flexible data storage

---

**Note:** Remember to update the repository URL, author information, and add actual screenshots before publishing to GitHub.
