import Elysia from 'elysia';
import { register } from './register';
import { login } from './login';
import { logOut } from './logout';
import { refresh } from './refresh';
import { changePassword } from './password';

const auth = new Elysia({
	prefix: '/api/v1/auth',
})
	.use(register)
	.use(login)
	.use(logOut)
	.use(refresh)
	.use(changePassword);

export default auth;
