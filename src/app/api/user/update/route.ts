import Users from "@/controllers/user";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken"

const userInstance = Users.getInstances();
/**
 * @param {NextRequest} req
 */
export async function POST(req:NextRequest) {
    const user = await userInstance.authRequest(req)
    if(!user) return NextResponse.json({msg: "Invalid Authentication."}, { status: 401 })

    const body = await req.json();
    const { name, desc, pp } = body
    await userInstance.editProfile({ name, desc, username: user.username }, pp)
    return NextResponse.json({}, { status: 200 })
}
