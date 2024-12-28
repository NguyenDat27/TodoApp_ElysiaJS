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

interface ChangePasswordBody {
  oldPassword: string;
  newPassword: string;
}

interface JwtPayload {
  id: string;
  username: string;
}

interface JwtContext extends Context {
  jwtAccessToken: {
    sign: (payload: object, options?: object) => Promise<string>;
    verify: (token: string) => Promise<JwtPayload | null>;
  };
  jwtRefreshToken: {
    sign: (payload: object, options?: object) => Promise<string>;
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
        console.log(err);
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
    .post("/login", async ({ body, set, jwtAccessToken, jwtRefreshToken, cookie: { auth, id } }: { body: LoginBody, set: { status: number }, jwtAccessToken: JwtContext['jwtAccessToken'], jwtRefreshToken: JwtContext['jwtRefreshToken'], cookie: JwtContext["cookie"] }) => {
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
        const accessToken = await jwtAccessToken.sign({ id: user._id, username: user.username });
        const refreshToken = await jwtRefreshToken.sign({ id: user._id, username: user.username });

        // Lưu refresh token vào cơ sở dữ liệu
        user.refreshToken = refreshToken;
        await user.save();

        // Lưu accessToken vào cookies
        auth.set({
          value: accessToken,
          httpOnly: true,
          maxAge: 1 * 60 * 60, // 1 hour
        });

        id.set({
          value: user._id,
          httpOnly: true,
          maxAge:  7 * 24 * 60 * 60, // 7 days
        })

        set.status = 200;
        return { 
          status: 200,
          accessToken: accessToken,
          message: "Đăng nhập thành công"
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
    .post("/logout", async ({ set, jwtAccessToken, jwtRefreshToken, headers, cookie: { auth, id } }: { set: { status: number }, jwtAccessToken: JwtContext['jwtAccessToken'], jwtRefreshToken: JwtContext["jwtRefreshToken"], headers: JwtContext["headers"], cookie: JwtContext["cookie"] }) => {
      try {
        const authResult = await authMiddleware(headers, jwtAccessToken, jwtRefreshToken, auth, id );
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
          id.set({
            value: '',
            httpOnly: true,
            maxAge: 0,
            path: '/',
          });
          set.status = 200;
          return { 
            status: 200,
            message: "Đăng xuất thành công"
          };
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
      },
    })

    //Đổi mật khẩu
    .post("/change-password", async ({ body, set, jwtAccessToken, jwtRefreshToken, headers, cookie: { auth, id} }: { body: ChangePasswordBody, set: { status: number }, jwtAccessToken: JwtContext['jwtAccessToken'], jwtRefreshToken: JwtContext["jwtRefreshToken"], headers: JwtContext["headers"], cookie: JwtContext["cookie"] }) => {
      const { oldPassword, newPassword } = body;
      try {
        const authResult = await authMiddleware(headers, jwtAccessToken, jwtRefreshToken, auth, id);
        if (authResult.status !== 200) {
          set.status = authResult.status;
          return authResult;
        }

        const payload = authResult.payload;
        console.log("Payload", payload);
        
        if (payload) {
          const user = await User.findById(payload.id);
          if (!user) {
            set.status = 404;
            return { 
              status: 404,
              message: "Người dùng không tồn tại" 
            };
          }

          const isMatch = await bcrypt.compare(oldPassword, user.password);
          if (!isMatch) {
            set.status = 400;
            return { 
              status: 400,
              message: "Mật khẩu cũ không đúng" 
            };
          }

          const hashedNewPassword = await bcrypt.hash(newPassword, 10);
          user.password = hashedNewPassword;
          await user.save();

          set.status = 200;
          return { 
            status: 200,
            message: "Đổi mật khẩu thành công" 
          };
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
        summary: "Đổi mật khẩu người dùng",
        tags: ["Auth"]
      }, 
      body: t.Object({
        oldPassword: t.String({ description: "Mật khẩu cũ của người dùng" }),
        newPassword: t.String({ description: "Mật khẩu mới của người dùng" }),
      })
    })
);

export default AuthRoutes;