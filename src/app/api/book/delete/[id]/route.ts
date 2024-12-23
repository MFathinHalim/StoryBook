import Books from "@/controllers/book";
import Users from "@/controllers/user";
import { NextRequest, NextResponse } from "next/server";

const userInstance = Users.getInstances();
const bookInstance = Books.getInstance()

export async function DELETE(req: NextRequest) {
    const user = await userInstance.authRequest(req)
    if(!user) return NextResponse.json({msg: "Invalid Authentication."}, { status: 401 })

    const id = req.nextUrl.pathname.split("/")[4]
    const book = await bookInstance.GetBook(id)

    if (!book) return NextResponse.json({ msg: "Book not found!" }, { status: 404 })

    if (!user._id.equals(book.user._id)) return NextResponse.json({ msg: "Invalid Authentication" }, { status: 401 })
    const success = await bookInstance.UserAction().deleteBook(book)
    if (!success) return NextResponse.json({ msg: "Internal Server Error" }, { status: 500 })

    return NextResponse.json({ msg: "Success" })
}
