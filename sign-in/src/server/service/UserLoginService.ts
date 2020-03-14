import { Result } from "../utils/Result";
import bcrypt from "bcrypt";
import * as UserPersistService from "./UserPersistService";

export function loginRequest({
	username,
	password,
}: {
	username: string;
	password: string;
}) {
	const user = username;
	return Result.fail("didn't work");
}
export async function signupRequest({
	username,
	password,
}: {
	username: string;
	password: string;
}) {
	// fails if the user already exists
	const userOrFail = UserPersistService.getByUsername(username);
	if (userOrFail.isSuccess) {
		return Result.fail("username already exists in persist");
	}
	const hashedPassword = await bcrypt.hash(password, 10);
	const persistOrFail = UserPersistService.saveUser({
		username,
		hashedPassword,
	});
	if (persistOrFail.isFailure) {
		return Result.fail(persistOrFail.errMsg);
	}
	return Result.ok(username);
}
