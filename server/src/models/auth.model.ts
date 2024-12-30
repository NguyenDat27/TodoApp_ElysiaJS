import Elysia, { Static, t } from 'elysia';
import { ERROR_MSG } from 'lib/constant';

// register model
const registerModel = t.Object({
	full_name: t.String({
		minLength: 5,
		maxLength: 60,
		error: ERROR_MSG.NAME_INVALID,
		description: 'Họ tên đầy đủ',
	}, ),
	password: t.String({ 
		minLength: 6, 
		error: ERROR_MSG.PASSWORD_INVALID,
		description: 'Mật khẩu',
	}),
	phone_number: t.String({
		minLength: 10,
		maxLength: 10, 
		pattern: '^(0\\d{9})$',
		error: ERROR_MSG.PHONE_INVALID,
		description: 'Số điện thoại',
	}),
});

export type TRegisterModel = Static<typeof registerModel>;

// login model
const loginModel = t.Object({
	phone_number: t.String({ 
		minLength: 10,
		maxLength: 13,
		error: ERROR_MSG.PHONE_INVALID ,
		description: 'Số điện thoại đã đăng ký' }),
	password: t.String({
		minLength: 6,
		error: ERROR_MSG.PASSWORD_INVALID,
		description: 'Mật khẩu',
	}),
});

export type TLoginModel = Static<typeof loginModel>;

// refresh query
const refreshQuery = t.Object({
	id: t.String({
		error: ERROR_MSG.USER_ID_INVALID,
		description: 'id của người dùng',
	}),
});


const changePassword = t.Object({
	oldPass: t.String({
		minLength: 6, 
		error: ERROR_MSG.PASSWORD_INVALID,
		description: 'Mật khẩu cũ',
	}),
	newPass: t.String({
		minLength: 6, 
		error: ERROR_MSG.PASSWORD_INVALID,
		description: 'Mật khẩu mới',
	}),
})

export type TChangePassModel = Static<typeof changePassword>

// export all
export const authModel = new Elysia().model({
	registerModel: registerModel,
	loginModel: loginModel,
	refreshQuery: refreshQuery,
	changePassword: changePassword,
});
