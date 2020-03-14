import express from "express";
import dotenv from "dotenv";

import loginRouter from "./api/login";

dotenv.config();

const app = express();
const PORT = process.env.NODE_PORT ?? 3000;

app.use("/login", loginRouter);

app.get("/", (req, res) => {
	res.send("GET root /");
});
app.listen(PORT, () => console.log(`app is listening on ${PORT}`));
