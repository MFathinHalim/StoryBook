import { Model, Schema, Types, model, models } from "mongoose";

// Main post schema
const bookSchema = new Schema<bookType>({
  id: String,
  user: { type: Types.ObjectId, ref: "user" },
  title: String,
  notes: String,
  time: String,
  cover: String,
  comments: [{type: Types.ObjectId, ref: "comment"}]
});

const bookModel: Model<bookType> = models.book || model<bookType>("book", bookSchema);
export { bookModel };