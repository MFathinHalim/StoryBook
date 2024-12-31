import { bookModel } from "@/models/book";
import mongoose, { Model } from "mongoose";
import dbConnect from "@/utils/mongoose";
await dbConnect();

export default class Books {
  static instance: Books;

  //@ts-ignore
  #books: Model<bookType>;

  constructor() {
    this.#books = bookModel;
  }

  static getInstance(): Books {
    if (!Books.instance) Books.instance = new Books();
    return Books.instance;
  }

  UserAction() {
    return {
      // Function for new post
      async newPost(book: bookType, user: any, cover: string): Promise<string | number> {
        const time = new Date().toLocaleDateString();
        const trimmedFile = cover.trim();
        const isTitleEmpty = !book.title || book.title.trim().length === 0;
        if (isTitleEmpty) return 204;

        book.id = (Math.random().toString().replace("0.", "") + time.replace(/\//g, "")).slice(0, 19).padEnd(19, "0");
        book.user = user._id;
        book.time = time;
        book.cover = trimmedFile;

        await bookModel.create(book);
        return book.id;
      },

      async editBook(book: bookType, cover: string): Promise<string | number> {
        const time = new Date().toLocaleDateString();
        const trimmedFile = cover.trim();
        const isTitleEmpty = !book.title || book.title.trim().length === 0;
        if (isTitleEmpty) return 204;

        book.cover = trimmedFile;
        book.time = time;
        await bookModel.findOneAndUpdate({ _id: book._id }, book);
        return book.id;
      },

      async deleteBook(book: any) {
        try {
          await bookModel.deleteOne({ _id: book._id });
          return true;
        } catch (error) {
          console.log(error);
          return false;
        }
      },
    };
  }

  // Get Books with pagination (for Infinite Scroll)
  async GetBooks(page: number = 1, limit: number = 5) {
    const skip = (page - 1) * limit;
    try {
      const books = await this.#books
        .find()
        .populate("user", "name")
        .sort({ _id: -1 })
        .skip(skip)
        .limit(limit)
        .exec();
      return { books };
    } catch (error) {
      console.error("Error fetching books:", error);
      return { books: [] };
    }
  }
  async GetBook(id: string) {
    const objectId = mongoose.Types.ObjectId.isValid(id) ? new mongoose.Types.ObjectId(id) : null;
    const book = await this.#books
      .findOne({ $or: [{ _id: objectId }, { id: id }] })
      .sort({ _id: -1 })
      .populate("user", "name")
      .populate("user", "username")
      .exec();
    return book;
  }

  // Get Books from User (by User ID) with pagination
  async GetBooksFromUser(userId: string, page: number = 1, limit: number = 5): Promise<bookType[]> {
    const skip = (page - 1) * limit;
    try {
      const books = await bookModel.find({ user: new mongoose.Types.ObjectId(userId) })
        .skip(skip)
        .sort({ _id: -1 })
        .limit(limit)
        .exec();
      return books;
    } catch (error) {
      console.error("Error fetching books from user:", error);
      return [];
    }
  }
  async GetBooksFromUserWithoutPrivate(userId: string, page: number = 1, limit: number = 5): Promise<bookType[]> {
    const skip = (page - 1) * limit;
    try {
      const books = await bookModel.find({
        user: new mongoose.Types.ObjectId(userId),
        tag: { $in: ["Publish", "Question"] }
      })
        .skip(skip)
        .sort({ _id: -1 })
        .limit(limit)
        .exec();
      return books;
    } catch (error) {
      console.error("Error fetching books from user:", error);
      return [];
    }
  }

  // Get Books from Publisher (filtered by "Publish" tag) with pagination
  async GetBooksFromPublisher(page: number = 1, limit: number = 5): Promise<bookType[]> {
    const skip = (page - 1) * limit;
    try {
      const books = await this.#books
        .find({ tag: "Publish" })
        .sort({ _id: -1 })
        .skip(skip)
        .limit(limit)
        .exec();
      return books || [];
    } catch (error) {
      console.error("Error fetching publisher books:", error);
      return [];
    }
  }

  // Get Books from Question (filtered by "Question" tag) with pagination
  async GetBooksFromQuestion(page: number = 1, limit: number = 5): Promise<bookType[]> {
    const skip = (page - 1) * limit;
    try {
      const books = await this.#books
      .find({ tag: "Question" })
      .sort({ _id: -1 })
        .skip(skip)
        .limit(limit)
        .exec();
      return books || [];
    } catch (error) {
      console.error("Error fetching question books:", error);
      return [];
    }
  }
  async GetBooksBySearch(page: number = 1, limit: number = 5, tag: string, term: string): Promise<bookType[]> {
    const skip = (page - 1) * limit;
    try {
      const books = await this.#books
      .find({ tag: tag, title: { $regex: term, $options: "i" } })
      .sort({ _id: -1 })
        .skip(skip)
        .limit(limit)
        .exec();
      return books || [];
    } catch (error) {
      console.error("Error fetching question books:", error);
      return [];
    }
  }
}
