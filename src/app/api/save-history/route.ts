import dbconnect from "@/lib/dbConnect";
import HistoryModel from "@/model/history";
import { getServerSession, User } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import UserModel from "@/model/user";

export async function POST(request: Request) {
  await dbconnect();
  const { question, answer } = await request.json();
  const session = await getServerSession(authOptions);
  const user: User = session?.user as User;

  if (!session || !user) {
    return Response.json(
      {
        success: false,
        message: "un authorized user",
      },
      {
        status: 401,
      }
    );
  }

  if (!question || !answer) {
    return Response.json(
      {
        success: false,
        message: "question or answer is missing",
      },
      {
        status: 400,
      }
    );
  }

  try {
    const history = await HistoryModel.create({
      question: question,
      answer: answer,
      user: user._id,
    });
    const userHistory = await UserModel.findOneAndUpdate(
      { _id: user._id },
      { $push: { history: history._id } },
      { new: true }
    )
    if (history && userHistory) {
        return Response.json(
            {
              success: true,
              message: "history saved successfully",
            },
            {
              status: 200,
            }
          );
    }
    else{
        return Response.json(
            {
              success: false,
              message: "history not saved",
            },
            {
              status: 400,
            }
          );
    }
  } catch (error) {
    console.log(error);
  }
}
