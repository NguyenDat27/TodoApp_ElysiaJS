import { checkUserExists, updateRefreshToken } from '@/commands/auth';
import { authModel } from '@/models/auth.model';
import { jwtAccessSetup, jwtRefreshSetup } from '@config/jwt.config';
import Elysia from 'elysia';
import { ERROR_MSG, SUCCESS_MSG } from 'lib/constant';
import prisma from 'lib/prisma';
import { HttpRes } from 'types/http-res';

type RefreshRes = {
	accessToken: string;
	refreshToken: string;
};

export const refresh = new Elysia()
	.use(jwtAccessSetup)
	.use(jwtRefreshSetup)
	.use(authModel)
	.post(
		'/refresh',
		async ({
			jwtAccess,
			jwtRefresh,
			query,
			error,
		}): HttpRes<RefreshRes> => {
			
			// get refresh token from user id
			const account = await prisma.account.findUnique({
				where: {
					user_id: query.id,
				},
				select: {
					refresh_token: true,
				},
			});
			// check if refresh token is valid
			if (!account || !account.refresh_token) {
				return error('Forbidden', { message: ERROR_MSG.REFRESH_TOKEN_INVALID });
			}

			const jwtPayload = await jwtRefresh.verify(account.refresh_token);
			if (!jwtPayload) {
				return error('Forbidden', { message: ERROR_MSG.REFRESH_TOKEN_EXPIRED });
			}
			const userId = jwtPayload.sub;

			// check if user id from token is valid
			const userCommand = await checkUserExists(userId!);
			if (!userCommand.data) {
				return error(userCommand.statusCode, { message: ERROR_MSG.USER_NOT_FOUND });
			}

			// create new access token
			const accessJWTToken = await jwtAccess.sign({
				sub: userCommand.data.user.id,
				iat: Date.now(),
			});

			// create new refresh token
			const refreshJWTToken = await jwtRefresh.sign({
				sub: userCommand.data.user.id,
				iat: Date.now(),
			});

			// update refresh token to database
			const updated = await updateRefreshToken(
				userCommand.data.user.id,
				refreshJWTToken
			);

			return {
				message: updated.message,
				data: {
					accessToken: accessJWTToken,
					refreshToken: refreshJWTToken,
				},
			};
		},
		{
			detail: ({
				summary: "Reset token",
				description: "Làm mới access token khi hết hạn",
				tags: ["Auth"]
			}),
			query: 'refreshQuery',
		}
	);
