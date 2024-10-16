import { Model, Schema, Types, model, models } from "mongoose";

// Main post schema
const commentSchema = new Schema<commentType>({
  id: String,
  user: { type: Types.ObjectId, ref: "user" },
  comment: String,
  upvote: [{ type: Types.ObjectId, ref: "user" }],
  commentTo: String
});

const commentModel: Model<commentType> = models.comment || model<commentType>("comment", commentSchema);
export { commentModel };