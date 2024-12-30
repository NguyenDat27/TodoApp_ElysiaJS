import Elysia from 'elysia';
import { ERROR_MSG } from 'lib/constant';

export const errorMiddleware = (app: Elysia) =>
    app.onError(({ error, code }) => {
        
        console.error('Global Error:', error);
        return {
            code: code,
            message: ERROR_MSG.SOMETHING_WENT_WRONG,
            data: null,
        };
    });