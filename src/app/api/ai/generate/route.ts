import AiController from "@/controllers/ai";
import Users from "@/controllers/user";
import { NextRequest, NextResponse } from "next/server";

const userInstance = Users.getInstances();

export async function POST(req: NextRequest) {
    const user = await userInstance.authRequest(req)
    if (!user) return NextResponse.json({ msg: "Invalid Authentication." }, { status: 401 })

    const ai = new AiController();
    const formData = await req.formData();
    //@ts-ignore
    const prompt = formData.get("prompt")!.toString();
    const result = await ai.generateText(prompt)
    return NextResponse.json({ result })
}
