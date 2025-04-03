import UserModel from "@/model/user";
import HistoryModel from "@/model/history";
import { getServerSession } from "next-auth";
import { User } from "next-auth";
import dbconnect from "@/lib/dbConnect";
import { authOptions } from "../auth/[...nextauth]/options";

export async function DELETE(request: Request) {
  await dbconnect();

  const session = await getServerSession(authOptions);
  const user: User = session?.user as User;

  if (!session || !session.user) {
    return Response.json(
      {
        success: false,
        message: "Not Authenticated",
      },
      {
        status: 401,
      }
    );
  }

  try {
    const updateResult = await UserModel.updateOne(
      {
        _id: user._id,
      },
      {
        $set: {
          history: [],
        },
      }
    );

    const deletedHistory = await HistoryModel.deleteMany({
      user: user._id,
    });

    if (updateResult.modifiedCount === 0 || deletedHistory.deletedCount === 0) {
      return Response.json(
        {
          success: false,
          message: "History not found or already deleted",
        },
        {
          status: 404,
        }
      );
    }

    return Response.json(
      {
        success: true,
        message: "History deleted successfully",
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error deleting history:", error);

    return Response.json(
      {
        success: false,
        message: "Error deleting history",
      },
      {
        status: 500,
      }
    );
  }
}
