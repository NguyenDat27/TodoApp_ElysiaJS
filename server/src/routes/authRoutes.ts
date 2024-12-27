import { Elysia, t, Context, Cookie } from "elysia";
import bcrypt from "bcrypt";
import User from '../models/user';
import { authMiddleware } from "../middlewares/middlewares";

interface RegisterBody {
  username: string;
  password: string;
}

interface LoginBody {
  username: string;
  password: string;
}

interface JwtPayload {
  id: string;
  username: string;
}

interface JwtContext extends Context {
  jwt: {
    sign: (payload: object) => Promise<string>;
    verify: (token: string) => Promise<JwtPayload | null>;
  };
  cookie: Record<string, Cookie<string | undefined>>;
  header: Record<string, string | undefined>;
}

const AuthRoutes = new Elysia();

AuthRoutes.group("/api/v1/auth", (AuthRoutes) =>
  AuthRoutes

    // Đăng ký
    .post("/register", async ({ body, set }: { body: RegisterBody, set: { status: number } }) => {
      const { username, password } = body;
      try {
        // Kiểm tra xem username đã tồn tại chưa
        const existingUser = await User.findOne({ username });
        if (existingUser) {
          set.status = 409;
          return { 
            status: 409,
            message: "Tên tài khoản đã tồn tại" 
          };
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, password: hashedPassword });
        await newUser.save();
        set.status = 201;
        return { 
          status: 201,
          message: "Đăng ký thành công" 
        };
      } catch (err) {
        set.status = 500;
        return { 
          status: 500,
          message: "Lỗi mạng nội bộ" 
        };
      }
    }, {
      detail: {
        summary: "Đăng ký người dùng mới",
        tags: ["Auth"]
      },
      body: t.Object({
        username: t.String({ description: "Tài khoản của người dùng mới" }),
        password: t.String({ description: "Mật khẩu của người dùng mới" }),
      })
    })

    // Đăng nhập
    .post("/login", async ({ body, set, jwt, cookie: { auth } }: { body: LoginBody, set: { status: number }, jwt: JwtContext['jwt'], cookie: JwtContext["cookie"] }) => {
      const { username, password } = body;
      try {
        const user = await User.findOne({ username });
        if (!user) {
          set.status = 404;
          return { 
            status: 404,
            message: "Tài khoản không tồn tại" 
          };
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          set.status = 401;
          return { 
            status: 401,
            message: "Sai mật khẩu!!!" 
          };
        }
        const token = await jwt.sign({ id: user._id, username: user.username });
        auth.set({
          value: token,
          httpOnly: true,
          maxAge: 7 * 86400,
          path: '/',
        });
        set.status = 200;
        return { 
          status: 200,
          token: token,
         };
      } catch (err) {
        set.status = 500;
        return {
          status: 500,
          message: "Lỗi mạng nội bộ" 
        };
      }
    }, {
      detail: {
        summary: "Đăng nhập người dùng",
        tags: ["Auth"]
      },
      body: t.Object({
        username: t.String({ description: "Tài khoản người dùng" }),
        password: t.String({ description: "Mật khẩu người dùng" }),
      })
    })

    // Đăng xuất
    .post("/logout", async ({ set, jwt, headers, cookie: { auth } }: { set: { status: number }, jwt: JwtContext['jwt'], headers: JwtContext["headers"], cookie: JwtContext["cookie"] }) => {
      try {
        const authResult = await authMiddleware(headers, jwt);
        if (authResult.status !== 200) {
          set.status = authResult.status;
          return authResult;
        } else {
          // Xóa cookie
          auth.set({
            value: '',
            httpOnly: true,
            maxAge: 0,
            path: '/',
          });
          set.status = 200;
          return { 
            status: 200,
            message: "Đăng xuất thành công" };
        }      
      } catch (err) {
        set.status = 500;
        return {
          status: 500,
          message: "Lỗi mạng nội bộ" 
        };
      }
    }, {
      detail: {
        summary: "Đăng xuất người dùng",
        tags: ["Auth"]
      }
    })
);

export default AuthRoutes;