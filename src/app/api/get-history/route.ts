import dbconnect from "@/lib/dbConnect";
import UserModel from "@/model/user";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import { User } from "next-auth";
import mongoose from "mongoose";
import HistoryModel  from "@/model/history";

export async function GET(request: Request){
    await dbconnect();

    const session = await getServerSession(authOptions);
    const user: User = session?.user as User;
    
    if (!session || !user) {
        return Response.json(
            {
                success: false,
                message: 'un authorized user',
            },
            {
                status: 401,
            },
        );
    }

    const userId = new mongoose.Types.ObjectId(user._id);

    try {
        const history = await HistoryModel.find(
            {
                user: userId
            }
        )
        .sort({ createdAt: -1 })
        .select("question answer -_id")
        .lean();
            
        return Response.json(
            {
                success: true,
                messages: history,
            },
            {
                status: 200,
            },
        );
    } catch (error) {
        console.error("AN unexpected error occured while getting the history",error);

        return Response.json(
            {
                success: false,
                message: 'AN unexpected error occured while getting the history',
            },
            {
                status: 500,
            },
        );
    }
}