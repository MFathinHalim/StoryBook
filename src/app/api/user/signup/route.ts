import Users from "@/controllers/user";
import { NextRequest, NextResponse } from "next/server";

const userInstance = Users.getInstances();
/**
 * @param {NextRequest} req
 */
export async function POST(req:NextRequest) {
    const body = await req.json();
    const {nama, username, password} = body
    await userInstance.signUp(nama, username, password, "");
// Suggested code may be subject to a license. Learn more: ~LicenseLog:2250943526.
    return NextResponse.json({message: "success"});
}
