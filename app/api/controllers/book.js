const bookModel = require("../models/books");
const securePin = require("secure-pin");

module.exports = {
  getById: function (req, res, next) {
    let book = {};
    book.bookId = req.params.bookId;
    book.clientId = req.body.userId;
    bookModel.findOne(book, function (err, bookInfo) {
      if (!bookInfo) {
        res.status(200).send({
          message: "No Book detail found!!!",
        });
      } else {
        res.status(200).send({
          message: "Book detail found!!!",
          data: { book: bookInfo },
        });
      }
    });
  },
  getAll: function (req, res, next) {
    bookModel.find({ clientId: req.body.userId }, function (err, books) {
      if (err) {
        next(err);
      } else {
        res.status(200).send({
          message: "Books list found!!!",
          data: { books: books },
        });
      }
    });
  },
  updateById: function (req, res, next) {
    console.log("updddd comung", req.params, req.body);
    let bookQuery = {};
    bookQuery.bookId = req.params.bookId;
    bookQuery.clientId = req.body.userId;
    bookModel.findOne(bookQuery, function (err, bookInfo) {
      if (err) {
        res.status(404).send({ message: "BookId Not Found!!!" });
      } else {
        let book = {};
        book.title = req.body.title;
        book.author = req.body.author;
        book.summary = req.body.summary;
        bookModel.findOneAndUpdate(bookQuery, book, function (err, bookInfo) {
          if (err) next(err);
          else {
            res.status(200).send({ message: "Books updated successfully!!!" });
          }
        });
      }
    });
  },
  deleteById: function (req, res, next) {
    let bookQuery = {};
    bookQuery.employeeId = req.params.employeeId;
    bookQuery.clientId = req.body.userId;
    bookModel.findOneAndRemove(bookQuery, function (err, bookInfo) {
      if (err) next(err);
      else {
        res.status(200).send({ message: "Book deleted successfully!!!" });
      }
    });
  },
  create: function (req, res, next) {
    bookModel.findOne(
      { title: req.body.title, author: req.body.author },
      function (err, bookInfo) {
        console.log(bookInfo, "bookInfo");
        if (!bookInfo) {
          const { title, author, summary, userId } = req.body;
          const book = {
            title,
            author,
            summary,
            bookId: securePin.generatePinSync(4),
            clientId: userId,
          };
          bookModel.create(book, function (err, result) {
            if (err) next(err);
            else
              res.status(200).send({ message: "Books added successfully!!!" });
          });
        } else {
          res.status(422).send({ message: "Title or Author already exists" });
        }
      }
    );
  },
};
