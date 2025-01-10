import Books from "@/controllers/book";
import Users from "@/controllers/user";
import { NextRequest, NextResponse } from "next/server";

const userInstance = Users.getInstances();
const bookInstance = Books.getInstance()

export async function GET(req: NextRequest) {
    const user = await userInstance.authRequest(req)
    if(!user) return NextResponse.json({msg: "Invalid Authentication."}, { status: 401 })

    const searchTerm = req.nextUrl.pathname.split("/")[4]
    const tag = req.nextUrl.searchParams.get('tag') || 'Publish';
    const page = parseInt(req.nextUrl.searchParams.get("page") || "1", 10); 
    const limit = parseInt(req.nextUrl.searchParams.get("limit") || "5", 10);
    const books = await bookInstance.GetBooksBySearch(page, limit, tag, searchTerm);
    if (!books) return NextResponse.json({ msg: "Book not found!" }, { status: 404 })

    return NextResponse.json({books})
}
