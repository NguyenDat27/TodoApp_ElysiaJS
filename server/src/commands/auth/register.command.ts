import { TRegisterModel } from '@/models/auth.model';
import { ERROR_MSG, SUCCESS_MSG } from 'lib/constant';
import prisma from 'lib/prisma';
import { CommandRes } from 'types/commands';

export async function registerCommand(
	body: TRegisterModel
): CommandRes<{ id: string }> {
	const { password, phone_number, full_name } = body;
	// Check if account is already registered

	if (body.password.length < 6) {
        return {
            statusCode: 'Bad Request',
            message: ERROR_MSG.PASSWORD_INVALID,
            data: null,
        };
    }


	const accountExists = await prisma.account.findUnique({
		where: {
			phone_number,
		},
		select: {
			id: true,
		},
	});
	if (accountExists) {
		return {
			statusCode: 'Conflict',
			message: ERROR_MSG.PHONE_DUPLICATE,
			data: null,
		};
	}

	// Encrypt password
	const hashedPassword = await Bun.password.hash(password, {
		algorithm: 'argon2id'
	});

	// Create new account and user
	const account = await prisma.account.create({
		data: {
			phone_number,
			password: hashedPassword,
			user: {
				create: {
					full_name,
					phone_number,
				},
			},
		},
		select: {
			id: true,
		},
	});

	return {
		statusCode: 'Created',
		message: SUCCESS_MSG.REGISTER,
		data: { id: account.id },
	};
}
