import Elysia from 'elysia';
import { authMiddleware } from '@/middlewares/auth-middleware';
import { passwordChangeCommand } from '@/commands/auth/password.command';
import { ERROR_MSG } from 'lib/constant';
import { HttpRes } from 'types/http-res';
import { authModel, TChangePassModel } from '@/models/auth.model';

type passRes = {
    id: string;
};

export const changePassword = new Elysia()
    .use(authModel)
    .use(authMiddleware)
    .post('/password', 
        async ({ body, user, set, error }): HttpRes<passRes> => {

        if (!user) {
            return error('Unauthorized', { message: ERROR_MSG.UNAUTHORIZED });
        }

        const passwordChangeCommandRes = await passwordChangeCommand(user.id, body);

        set.status = passwordChangeCommandRes.statusCode;
        return {
            message: passwordChangeCommandRes.message,
            data: null,
        };
    }, {
        detail: ({
            summary: "Đổi mật khẩu",
            description: "Đổi mật khẩu của người dùng",
            tags: ["Auth"]
        }),

        body: 'changePassword',
    }
);