import { TLoginModel } from '@/models/auth.model';
import { ERROR_MSG, SUCCESS_MSG } from 'lib/constant';
import prisma from 'lib/prisma';
import { CommandRes } from 'types/commands';

type loginCommandRes = {
	user_id: string;
} | null;

export async function loginCommand(body: TLoginModel): CommandRes<loginCommandRes> {
	// Kiểm tra số điện thoại tồn tại
	if (body.password.length < 6) {
        return {
            statusCode: 'Bad Request',
            message: ERROR_MSG.PASSWORD_INVALID,
            data: null,
        };
    }

	const account = await prisma.account.findUnique({
		where: {
			phone_number: body.phone_number,
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

	// Kiểm tra khớp mật khẩu
	const matchPassword = await Bun.password.verify(
		body.password,
		account.password,
		'argon2id'
	);

	if (!matchPassword) {
		return {
			statusCode: 'Method Not Allowed',
			message: ERROR_MSG.ACCOUNT_INCORRECT,
			data: null,
		};
	}

	return {
		statusCode: 'OK',
		message: SUCCESS_MSG.LOGIN,
		data: {
			user_id: account.user_id,
		},
	};
}
