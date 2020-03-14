import { Result } from "../utils/Result";

type UserType = {
	username: string;
	hashedPassword: string;
};

const userList = [] as UserType[];

export function getByUsername(username: string) {
	const userOrUndefined = userList.find(user => user.username === username);
	if (userOrUndefined === undefined) {
		return Result.fail("username could not be found in userlist");
	}
	return Result.ok(userOrUndefined);
}

export function saveUser(user: UserType) {
	userList.push(user);
	console.info(`user added to persist: ${user.username}`);
	return Result.ok();
}
