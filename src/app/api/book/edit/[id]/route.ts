import Books from "@/controllers/book";
import Users from "@/controllers/user";
import { NextRequest, NextResponse } from "next/server";

const userInstance = Users.getInstances();
const bookInstance = Books.getInstance();

export async function PATCH(req: NextRequest) {
    const user = await userInstance.authRequest(req);
    console.log(user)
    if (!user) return NextResponse.json({ msg: "Invalid Authentication." }, { status: 401 });

    const id = req.nextUrl.pathname.split("/")[4];
    const book = await bookInstance.GetBooks(id);

    if (!book) return NextResponse.json({ msg: "Book not found!" }, { status: 404 });

    const formData = await req.formData();
    //@ts-ignore
    book.title = formData.get("title");
    //@ts-ignore
    book.notes = formData.get("notes");

    if (!user._id.equals(book.user._id)) return NextResponse.json({ msg: "Invalid Authentication" }, { status: 401 });

    const result = await bookInstance.UserAction().editBook(book, book.cover || "");

    if (result === 204) return NextResponse.json({ msg: "Empty Title" }, { status: 204 });

    return NextResponse.json({ id: result });
}
