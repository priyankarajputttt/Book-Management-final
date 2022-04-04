
const validation = require("../middleware/validation");
const bookModel = require("../models/bookModel");
const reviewModel = require("../models/reviewModel");

const createReview = async (req, res) => {
  try {
    
    const data = req.body
    let bookId = req.params.bookId
    if (Object.keys(data).length == 0 || data == null) {
       return res.status(400).send({ Status: false, msg: "Please provide the request body" }) }

    if (!validation.isValidObjectId(bookId)) {
       return res.status(400).send({ Status: false, msg: "Please provide a valid book id" }) }
    
       let book = await bookModel.findById(bookId)
    if (!book) { 
      return res.status(404).send({ Status: false, msg: "No book with the given book id was found" }) }
    if (book.isDeleted === true) {
       return res.status(400).send({ Status: false, msg: "The requested book has been deleted" }) }

  
       const { reviewedBy, rating, review } = data
    let reviewData = { reviewedAt: Date.now(), bookId: bookId }

   
    if (validation.valid(reviewedBy)) {
      reviewData['reviewedBy'] = reviewedBy
    }

    if (validation.valid(review)) {
      reviewData['review'] = review
    }

   if (!validation.isValidRating(rating)) {
      return res.status(400).send({ Status: false, msg: "Please enter a rating from 1 to 5" })
    }
  
    reviewData['rating'] = rating

    let createdReview = await reviewModel.create(reviewData)
    
    let reviewCount = await bookModel.findOneAndUpdate({ _id: bookId }, { $inc: { reviews: 1 } },{new:true}).lean()
   
    let totalReviews = await reviewModel.find({bookId:bookId,isDeleted:false})
    
    reviewCount['reviewsData']=totalReviews


    return res.status(201).send({ Staus: true, msg: "Successfuly created review", Data: reviewCount })




  } 
  catch (err) { return res.status(500).send({ status: false, msg: err.message }); }
};


const updateReview = async (req, res) => {
  try {
    const bookId = req.params.bookId;

    if (!validation.isValidObjectId(bookId)) { 
      return res.status(400).send({ status: false, message: "input valid bookid" }) }
   
      const reviewId = req.params.reviewId;

    if (!validation.isValidObjectId(reviewId)) { 
      return res.status(400).send({ status: false, message: "input valid reviewid" }) }
    
      const data = req.body;

    if (Object.keys(data).length == 0) {
       return res.status(400).send({ status: false, message: "No input provided by user", }); }
   
       const { reviewedBy, review, rating } = data

    const bookDetails = await bookModel.findById(bookId).lean()
    if (!bookDetails) {
      return res.status(404).send({ status: false, message: "No book with this id exists" })}
    if (bookDetails.isDeleted == true) { 
      return res.status(400).send({ Status: false, message: "The book has been deleted" }) }


    const reviewDetails = await reviewModel.findById(reviewId)
    if (!reviewDetails) { 
      return res.status(404).send({ Status: true, message: "No review with this review id exists" }) }
    if (reviewDetails.isDeleted == true) { 
      return res.status(400).send({ Status: false, msg: "The requested review has been deleted" }) }

   
      let update = {}
    if (validation.valid(review)) { 
      update['review'] = review }
    if (validation.valid(reviewedBy)) { 
      update['reviewedBy'] = reviewedBy }
    if (validation.isValidRating(rating)) { 
      update['rating'] = rating }


    if (bookId != reviewDetails.bookId) {
       return res.status(400).send({ Status: false, msg: "The review and book do not match" }) }
    
    const saveData = await reviewModel.findOneAndUpdate({ _id: reviewId }, { $set: update })
     const reviewData = await reviewModel.find({bookId:bookId, isDeleted:false})
    
     bookDetails['reviewsData']=reviewData

    
    
    
    return res.status(200).send({ status: true, msg:`Review with id ${reviewId} updated sucessfuly` , Data:bookDetails})

  } 
  catch (err) {  return res.status(500).send({ status: false, msg: err.message }); }
};



const deleteReview = async (req, res) => {
  try {
    const reviewId = req.params.reviewId;
    const bookId = req.params.bookId

    
    if (!validation.isValidObjectId(bookId)) { 
      return res.status(400).send({ status: false, msg: "Please insert valid book id" }) }

    if (!validation.isValidObjectId(reviewId)) { 
      return res.status(400).send({ status: false, msg: "Please insert valid review id" }) }

    const review = await reviewModel.findById(reviewId)
    if (!review) {
       return res.status(404).send({ status: false, msg: "No review exists with this id" }) }
    if (review.isDeleted == true) { 
      return res.status(400).send({ status: false, msg: "Review Already deleted" }) }


    const book = await bookModel.findById(bookId)

    if (!book) { 
      return res.status(404).send({ status: false, msg: "not book exists with this id" }) }
    if (book.isDeleted == true) { 
      return res.status(400).send({ status: false, msg: "This book is Deleted" }) }


    if (bookId != review.bookId) { 
      return res.status(400).send({ Status: false, msg: "The book and review dont match" }) }



    const deleteReview = await reviewModel.findOneAndUpdate({ _id: reviewId }, { $set: { isDeleted: true } })

    const updatedBook = await bookModel.findOneAndUpdate({ _id: bookId }, { $inc: { reviews: -1 } })
    
    return res.status(200).send({ status: true, msg: " Review deleted " })


  }
   catch (err) { 
      return res.status(500).send({ status: false, msg: err.message, }); }
};

module.exports = { createReview, updateReview, deleteReview }