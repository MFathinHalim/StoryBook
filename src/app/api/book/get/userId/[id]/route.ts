import Books from "@/controllers/book";
import Users from "@/controllers/user";
import { NextRequest, NextResponse } from "next/server";

const userInstance = Users.getInstances();
const bookInstance = Books.getInstance();

export async function GET(req: NextRequest) {
  const user = await userInstance.authRequest(req);
  if (!user) return NextResponse.json({ msg: "Invalid Authentication." }, { status: 401 });

  const userId = req.nextUrl.pathname.split("/")[5];
  const page = parseInt(req.nextUrl.searchParams.get("page") || "1", 10); // Default page = 1
  const limit = parseInt(req.nextUrl.searchParams.get("limit") || "5", 10); // Default limit = 5
    
  try {
    // Ambil buku berdasarkan userId dengan pagination
    const books = await bookInstance.GetBooksFromUser(userId, page, limit);

    return NextResponse.json({ books });
  } catch (error) {
    console.error("Error fetching books:", error);
    return NextResponse.json({ msg: "Failed to fetch books." }, { status: 500 });
  }
}
