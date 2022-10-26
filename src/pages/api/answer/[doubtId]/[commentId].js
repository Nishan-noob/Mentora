// main comment
import Answer from "../../../../models/answer";
import dbConnect from "../../../../utils/dbConnect";
import getServerSession from "../../../../utils/getServerSession";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { doubtId, commentId } = req.query;
    const { answer } = req.body;
    const session = await getServerSession(req, res);

    if (!session) {
      res.status(401).json({ message: "Please Sign in to add a comment" });
      return;
    }
    const user = session?.user?.email;
    try {
      await dbConnect();
      const newAnswer = await Answer.create({
        doubt_id: doubtId,
        answer,
        user,
        parent_id: commentId,
      });

      res.status(200).json({ message: newAnswer });
    } catch (err) {
      console.log(err);
      res.status(400).json({ message: "Error adding answer" });
    }
  }
}
