import { TChangePassModel } from '@/models/auth.model';
import { ERROR_MSG, SUCCESS_MSG } from 'lib/constant';
import prisma from 'lib/prisma';
import { CommandRes } from 'types/commands';

type passCommandRes = {
    user_id: string;
} | null;

export async function passwordChangeCommand(user_id: string, body: TChangePassModel): CommandRes<passCommandRes> {
    // Kiểm tra người dùng tồn tại

    const account = await prisma.account.findUnique({
        where: {
            user_id: user_id,
        },
        select: {
            user_id: true,
            password: true,
        },
    });

    if (!account) {
        return {
            statusCode: 'Bad Request',
            message: ERROR_MSG.ACCOUNT_INCORRECT,
            data: null,
        };
    }

    // Kiểm tra khớp mật khẩu cũ
    const matchPassword = await Bun.password.verify(
        body.oldPass,
        account.password,
        'argon2id'
    );

    if (!matchPassword) {
        return {
            statusCode: 'Unauthorized',
            message: ERROR_MSG.PASSWORD_INCORRECT,
            data: null,
        };
    }

    // Mã hóa mật khẩu mới
    const hashedNewPassword = await Bun.password.hash(body.newPass, {
        algorithm: 'argon2id'
    });

    // Cập nhật mật khẩu mới
    await prisma.account.update({
        where: {
            user_id: user_id,
        },
        data: {
            password: hashedNewPassword,
        },
    });

    return {
        statusCode: 'OK',
        message: SUCCESS_MSG.PASSWORD_CHANGED,
        data: {
            user_id: account.user_id,
        },
    };
}