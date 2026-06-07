const postService = require("../services/postService");

/**
 * Ensures logged-in user owns the post
 */
exports.ownershipGuard = async (req, res, next) => {
  try {
    const userId = req.session?.user?.id;
    const postId = req.params.id;

    if (!userId) {
      return res.redirect("/login");
    }

    const isOwner = await postService.isOwner(postId, userId);

    if (!isOwner) {
      return res.status(403).render("error", {
        message: "You are not allowed to perform this action",
      });
    }

    next();
  } catch (err) {
    console.error("Ownership check failed:", err);
    return res.status(500).render("error", {
      message: "Authorization error",
    });
  }
};