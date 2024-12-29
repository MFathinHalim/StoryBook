import Users from "@/controllers/user";
import { NextRequest, NextResponse } from "next/server";

const userInstance = Users.getInstances();
/**
 * @param {NextRequest} req
 */
export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { nama, username, password } = body;

        const request = await userInstance.signUp(nama, username, password, "");

        if (request.name === "Username is Taken") {
            return NextResponse.json({ message: "Name is already taken" }, { status: 409 });
        }

        if (request.name === "The Password or Username is Incorrect") {
            return NextResponse.json({ message: "The Password or Username is Incorrect" }, { status: 401 });
        }

        return NextResponse.json({ message: "success" });
    } catch (error) {
        console.error("Error during signup:", error);
        return NextResponse.json({ message: "An unexpected error occurred" }, { status: 500 });
    }
}
