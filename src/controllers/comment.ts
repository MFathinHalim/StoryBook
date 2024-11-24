//? controller comment
//Todo list:
/* 
    [DONE] Make add comment function (return: commentType for frontend purpose) 
    [DONE] Make get comment (return: commentType[](the algorithm is from higher to lower upvote)
    [DONE] Make UpVote function (return: true | false, if true then it's higher, if false then it's lower)
    .
    .
    .
    How Comments work:
    1. Add the comment to the comment model
    2. For get comment, search from commentTo(this is using book id) (it's somth like reply to from Texter but in different model)
*/
//Good Luck :)

import { commentModel } from "@/models/comment";
import dbConnect from "@/utils/mongoose";
await dbConnect();

export default class Comment {
  static instance: Comment;

  //@ts-ignore
  #comments: Model<commentType>;

  static getInstance() {
    if (!Comment.instance) Comment.instance = new Comment(); //Untuk ngestart class
    return Comment.instance;
  }

  async addComment(comment: commentType, bookId: string, user: userType) {
    const time = new Date().toLocaleDateString();
    const isTitleEmpty = !comment.comment || comment.comment.trim().length === 0;
    //check the title
    if (isTitleEmpty) return 204;

    comment.id = (Math.random().toString().replace("0.", "") + time.replace(/\//g, "")).slice(0, 19).padEnd(19, "0");
    comment.user = user._id;
    comment.time = time;
    comment.commentTo = bookId;
    comment.upvote = [];

    // Simpan post ke database
    await commentModel.create(comment);
    return comment;
  }
  async getComments(bookId: string, page: number = 1) {
    const limit = 5;
    const skip = page > 0 ? (page - 1) * limit : 0;
    let comments = await this.#comments.find({ commentTo: bookId }).populate("user", "-password").populate("user", "-desc").populate("user", "-bookmark").sort({ upvote: -1 }).limit(limit).skip(skip).exec();
    return { comments };
  }
  upvote(
    commentId: string,
    user: userType
  ): Promise<number> {
    //Fungsi ngelike
    return this.#comments
      .findOne({ id: commentId })
      .populate("upvote", "-password") //intinya nyari dulu
      .exec()
      .then(
        (
          comment: any
         
        ) => {
          if (!comment) {
            throw new Error("Post not found");
          }

          const userAlreadyLike: userType | undefined = comment.upvote.find(
            (entry: userType) => entry._id.toString() === user._id
          ); //kalau usernya udah ngelike

          if (!userAlreadyLike) {
            // User belum like, tambahkan like
            comment.upvote.push(user._id); //? bakal di push
          } else {
            // User sudah like, hapus likez
            comment.upvote = comment.upvote.filter(
              (entry: userType) => entry._id.toString() !== user._id
            ); //? di filter
          }

          //! Update post di database
          return this.#comments
            .updateOne(
              { id: commentId },
              { $set: { "upvote": comment.upvote } }
            )
            .then(() => comment.upvote.length);
        }
      )
  }
}
