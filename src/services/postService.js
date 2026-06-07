const Post = require("../models/Post");

/**
 * Get all posts (latest first)
 */
exports.getAllPosts = async () => {
  return await Post.find()
    .populate("author", "username email")
    .sort({ createdAt: -1 })
    .lean(); // performance boost
};

/**
 * Get single post by ID
 */
exports.getPostById = async (id) => {
  if (!id) throw new Error("Post ID is required");

  const post = await Post.findById(id)
    .populate("author", "username email")
    .lean();

  return post;
};

/**
 * Create post
 */
exports.createPost = async ({ content, userId }) => {
  if (!content || !userId) {
    throw new Error("Invalid post data");
  }

  const post = await Post.create({
    content: content.trim(),
    author: userId,
  });

  return post;
};

/**
 * Update post (with safety check)
 */
exports.updatePost = async ({ id, content }) => {
  if (!id || !content) {
    throw new Error("Invalid update data");
  }

  const updated = await Post.findByIdAndUpdate(
    id,
    { content: content.trim() },
    {
      new: true,
      runValidators: true,
    }
  );

  return updated;
};

/**
 * Delete post
 */
exports.deletePost = async (id) => {
  if (!id) throw new Error("Post ID is required");

  return await Post.findByIdAndDelete(id);
};

/**
 * Check ownership (business logic moved from middleware)
 */
exports.isOwner = async (postId, userId) => {
  const post = await Post.findById(postId).select("author");

  if (!post) return false;

  return post.author.toString() === userId;
};