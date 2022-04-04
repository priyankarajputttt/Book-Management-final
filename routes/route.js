const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");

const userController = require("../controllers/userController.js");
const bookController = require("../controllers/bookController");
const reviewController = require("../controllers/reviewController");
const awsController = require("../controllers/aws.js");

router.post("/register", userController.registerUser);
router.post("/login", userController.loginUser);

router.post("/books", auth.auth, bookController.createBooks);
router.get("/books", auth.auth,bookController.getBooks);
router.get("/books/:bookId", auth.auth,bookController.getById);
router.put("/books/:bookId", auth.auth, bookController.updateBooks);
router.delete("/books/:bookId", auth.auth,bookController.deleteBooks);

router.post("/books/:bookId/review", reviewController.createReview);
router.put("/books/:bookId/review/:reviewId", reviewController.updateReview);
router.delete("/books/:bookId/review/:reviewId", reviewController.deleteReview);



router.post("/write-file-aws",awsController.awsLinkCreator)
module.exports = router;
