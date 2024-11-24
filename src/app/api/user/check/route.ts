import Users from "@/controllers/user";
import { NextRequest, NextResponse } from "next/server";

const userInstance = Users.getInstances();
/**
 * @param {NextRequest} req
 */
export async function POST(req:NextRequest) {
    const user = await userInstance.authRequest(req)
    if(!user) return NextResponse.json({msg: "Invalid Authentication."}, { status: 401 })

    return NextResponse.json(user, { status: 200 })
}
