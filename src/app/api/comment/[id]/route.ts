import Comments from "@/controllers/comment";
import Books from "@/controllers/book";
import Users from "@/controllers/user";
import { NextRequest, NextResponse } from "next/server";

const userInstance = Users.getInstances();
const bookInstance = Books.getInstance()
const commentInstance = Comments.getInstance()

export async function GET(req: NextRequest) {
    const user = await userInstance.authRequest(req)
    if(!user) return NextResponse.json({msg: "Invalid Authentication."}, { status: 401 })

    const id = req.nextUrl.pathname.split("/")[3]
    const book = await bookInstance.GetBook(id)

    if (!book) return NextResponse.json({ msg: "Book not found!" }, { status: 404 })

    const page = req.nextUrl.searchParams.get("page")

    const { comments } = await commentInstance.getComments(book.id, page ? parseInt(page) : 1)

    return NextResponse.json({ comments })
}
