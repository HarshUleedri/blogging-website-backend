const mongoose = require("mongoose");

const blogSchema = mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  author: { type: mongoose.Schema.ObjectId, ref: "User" },
  coverImage: { type: String, default: "" },
  slug: { type: String, unique: true },
  tags: [
    {
      tag: { type: String, lowercase: true, trim: true },
      color: { type: String, trim: true },
    },
  ],
  viewsLog: [
    {
      userId: { type: mongoose.Schema.ObjectId, ref: "User", default: null },
      viewedAt: { type: Date, default: Date.now },
      ip: { type: String, default: null },
    },
  ],
  views: { type: Number, default: 0 },
  reactions: {
    like: { type: Number, default: 0 },
    clap: { type: Number, default: 0 },
    explodingHead: { type: Number, default: 0 },
  },
  userReacted: [
    {
      userId: mongoose.Schema.ObjectId,
      reactionType: String,
      reactedAt: { type: Date, default: Date.now },
    },
  ],
  published: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

const generateSlug = async (title) => {
  let baseSlug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

  let slug = baseSlug;

  let existingBlog = await Blog.findOne({ slug });
  let counter = 1;
  while (existingBlog) {
    slug = `${baseSlug}-${counter}`;
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

blogSchema.index({
  title: "text",
  tags: "text",
});
blogSchema.index({ published: 1 });

const Blog = mongoose.model("Blog", blogSchema);

module.exports = Blog;
