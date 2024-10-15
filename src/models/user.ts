import { Model, Schema, model, Types, models } from "mongoose";

const userSchema: Schema<userType> = new Schema<userType>({
  name: String,
  username: String,
  desc: String,
  password: String,
  pp: String,
  bookmark: [{ type: Types.ObjectId, ref: "posts" }],
});

const userModel: Model<userType> = models.user || model("user", userSchema);
export { userModel, userSchema };