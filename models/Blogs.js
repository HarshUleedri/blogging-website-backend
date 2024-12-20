const mongoose = require("mongoose");

const blogSchema = mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  author: { type: String, required: true },
  slug: { type: String, unique: true },
  createdAt: { type: Date, default: Date.now },
});

const generateSlug = async (title) => {
  let slug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

  let existingBlog = await Blog.findOne({ slug });
  let counter = 1;
  while (existingBlog) {
    slug = `${slug}-${counter}`;
    existingBlog = await Blog.findOne({ slug });
    counter++;
  }

  return slug;
};

blogSchema.pre("save", async function (next) {
  if (!this.isModified("title")) return next();
  this.slug = await generateSlug(this.title);
  next();
});

const Blog = mongoose.model("Blog", blogSchema);

module.exports = Blog;
