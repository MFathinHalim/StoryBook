import Comments from "@/controllers/comment";
import Users from "@/controllers/user";
import { NextRequest, NextResponse } from "next/server";

const userInstance = Users.getInstances();
const commentInstance = Comments.getInstance()

export async function POST(req: NextRequest) {
    const user = await userInstance.authRequest(req)
    if(!user) return NextResponse.json({msg: "Invalid Authentication."}, { status: 401 })

    const id = req.nextUrl.pathname.split("/")[4]

    const a = await commentInstance.upvote(id, user)
    console.log(a)
    return NextResponse.json({total: a})
}
