import Books from "@/controllers/book";
import Users from "@/controllers/user";
import { NextRequest, NextResponse } from "next/server";

const userInstance = Users.getInstances();
const bookInstance = Books.getInstance()

export async function GET(req: NextRequest) {
    const user = await userInstance.authRequest(req)
    if(!user) return NextResponse.json({msg: "Invalid Authentication."}, { status: 401 })

    const userId = req.nextUrl.pathname.split("/")[5]
    const book = await bookInstance.GetBooksFromUser(userId)

    return NextResponse.json(book)
}
