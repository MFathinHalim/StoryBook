import { NextRequest, NextResponse } from "next/server";
import imagekit from "@/utils/imagekit";; // Assuming you have ImageKit initialized here
import { headers } from "next/headers";
import Books from "@/controllers/book";
import Users from "@/controllers/user";

const bookInstance = Books.getInstance();
const userInstance = Users.getInstances();

export async function POST(req: NextRequest) {
  const formData = await req.formData();

  const headersList = headers();
  const authHeader = headersList.get("authorization");
  const token = authHeader && authHeader.split(" ")[1]; // Extract token from Bearer
  if (!token) return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  const checkToken = await userInstance.checkAccessToken(token);
  if (!checkToken) {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }
  const book = {
    title: formData.get("title") as string,
    notes: formData.get("notes") as string,
  };

  let img = ""; // Initialize image URL
  const file = formData.get("image") as File | null; // Image file (optional)

  // If there is a file, process and upload it
  /*if (file) {
    const buffer = await file.arrayBuffer(); // Convert File object to buffer

    // Upload image to ImageKit (replace with your upload logic)
    const uploadResult = await imagekit.upload({
      file: Buffer.from(buffer), // Uploading buffer data
      fileName: `cover-${Math.random().toString().replace("0.", "")}.jpg`,
      useUniqueFileName: false,
      folder: "SB",
    });

    if (!uploadResult || !uploadResult.url) {
      throw new Error("Image upload failed");
    }

    // Append timestamp to avoid caching issues
    const currentEpochTime = Date.now();
    img = `${uploadResult.url}?updatedAt=${currentEpochTime}`;
  }*/

  const post = await bookInstance.UserAction().newPost(book, checkToken, img);

  return Response.json({ post });
}

//notes from Fathin: today is oct 17, RIP Liam