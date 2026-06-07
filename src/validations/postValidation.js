exports.validatePost = (req, res, next) => {
  const { content } = req.body;

  if (!content || !content.trim()) {
    const error = new Error("Post content is required");
    error.statusCode = 400;
    return next(error);
  }

  if (content.trim().length < 3) {
    const error = new Error(
      "Post must contain at least 3 characters"
    );
    error.statusCode = 400;
    return next(error);
  }

  if (content.trim().length > 500) {
    const error = new Error(
      "Post cannot exceed 500 characters"
    );
    error.statusCode = 400;
    return next(error);
  }

  next();
};