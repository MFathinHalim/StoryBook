import Comments from "@/controllers/comment";
import Books from "@/controllers/book";
import Users from "@/controllers/user";
import { NextRequest, NextResponse } from "next/server";

const userInstance = Users.getInstances();
const bookInstance = Books.getInstance()
const commentInstance = Comments.getInstance()

export async function POST(req: NextRequest) {
    const user = await userInstance.authRequest(req)
    if(!user) return NextResponse.json({msg: "Invalid Authentication."}, { status: 401 })

    const id = req.nextUrl.pathname.split("/")[4]
    const book = await bookInstance.GetBook(id)

    if (!book) return NextResponse.json({ msg: "Book not found!" }, { status: 404 })

    const { comment } = await req.json()

    const newComment = await commentInstance.addComment({ comment, id: "", user, time: new Date().toLocaleString(), _id: null, upvote: [], commentTo: book.id }, book.id, user)
    if (newComment === 204) return NextResponse.json({ msg: "Comment is empty!" }, { status: 204 })
        console.log(newComment)

    return NextResponse.json({ comment: newComment })
}
