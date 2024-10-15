import mongoose from "mongoose";
import * as dotenv from "dotenv";

dotenv.config();

const MONGODBURI = process.env.MONGODBURI;

if (!MONGODBURI) {
  throw new Error("Please define the MONGODB_URI environment variable inside .env");
}

// Set strict mode globally
mongoose.set("strict", false);
//@ts-ignore
let cached = global.mongoose;

if (!cached) {//@ts-ignore
  cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };
    //@ts-ignore
    cached.promise =  mongoose.connect(MONGODBURI, opts).then((mongoose) => {
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default dbConnect;