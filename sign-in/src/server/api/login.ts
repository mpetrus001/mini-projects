import express, { Router } from "express";
import * as UserLoginService from "../service/UserLoginService";

const loginRouter = Router();

loginRouter.use(express.json());

loginRouter.get("/", (req, res) => {
	return res.send("GET login /");
});

loginRouter.post("/", async (req, res) => {
	const { username, password } = req.body;
	const signupResult = await UserLoginService.signupRequest({
		username,
		password,
	});
	if (signupResult.isFailure) {
		return res.status(401).json(signupResult.errMsg);
	}
	return res.json(signupResult.value);
});

export default loginRouter;
