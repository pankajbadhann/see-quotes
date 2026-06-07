const postService = require("../services/postService");

exports.ownershipGuard = async (req, res, next) => {
  try {
    const userId = req.session?.user?.id;
    const postId = req.params.id;

    if (!userId) {
      return res.redirect("/login");
    }

    const post = await postService.getPostById(postId);

    if (!post) {
      return res.status(404).render("error", {
        message: "Post not found",
      });
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