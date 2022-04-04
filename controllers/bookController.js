const userModel = require("../models/userModel.js");
const validation = require("../middleware/validation");
const bookModel = require("../models/bookModel");
const reviewModel = require("../models/reviewModel");

//Create books
const createBooks = async (req, res) => {
  try {
       const data = req.body;

    if (Object.keys(data).length == 0 || data == null) {
      return res
        .status(400)
        .send({ status: false, msg: "No input provided by user" });
    }

    const { title, excerpt, userId, ISBN, category, subcategory, releasedAt } =
      data;

    if (!validation.valid(title)) {
      return res
        .status(400)
        .send({ status: false, msg: "No title provided by user" });
    }

    const existTitle = await bookModel.findOne({ title: title });

    if (existTitle) {
      return res
        .status(400)
        .send({ status: false, msg: " Title already exist" });
    }

    if (!validation.valid(excerpt)) {
      return res
        .status(400)
        .send({ status: false, msg: "No excerpt provided by user" });
    }

    if (!validation.valid(userId)) {
      return res
        .status(400)
        .send({ status: false, msg: "No userId provided by user" });
    }

    if (!validation.isValidObjectId(userId)) {
      return res
        .status(400)
        .send({ status: false, msg: "Not  Valid Object Id" });
    }

    const user = await userModel.findById(userId);
    if (!user) {
      return res
        .status(404)
        .send({ Status: false, msg: "User with this id not found" });
    }

    if (!validation.valid(ISBN)) {
      return res
        .status(400)
        .send({ status: false, msg: " No ISBN provided by user" });
    }
    if (!validation.isValidIsbn(ISBN)) {
      return res
        .status(400)
        .send({ status: false, message: "Enter  valid 12 digit ISBN number " });
    }

    const existISBN = await bookModel.findOne({ ISBN: ISBN });
    if (existISBN) {
      return res
        .status(400)
        .send({ status: false, msg: " ISBN already exist" });
    }

    if (!validation.valid(category)) {
      return res
        .status(400)
        .send({ status: false, msg: "No category provided by user" });
    }

    if (!validation.valid(subcategory)) {
      return res
        .status(400)
        .send({ status: false, msg: "No subcategory provided by user" });
    }

    if (!validation.valid(releasedAt)) {
      return res
        .status(400)
        .send({
          Status: false,
          msg: "Please provide the realesdAt field and enter a date",
        });
    }

    if (!validation.isValidDateFormat(releasedAt)) {
      return res
        .status(400)
        .send({
          Status: false,
          msg: "Please enter the date in correct YYYY-MM-DD format",
        });
    }

    if (userId == req.decodedToken.userId) {
      const saveData = await bookModel.create(data);
      return res.status(201).send({ status: true, msg: saveData });
    } else {
      return res
        .status(403)
        .send({ Status: false, msg: "User is not authorized" });
    }
  } catch (err) {
    return res.status(500).send({ status: false, msg: err.message });
  }
};

//Get Books
const getBooks = async (req, res) => {
  try {
    const data = req.query;
    const filter = { isDeleted: false };
    const { userId, category, subcategory } = data;

    if (validation.valid(userId)) {
      if (!validation.isValidObjectId(userId)) {
        return res
          .status(400)
          .send({ Status: false, msg: "Please enter valid user id" });
      }

      filter["userId"] = userId;
    }

    if (validation.valid(category)) {
      filter["category"] = category.toLowerCase();
    }

    if (validation.valid(subcategory)) {
      filter["subcategory"] = subcategory.toLowerCase();
    }

    const findData = await bookModel
      .find(filter)
      .select({
        _id: 1,
        title: 1,
        excerpt: 1,
        userId: 1,
        category: 1,
        releasedAt: 1,
        reviews: 1,
      })
      .sort({ title: 1 });
    if (findData.length == 0) {
      return res
        .status(404)
        .send({
          Status: false,
          msg: "No books with the respected query were found",
        });
    }

    return res
      .status(200)
      .send({ Status: true, msg: "Book List", Data: findData });
  } catch (err) {
    return res.status(500).send({ status: false, msg: err.message });
  }
};

