import { Elysia } from 'elysia';
import auth from './routes/auth';
import me from './routes/me';
import cors from "@elysiajs/cors";
import swagger from "@elysiajs/swagger";
import { errorMiddleware } from './middlewares/error-middleware';

const port = Bun.env.PORT || 3000;

const app = new Elysia()
	.use(
		swagger({
		path: '/v1/swagger',
		documentation: {
			info: {
			title: 'TODO APP',
			version: '1.0.0',
			},
			components: {
			securitySchemes: {
				bearerAuth: {
				type: 'http',
				scheme: 'bearer',
				bearerFormat: 'JWT',
				},
			},
			},
			security: [{
			bearerAuth: [],
			}],
		},
		})
	)
	.use(cors())
	.use(auth)
	.use(me)
	.use(errorMiddleware);

app.listen(port, () => {
	console.log(`🦊 Elysia is running at ${app.server?.hostname}:${port}`);
});
