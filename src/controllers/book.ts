//? controller book
//Todo list:
/* 
    [DONE] Make the posting function (return: id so we can redirect it)
    [DONE] Make the edit function (return: id so we can redirect it)
    [DONE] Make the delete function (return: 200 so we can redirect it to /
    [DONE] Make the get function (return: bookType so we can show it)
    [DONE] Make the get with user id function (return: bookType[] so we can show it) *
*/
//Good Luck :)

import { bookModel } from "@/models/book";
import mongoose, { Model } from "mongoose";
import dbConnect from "@/utils/mongoose";
await dbConnect();

export default class Books {
  static instance: Books;

  //@ts-ignore
  #books: Model<bookType>;

  //constructor
  constructor() {
    this.#books = bookModel;
  }

  //get instances :D
  static getInstance(): Books {
    if (!Books.instance) Books.instance = new Books();
    return Books.instance;
  }

  UserAction() {
    return {
      //The Function of New Post
      //? To use it, using Books.UserAction().newPost();
      async newPost(book: bookType, user: any, cover: string): Promise<string | number> {
        const time = new Date().toLocaleDateString();
        const trimmedFile = cover.trim();
        const isTitleEmpty = !book.title || book.title.trim().length === 0;
        //check the title
        if (isTitleEmpty) return 204;

        book.id = (Math.random().toString().replace("0.", "") + time.replace(/\//g, "")).slice(0, 19).padEnd(19, "0");
        book.user = user._id;
        book.time = time;
        book.cover = trimmedFile;

        // Simpan post ke database
        await bookModel.create(book);
        return book.id;
      },
      //* Function for edit Book
      //? to use it, using Books.UserAction().editBook()
      async editBook(book: bookType, cover: string): Promise<string | number> {
        const time = new Date().toLocaleDateString();
        const trimmedFile = cover.trim();
        const isTitleEmpty = !book.title || book.title.trim().length === 0;
        //check the title
        if (isTitleEmpty) return 204;
        book.cover = trimmedFile;
        book.time = time;
        // Simpan post ke database
        await bookModel.findOneAndUpdate({ _id: book._id }, book);
        return book.id;
      },
      //! Function for delete book [WARNING: DANGER!!]
      //? to use it, using Books.UserAction().editBook();
      async deleteBook(book: bookType) {
        await bookModel
          .deleteOne({ _id: book._id })
          .then(() => {
            console.log("deleted"); // Success
            return 200;
          })
          .catch((error) => {
            console.log(error); //! Failed
          });
        return 200;
      },
    };
  }
  //Get(because using this.#books we dont use chaining)
  //* GetBooks (with id)
  async GetBooks(id: string) {
    const objectId = mongoose.Types.ObjectId.isValid(id) ? new mongoose.Types.ObjectId(id) : null;
    const book = await this.#books
      .findOne({ $or: [{ _id: objectId }, { id: id }] })
      .populate("user", "-password")
      .populate("user", "-desc")
      .populate("user", "-bookmark")
      .exec();

    return book;
  }
  //* Get Books From User Function
  async GetBooksFromUser(userId: string): Promise<bookType[]> {
    try {
      const books = await bookModel.find({ user: new mongoose.Types.ObjectId(userId) });
  
      return books || [];
    } catch (error) {
      console.error("Error fetching books:", error);
      return [];
    }
  }
}
