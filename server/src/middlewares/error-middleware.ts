import Elysia from 'elysia';
import { ERROR_MSG } from 'lib/constant';

export const errorMiddleware = (app: Elysia) =>
    app.onError(({ error, set }) => {
        console.error('Global Error:', error);

        set.status = 500;
        return {
            message: ERROR_MSG.SOMETHING_WENT_WRONG,
            data: null,
        };
    });