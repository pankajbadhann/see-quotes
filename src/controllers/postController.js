const postService = require("../services/postService");

/**
 * GET /posts
 */
exports.index = async (req, res, next) => {
  try {
    const posts = await postService.getAllPosts();

    return res.render("posts/index", {
      posts,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /posts/new
 */
exports.newForm = (req, res) => {
  return res.render("posts/new");
};

/**
 * POST /posts
 */
exports.create = async (req, res, next) => {
  try {
    const { content } = req.body;
    const userId = req.session?.user?.id;

    if (!userId) {
      const error = new Error("Unauthorized");
      error.statusCode = 401;
      throw error;
    }

    await postService.createPost({
      content,
      userId,
    });

    return res.redirect("/posts");
  } catch (err) {
    next(err);
  }
};

/**
 * GET /posts/:id
 */
exports.show = async (req, res, next) => {
  try {
    const post = await postService.getPostById(req.params.id);

    if (!post) {
      const error = new Error("Post not found");
      error.statusCode = 404;
      throw error;
    }

    return res.render("posts/show", {
      post,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /posts/:id/edit
 */
exports.edit = async (req, res, next) => {
  try {
    const post = await postService.getPostById(req.params.id);

    if (!post) {
      const error = new Error("Post not found");
      error.statusCode = 404;
      throw error;
    }

    return res.render("posts/edit", {
      post,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * PATCH /posts/:id
 */
exports.update = async (req, res, next) => {
  try {
    const { content } = req.body;

    const updated = await postService.updatePost({
      id: req.params.id,
      content,
    });

    if (!updated) {
      const error = new Error("Post not found or update failed");
      error.statusCode = 404;
      throw error;
    }

    return res.redirect("/posts");
  } catch (err) {
    next(err);
  }
};

/**
 * DELETE /posts/:id
 */
exports.destroy = async (req, res, next) => {
  try {
    const deleted = await postService.deletePost(req.params.id);

    if (!deleted) {
      const error = new Error("Post not found");
      error.statusCode = 404;
      throw error;
    }

    return res.redirect("/posts");
  } catch (err) {
    next(err);
  }
};