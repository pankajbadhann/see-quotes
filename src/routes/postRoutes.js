const express = require("express");
const router = express.Router();

const postController = require("../controllers/postController");

const { authGuard } = require("../middleware/authGuard");
const { ownershipGuard } = require("../middleware/ownershipGuard");

const { validatePost } = require("../validations/postValidation");

// CREATE
router.get("/new", authGuard, postController.newForm);

// PUBLIC
router.get("/", postController.index);
router.get("/:id", postController.show);

router.post("/", authGuard, validatePost, postController.create);

// EDIT
router.get("/:id/edit", ownershipGuard, postController.edit);

// UPDATE
router.patch("/:id", ownershipGuard, validatePost, postController.update);

// DELETE
router.delete("/:id", ownershipGuard, postController.destroy);

module.exports = router;