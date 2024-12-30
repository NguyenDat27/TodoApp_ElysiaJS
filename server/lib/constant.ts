
export const ERROR_MSG = {
	NAME_INVALID: 'Nhập tên phải từ 5 - 60 ký tự',
	PASSWORD_INVALID: 'Mật khẩu chứa ít nhất 6 ký tự',
	PHONE_INVALID: 'Số điện thoại phải có 10 chữ số và bắt đầu bằng 0',
	PHONE_DUPLICATE: 'Số điện thoại này đã có người đăng ký',
	ACCOUNT_INCORRECT: 'Thông tin tài khoản mật khẩu không chính xác',
	USER_NOT_FOUND: 'Không tìm thấy thông tin người dùng',
	ADMIN_NOT_FOUND: 'Không tìm thấy thông tin admin',
	USER_ID_INVALID: 'ID người dùng không hợp lệ',
	PASSWORD_INCORRECT: 'Mât khẩu không chính xác',

	
	// TOKEN
	ACCESS_TOKEN_INVALID: 'Access token không hợp lệ',
	REFRESH_TOKEN_INVALID: 'Refresh token không hợp lệ',
	REFRESH_TOKEN_EXPIRED: 'Phiên đăng nhập hết hạn! Vui lòng đăng nhập lại',
	MAX_ATTEMPTS_EXCEEDED: 'Đã vượt quá số lần tối đa.',

	// HTTP CODE
	SOMETHING_WENT_WRONG: 'Đã xảy ra lỗi.',
	UNAUTHORIZED: 'Lỗi xác thực quyền người dùng',
	TOKEN_INVALID: 'Token không hợp lệ',
	BAD_REQUEST: 'Yêu cầu không hợp lệ',
	CONFLICT: 'Xảy ra xung đột',
};

export const SUCCESS_MSG = {
	SUCCESSFUL: 'Thành công',
	LOGIN: 'Đăng nhập thành công',
	REGISTER: 'Đăng ký thành công',
	LOGOUT: 'Đăng xuất thành công',
	PASSWORD_CHANGED: 'Đổi mật khẩu thành công',
	ACCESS_TOKEN: 'Tạo access token thành công',
};
