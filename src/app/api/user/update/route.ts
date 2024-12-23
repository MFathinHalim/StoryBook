import Users from "@/controllers/user";
import { NextRequest, NextResponse } from "next/server";
import imagekit from "@/utils/imagekit";

const userInstance = Users.getInstances();

/**
 * @param {NextRequest} req
 */
export async function POST(req: NextRequest) {
    const user = await userInstance.authRequest(req);
    if (!user) return NextResponse.json({ msg: "Invalid Authentication." }, { status: 401 });

    const contentType = req.headers.get("content-type") || "";
    if (!contentType.includes("multipart/form-data")) {
        return NextResponse.json({ msg: "Invalid content type. Expected multipart/form-data." }, { status: 400 });
    }

    try {
        // Parse the FormData
        const formData = await req.formData();
        const _id = formData.get("_id") as string;
        const name = formData.get("name") as string;
        const desc = formData.get("desc") as string;
        const file = formData.get("image") as File | null;

        let img = ""; // Initialize image URL

        // Process the uploaded file if exists
        if (file) {
            const buffer = await file.arrayBuffer(); // Convert File object to buffer

            // Upload image to ImageKit
            const uploadResult = await imagekit.upload({
                file: Buffer.from(buffer), // Uploading buffer data
                fileName: `pp-${Math.random().toString().replace("0.", "")}.jpg`,
                useUniqueFileName: false,
                folder: "SB",
            });

            if (!uploadResult || !uploadResult.url) {
                throw new Error("Image upload failed");
            }

            // Append timestamp to avoid caching issues
            const currentEpochTime = Date.now();
            img = `${uploadResult.url}?updatedAt=${currentEpochTime}`;
        }

        // Update the user profile
        await userInstance.editProfile(
            {
                _id,
                name,
                desc,
                username: user.username,
            },
            img // Updated image URL (if uploaded)
        );

        return NextResponse.json({ msg: "Profile updated successfully!" }, { status: 200 });
    } catch (error) {
        console.error("Error processing request:", error);
        return NextResponse.json({ msg: "Failed to process request." }, { status: 500 });
    }
}
