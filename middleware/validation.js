const mongoose = require("mongoose");

const valid = function (input) {
  if (typeof input === "undefined" || typeof input === null) {
    return false;
  }
  if (typeof input === "string" && input.trim().length === 0) {
    return false;
  } else {
    return true;
  }
};

const isValidObjectId = function (ObjectId) {
  return mongoose.Types.ObjectId.isValid(ObjectId);
};

const isValidEmail = function (email) {
  return /^\w+([\.-]?\w+)@\w+([\. -]?\w+)(\.\w{2,3})+$/.test(email);
};

const isValidPhone = function (phone) {
  return /^[6-9]\d{9}$/.test(phone);
};

const isValidDateFormat = function (date) {
  return /^\d{4}\-(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01])$/.test(date);
};

const isValidIsbn = function (isbn) {
  return /^(\()?\d{3}(\))?(-|\s)?\d{9}$/.test(isbn);
};

const isValidRating = function (rating) {
  if (
    (typeof rating == "number" && rating == 1) ||
    rating == 2 ||
    rating == 3 ||
    rating == 4 ||
    rating == 5
  )
    return true;
  return false;
};

const isValidTitle = function (x) {
  if (x == "Mr" || x == "Mrs" || x == "Miss") {
    return true;
  }
  return false;
};

module.exports.valid = valid;
module.exports.isValidObjectId = isValidObjectId;
module.exports.isValidEmail = isValidEmail;
module.exports.isValidPhone = isValidPhone;
module.exports.isValidDateFormat = isValidDateFormat;
module.exports.isValidIsbn = isValidIsbn;
module.exports.isValidRating = isValidRating;
module.exports.isValidTitle = isValidTitle;
