const Post = require("../models/Post");

/**
 * Get all posts (latest first)
 */
exports.getAllPosts = async () => {
  return await Post.find({}, "content author createdAt")
    .populate("author", "username")
    .sort({ createdAt: -1 })
    .lean();
};

/**
 * Get single post by ID
 */
exports.getPostById = async (id) => {
  if (!id) throw new Error("Post ID is required");

  return await Post.findById(id, "content author createdAt")
    .populate("author", "username")
    .lean();
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
exports.updatePost = async ({ id, content, userId }) => {
  if (!id || !content || !userId) {
    throw new Error("Invalid update data");
  }

  const post = await Post.findOneAndUpdate(
    { _id: id, author: userId },
    { content: content.trim() },
    { new: true, runValidators: true }
  );

  return post;
};

/**
 * Delete post
 */
exports.deletePost = async (id, userId) => {
  if (!id || !userId) throw new Error("Post ID required");

  return await Post.findOneAndDelete({
    _id: id,
    author: userId,
  });
};

/**
 * Check ownership (business logic moved from middleware)
 */
exports.isOwner = async (postId, userId) => {
  const post = await Post.findById(postId).select("author");

  if (!post) return false;

  return post.author.toString() === userId;
};