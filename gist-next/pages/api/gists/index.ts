import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "../../../utils/mongodb";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { db } = await connectToDatabase();

    switch (req.method) {
      case "GET": {
        let cursor = await db.collection("gists").find();
        const docs = await cursor.toArray();
        const gists = docs.map(({ _id, ...restDoc }) => {
          return { id: _id.toString(), ...restDoc };
        });
        return res.status(200).json(gists);
      }
      case "POST": {
        const { file, code } = req.body;
        let { ops } = await db.collection("gists").insertOne({ file, code });
        return res.status(200).json({ result: ops });
      }
      default: {
        res.setHeader("Allow", ["GET", "PUT"]);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
      }
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ statusCode: 500, message: err.message });
  }
};

export default handler;
