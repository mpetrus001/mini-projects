import { ObjectId } from "mongodb";
import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "../../../utils/mongodb";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { db } = await connectToDatabase();

    switch (req.method) {
      case "POST": {
        const { id } = req.query;
        let o_id = new ObjectId(id as string);
        const { code } = req.body;
        await db.collection("gists").updateOne(
          { _id: o_id },
          {
            $set: {
              code,
            },
          }
        );
        return res.status(200).json({});
      }
      case "DELETE": {
        const { id } = req.query;
        let o_id = new ObjectId(id as string);
        await db.collection("gists").findOneAndDelete({ _id: o_id });
        return res.status(200).json({});
      }
      default: {
        res.setHeader("Allow", ["POST", "DELETE"]);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
      }
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ statusCode: 500, message: err.message });
  }
};

export default handler;
