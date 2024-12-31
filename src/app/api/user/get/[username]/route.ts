import Users from "@/controllers/user";
import { NextRequest, NextResponse } from "next/server";

const userInstance = Users.getInstances();

export async function GET(req: NextRequest) {

    const username = req.nextUrl.pathname.split("/")[4];
    const user = await userInstance.getUserByUsername(username);
    if (user.name === "Password or Username is incorrect!") {
        return NextResponse.json({ message: "User Not Found" }, { status: 404 });
    }
    return NextResponse.json(user);
}
