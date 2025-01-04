import Books from "@/controllers/book";
import Users from "@/controllers/user";
import imagekit from "@/utils/imagekit";
import { NextRequest, NextResponse } from "next/server";

const userInstance = Users.getInstances();
const bookInstance = Books.getInstance();

export async function PATCH(req: NextRequest) {
    const user = await userInstance.authRequest(req);
    if (!user) return NextResponse.json({ msg: "Invalid Authentication." }, { status: 401 });

    const id = req.nextUrl.pathname.split("/")[4];
    const book = await bookInstance.GetBook(id);

    if (!book) return NextResponse.json({ msg: "Book not found!" }, { status: 404 });

    const formData = await req.formData();
    //@ts-ignore
    book.title = formData.get("title");
    //@ts-ignore
    book.notes = formData.get("notes");
    const file = formData.get("image") as File | null; // Image file (optional)

    if (file) {
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
        book.cover = `${uploadResult.url}?updatedAt=${currentEpochTime}`;
      }
    
    let bookAction = bookInstance.UserAction()
    let result;
    if (!user._id.equals(book.user._id)) {
      const newBook = {
        title: book.title,
        notes: book.notes,
        user: book.user
      }
      result = await bookAction.newPost(book, user, book?.cover || "");
    } else {
      result = await bookAction.editBook(book, book?.cover || "");
    }
    
    if (result === 204) return NextResponse.json({ msg: "Empty Title" }, { status: 204 });

    return NextResponse.json({ id: result });
}
