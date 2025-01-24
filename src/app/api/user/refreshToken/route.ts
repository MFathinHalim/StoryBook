import Users from "@/controllers/user";
import { NextRequest, NextResponse } from "next/server";

const userInstance = Users.getInstances();
/**
 * @param {NextRequest} req
 */
export async function POST(req:NextRequest) {
    const rt = req.cookies.get("refreshtoken")?.value
    if (!rt) return NextResponse.json({ error: 'Missing Refresh Token' }, { status: 401 })
    const token = await userInstance.createRefreshToken(rt)
    if(token === "error") return
    return NextResponse.json({ token })
}
