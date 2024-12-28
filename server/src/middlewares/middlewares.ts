import { Context, Cookie } from "elysia";
import User from '../models/user';

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
  authid: Cookie<string | undefined>;
  header: Record<string, string | undefined>;
}

export const authMiddleware = async (headers: JwtContext["header"], jwtAccessToken: JwtContext["jwtAccessToken"], jwtRefreshToken: JwtContext["jwtRefreshToken"], auth: JwtContext["authid"], id: JwtContext["authid"]) => {
  const authHeader = headers['authorization'];
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return { 
      status: 401,
      payload: null,
      message: "Authorization header không tồn tại hoặc không hợp lệ" 
    };
  }
  const accessToken = authHeader.split(' ')[1];

  if (accessToken === "YOUR_SECRET_TOKEN") {
    return { 
      status: 401,
      payload: null,
      message: "Token không tồn tại trong Authorization header" 
    };
  }

  try {

    const payloadAccess = await jwtAccessToken.verify(accessToken);
    if (!payloadAccess) {

      // Kiểm tra user trong cơ sở dữ liệu
      const userId = id.value ? id.value.replace(/"/g, '') : '';
      const user = await User.findById(userId);
      if (!user || !user.refreshToken) {
        return { 
          status: 404,
          payload: null,
          message: "Không tìm thấy thông tin người dùng, hãy đăng nhập lại"
        };
      }

      // Kiem tra refresh token
      const payloadRefresh = await jwtRefreshToken.verify(user.refreshToken.toString());
      if (!payloadRefresh) {
        return { 
          status: 401,
          payload: null,
          message: "Phiên đăng nhập hết hạn, hãy đăng nhập lại"
        };
      }

      // Tạo mới access token
      const newAccessToken = await jwtAccessToken.sign({ id: user._id, username: user.username });
      auth.set({
        value: newAccessToken,
        httpOnly: true,
        maxAge: 1 * 60 * 60, // 1 hour
      });

      const payloadAccess = await jwtAccessToken.verify(newAccessToken);

      return { 
        status: 200,
        payload: payloadAccess,
        message: "Access token mới đã được tạo"
      };
    } else {
      return { 
        status: 200,
        payload: payloadAccess,
        message: "Access token hợp lệ"
      };
    }
  } catch (error) {
    return { 
      status: 401,
      payload: null,
      message: "Lỗi khi xác thực access token, hãy đăng nhập lại"
    };
  }
};