import { authMiddleware } from '@/middlewares/auth-middleware';
import Elysia from 'elysia';
import { SUCCESS_MSG } from 'lib/constant';
import { HttpRes } from 'types/http-res';

const me = new Elysia({ prefix: '/me' })
	.use(authMiddleware)
	.get('/', 
		async ({ user }): HttpRes<{ user: userRes }> => {
		return {
			message: SUCCESS_MSG.SUCCESSFUL,
			data: {
				user,
			},
		};
	}, {
		detail: ({
			summary: "Xem thông tin",
			description: "Hiển thị thông tin của người dùng",
			tags: ["User"]
		})
	}	
);

export default me;