//Get Books By Id
const getById = async (req, res) => {
  try {
    const id = req.params.bookId;

    if (!validation.isValidObjectId(id)) {
      return res
        .status(400)
        .send({ status: false, msg: "Enter valid Book id" });
    }

    const findId = await bookModel.findById(id).lean();
    if (!findId) {
      return res
        .status(404)
        .send({ status: false, msg: "No book found with this Book id" });
    }

    if (findId.isDeleted == true) {
      return res
        .status(400)
        .send({ status: false, msg: "The book has been  deleted" });
    }

    let reviews = await reviewModel.find({ bookId: id, isDeleted: false });

    findId["reviewsData"] = reviews;

    return res
      .status(200)
      .send({ status: true, msg: "Data list", Data: findId });
  } catch (err) {
    return res.status(500).send({ status: false, msg: err.message });
  }
};

//Update Books
const updateBooks = async (req, res) => {
  try {
    const id = req.params.bookId;

    if (!validation.isValidObjectId(id)) {
      return res
        .status(400)
        .send({ Status: false, msg: "Please enter valid id" });
    }

    if (Object.keys(req.body).length == 0 || req.body == null) {
      return res
        .status(400)
        .send({ Status: false, msg: "Please provide input" });
    }

    const findId = await bookModel.findById(id);

    if (!findId) {
      return res
        .status(404)
        .send({ status: false, msg: "No book with the given id exists" });
    }
    if (findId.isDeleted == true) {
      return res
        .status(400)
        .send({ Status: false, msg: "The requested book has been deleted" });
    }

    if (findId.userId == req.decodedToken.userId) {
      const { title, excerpt, ISBN, releasedAt } = req.body;

      const filter = {};

      if (validation.valid(title)) {
        let duplliTitle = await bookModel.findOne({ title: title });
        if (duplliTitle) {
          return res
            .status(400)
            .send({
              Status: false,
              msg: "This title already exists. Please enter a different title",
            });
        }
        filter["title"] = title;
      }

      if (validation.valid(ISBN)) {
        if (!validation.isValidIsbn(ISBN)) {
          return res
            .status(400)
            .send({ Status: false, msg: "Please entr a valid ISBN" });
        }
        let dupliIsbn = await bookModel.findOne({ ISBN: ISBN });
        if (dupliIsbn) {
          return res
            .status(400)
            .send({
              Status: false,
              msg: "This ISBN already exists. Please enter a different ISBN",
            });
        }
        filter["ISBN"] = ISBN;
      }

      if (validation.valid(excerpt)) {
        filter["excerpt"] = excerpt;
      }

      if (validation.valid(releasedAt)) {
        if (!validation.isValidDateFormat(releasedAt)) {
          return res
            .status(400)
            .send({
              Status: false,
              msg: "Please enter the date in correct YYYY-MM-DD format",
            });
        }

        filter["releasedAt"] = releasedAt;
      }
      

      const updateData = await bookModel.findOneAndUpdate(
        { _id: id },
        {
          $set: filter,
        },
        { new: true }
      );

      return res.status(200).send({ status: true, msg: updateData });
    } else {
      return res
        .status(403)
        .send({
          Status: false,
          msg: "The user is not authorized to update the requested book",
        });
    }
  } catch (err) {
    return res.status(500).send({ status: false, msg: err.message });
  }
};

//delete by id
const deleteBooks = async (req, res) => {
  try {
    let id = req.params.bookId;
    if (!validation.isValidObjectId(id)) {
      return res
        .status(400)
        .send({ Status: false, msg: "Please enter a valid id" });
    }

    let book = await bookModel.findById(id);

    if (!book) {
      return res
        .status(404)
        .send({ Status: false, msg: "No book with this id found" });
    }
    if (book.isDeleted === true) {
      return res
        .status(400)
        .send({
          Status: false,
          msg: "The requeste book has alredy been deleteed",
        });
    }
    if (book.userId == req.decodedToken.userId) {
      let deletedBook = await bookModel.findOneAndUpdate(
        { _id: id },
        { isDeleted: true, deletedAt: Date.now() },
        { new: true }
      );
      return res.status(200).send({ Staus: true, msg: "Deleted" });
    } else {
      return res.status(403).send({ Status: false, msg: "Not Authorized" });
    }
  } catch (err) {
    return res.status(500).send({ Status: false, msg: err.message });
  }
};

module.exports = {
  createBooks,
  getBooks,
  getById,
  updateBooks,
  deleteBooks,
};
