//? controller userType
//Todo list:
/* 
    [DONE] Make Login and Sign Up and accessToken. Details Account and Bookmark.
    *(welp, you can use the Texter for this one lol 0w0)*
*/
//Good Luck :)
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
////////////////////////////////////////////
import type { Model } from "mongoose";
import { userModel } from "@/models/user";
import type { Document } from "mongoose";
import mongoose from "mongoose";
///////////////////////////////////////////
import dbConnect from "@/utils/mongoose";
import { NextRequest } from "next/server";
await dbConnect();

dotenv.config();

// declare module "jsonwebtoken" {
//     interface JwtPayload {
//         id: string
//     }
// }

class Users {
    static instances: Users;

    #users: Model<userType>;
    #error: userType[];

    constructor() {
        this.#users = userModel;
        this.#error = [
            {
                name: "Username is Taken",
                username: "system",
                desc: "system",
                password: "system",
                pp: "",
                accessToken: {
                    accessNow: "",
                    timeBefore: "",
                },
            },
            {
                name: "Password or Username is incorrect!",
                username: "system",
                desc: "system",
                password: "system",
                pp: "",
                accessToken: {
                    accessNow: "",
                    timeBefore: "",
                },
            },
        ]; //list kemungkinan error
    }

    static getInstances() {
        if (!Users.instances) Users.instances = new Users(); //Untuk ngestart class
        return Users.instances;
    }

    async signUp(name: string = "", username: string = "", password: string = "", desc: string): Promise<userType> {
        password = await bcrypt.hash(btoa(password), 10); //bikin crypt buat passwordnya (biar gak diliat cihuyyy)
        const MAX_USERNAME_LENGTH = 16;

        // Regular expression to detect non-printable characters including Zero Width Space and other control characters
        const hasInvalidCharacters = /[\u200B-\u200D\uFEFF]/.test(username);

        // Regular expression to detect HTML tags
        const hasHTMLTags = /<\/?[a-z][\s\S]*>/i.test(username);

        // Check for invalid username
        if (
            username.length === 0 ||
            hasInvalidCharacters ||
            hasHTMLTags ||
            username.length > MAX_USERNAME_LENGTH ||
            name.length > MAX_USERNAME_LENGTH ||
            username.includes("/")
        ) {
            return this.#error[0]; // Handle username errors
        }
        //untuk signup
        const isNameTaken = await this.#users.findOne({
            $or: [{ username: username }],
        }); //? Check dulu apakah usernamenyna udah ada atau belum
        if (isNameTaken) return this.#error[0];
        ////////////////////////////////////////////////
        const newUser: userType = {
            name: name.replace(/<[^>]+>/g, ""), //! )
            username: username.replace(/<[^>]+>/g, ""), //! )====> Bikin supaya gak nambahin html <></> dan kawan kawan<(0O0)/
            desc: "", //! )
            password: password,
            pp: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
            bookmark: [],
        };

        await this.#users.create(newUser); //di push

        return newUser; //di return
    }

    async login(username: string, password: string): Promise<userType> {
        //Login
        try {
            const user = await this.#users.findOne({
                username: username.replace(/<[^>]+>/g, ""),
            });
            if (!user) {
                return this.#error[1]; // User not found or banned
            }

            const isPasswordValid = await bcrypt.compare(btoa(password), user.password || ""); //? check apakah passwordnya sesuai
            if (!isPasswordValid) return this.#error[1]; // Invalid password

            return {
                _id: user._id,
                username: user.username.replace(/<[^>]+>/g, ""),
                name: user.name.replace(/<[^>]+>/g, ""),
            };
        } catch (error) {
            console.error("Error during login:", error);
            return this.#error[1]; // Handle potential errors during database query
        }
    }

    async createAccessToken(id: string): Promise<{ newToken: string; refreshToken: string }> {
        try {
            const user = await this.#users.findOne({ _id: id });
            if (!user) return { newToken: "", refreshToken: "" };
            const { desc, bookmark, ...userPayload } = user.toObject();

            const newToken: string = jwt.sign(userPayload, process.env.JWT_SECRET_KEY || "", { expiresIn: "1d" }); // Buat access token
            const refreshToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET_KEY || "", {
                expiresIn: "7d",
            });
            return { newToken, refreshToken };
        } catch (error) {
            console.error("Error creating access token:", error);
            return { newToken: "", refreshToken: "" };
        }
    }

    createRefreshToken(refresh: string): any {
        return jwt.verify(refresh, process.env.JWT_SECRET_KEY || "", async (err: any, user: any) => {
            if (err) return "error";
            const createAccessToken = await this.createAccessToken(user.id);
            const accessToken: string = createAccessToken.newToken;

            return accessToken;
        });
    }

    async createBookmark(id: string, bookId: string) {
        const user: (Document<userType, any, any> & userType) | null = await this.#users.findOne({ id });
        if (!user) {
            return this.#error[1];
        }
        const userAlreadyBookmark = user.bookmark!.find((entry) => entry._id?.toString() === bookId);
        if (userAlreadyBookmark) {
            user.bookmark = user.bookmark!.filter((entry) => entry._id?.toString() !== bookId);
        } else {
            user.bookmark!.push(bookId);
        }
        return this.#users.updateOne({ id: id }, { $set: { bookmark: user.bookmark } }).then(() => 200);
    }
    async getBookmarks(id: string, page: number = 1, limit: number = 5) {
        try {
            // Validasi halaman dan limit
            if (page < 1 || limit <= 0) {
                throw new Error("Invalid page number or limit");
            }
            const objectId = mongoose.Types.ObjectId.isValid(id) ? new mongoose.Types.ObjectId(id) : null;

            // Temukan pengguna dengan ID dan populasi bookmark
            const user = await this.#users.findOne({ $or: [{ _id: objectId }, { id: id }] }).populate({
                path: "bookmark",
                populate: {
                    path: "user",
                    select: "-password",
                },
            });

            if (!user) {
                return this.#error[1];
            }

            // Hitung total bookmarks untuk paginasi

            const totalBookmarks = user.bookmark!.length;
            const totalPages = Math.ceil(totalBookmarks / limit);

            // Hitung indeks mulai dan akhir untuk paginasi
            const startIndex = (page - 1) * limit;
            const endIndex = startIndex + limit;

            // Ambil bookmarks sesuai halaman
            const paginatedBookmarks = user.bookmark!.slice(startIndex, endIndex);

            return { posts: paginatedBookmarks, totalPages };
        } catch (error) {
            console.error("Error fetching bookmarks:", error);
            return this.#error[1];
        }
    }

    checkAccessToken(token: string) {
        let jwtSecretKey: string = process.env.JWT_SECRET_KEY || "";
        try {
            return jwt.verify(token, jwtSecretKey); //Check access token jwtnya sesuai atau kagak (?)
        } catch (error) {
            return this.#error[0];
        }
    }
    async getUserByUsername(username: string) {
        try {
            // Cari user berdasarkan username
            const user = await this.#users.findOne({ username: username });
            // Jika user tidak ditemukan, kembalikan error
            if (!user) {
                return this.#error[1];
            }

            // Menghilangkan password dari data pengguna yang dikembalikan
            const userWithoutPassword = {
                _id: user._id,
                id: user.id,
                name: user.name,
                username: user.username,
                pp: user.pp,
                desc: user.desc,
            };

            return userWithoutPassword;
        } catch (error) {
            console.error("Error fetching user by username:", error);
            return this.#error[1];
        }
    }
    async checkUserDetails(username: string) {
        const user: (Document<userType, any, any> & userType) | null = await this.#users.findOne({ username: username });
        const userWithoutPassword = {
            ...user?.toObject(),
            password: undefined,
        }; //check user detail (gak ngasihi password)

        if (user) {
            return {
                user: userWithoutPassword,
            };
        }
        return {
            user: this.#error[1],
        };
    }

    async checkUserId(userId: string): Promise<(Document<userType, any, any> & userType) | userType> {
        const user: (Document<userType, any, any> & userType) | null = await this.#users.findOne({ id: userId });
        if (user) {
            return user;
        } else {
            return this.#error[1];
        }
    } //cari usernya berdasarkan id

    async checkUserUname(username: string): Promise<(Document<userType, any, any> & userType) | userType> {
        const user: (Document<userType, any, any> & userType) | null = await this.#users.findOne({ username: username }); //cari berdasarkan username
        if (user) {
            return user;
        } else {
            return this.#error[1];
        }
    }

    async editProfile(userData: userType, profilePicture: string): Promise<userType | {}> {
        try {
            const user = await this.#users.findOne({ _id: userData._id });
            const hasInvalidCharacters = /[\u200B-\u200D\uFEFF]/.test(userData.username) || /[\u200B-\u200D\uFEFF]/.test(userData.name);

            // Regular expression to detect HTML tags
            const hasHTMLTags = /<\/?[a-z][\s\S]*>/i.test(userData.username) || /<\/?[a-z][\s\S]*>/i.test(userData.name);

            // Maximum length for Discord username
            const MAX_DISCORD_USERNAME_LENGTH = 16;

            // Check for invalid fields
            if (
                userData.username.trim().length === 0 ||
                userData.name.trim().length === 0 ||
                hasInvalidCharacters ||
                hasHTMLTags ||
                userData.username.trim().length > MAX_DISCORD_USERNAME_LENGTH ||
                userData.name.trim().length > MAX_DISCORD_USERNAME_LENGTH
            ) {
                return this.#error[0];
            }
            if (!user) {
                return this.#error[1]; // User not found
            }

            user.name = userData.name;
            user.pp = profilePicture !== "" ? profilePicture : user.pp;
            user.desc = userData.desc;

            await user.save();
            return {
                username: user.username.replace(/<[^>]+>/g, ""),
                name: user.name.replace(/<[^>]+>/g, ""),
                pp: user.pp,
                desc: user.desc!.replace(/<[^>]+>/g, ""),
            };
        } catch (error) {
            console.error("Error editing profile:", error);
            return this.#error[1];
        }
    }
    async authRequest(req: NextRequest) {
        try {
            const token = req.headers.get("authorization")?.split(" ")[1];
            if (!token) return null;
            const result = jwt.verify(token, process.env.JWT_SECRET_KEY || "");
            if (!result || typeof result === "string") return null;

            let user = await userModel.findOne({ _id: result._id }).lean();
            if (!user) return null;

            user.accessToken = {
                accessNow: "",
                timeBefore: "",
            };
            user.password = "";

            return user;
        } catch (e: any) {
            console.error(e);
            return null;
        }
    }
}

export default Users; //TODO Export biar bisa dipake
