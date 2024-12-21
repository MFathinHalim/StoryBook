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
    constructor() {
        this.#comments = commentModel;
    }

    static getInstance() {
        if (!Comment.instance) Comment.instance = new Comment(); //Untuk ngestart class
        return Comment.instance;
    }

    async addComment(comment: commentType, bookId: string, user: userType) {
      const time = new Date().toLocaleDateString();
      const isTitleEmpty = !comment.comment || comment.comment.trim().length === 0;
      if (isTitleEmpty) return 204;
      
      comment.user = user._id;
      comment.time = time;
      comment.commentTo = bookId;
      comment.upvote = [];
    
      try {
        const savedComment = await commentModel.create(comment);
        return savedComment; // Return the saved comment
      } catch (error) {
        console.error("Error saving comment:", error);
        throw error; // Re-throw the error to be handled by the caller
      }
    }
    async getComments(bookId: string, page: number = 1) {
        const limit = 5;
        const skip = page > 0 ? (page - 1) * limit : 0;
        let comments = await this.#comments
            .find({ commentTo: bookId })
            .populate("user", "-password")
            .populate("user", "-desc")
            .populate("user", "-bookmark")
            .sort({ upvote: -1 })
            .limit(limit)
            .skip(skip)
            .exec();
        return { comments };
    }
    upvote(commentId: string, user: userType): Promise<number> {
        //Fungsi ngelike
        return this.#comments
            .findOne({ id: commentId })
            .populate("upvote", "-password") //intinya nyari dulu
            .exec()
            .then((comment: any) => {
                if (!comment) {
                    throw new Error("Post not found");
                }
                const userAlreadyLike = comment.upvote.find((entry: userType) => entry._id.toString() === user._id.toString());
                if (userAlreadyLike === undefined) {
                    // User belum like, tambahkan like
                    comment.upvote.push(user._id); //? bakal di push
                } else {
                    // User sudah like, hapus likez
                    comment.upvote = comment.upvote.filter((entry: userType) => entry._id.toString() !== user._id.toString()); //? di filter
                }

                //! Update post di database
                return this.#comments.updateOne({ id: commentId }, { $set: { upvote: comment.upvote } }).then(() => comment.upvote);
            });
    }
}
