import { Context } from "elysia";

interface JwtPayload {
  id: string;
  username: string;
}

interface JwtContext extends Context {
  jwt: {
    sign: (payload: object) => Promise<string>;
    verify: (token: string) => Promise<JwtPayload | null>;
  };
  header: Record<string, string | undefined>;
}

export const authMiddleware = async (headers: JwtContext["headers"], jwt: JwtContext['jwt']) => {
  const authHeader = headers['authorization'];
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return { 
          status: 401,
          message: "Authorization header không tồn tại hoặc không hợp lệ" 
      };
  }
  const token = authHeader.split(' ')[1];
  try {
    const payload = await jwt.verify(token);
    if (!payload) {
        return { 
            status: 401,
            message: "Token không hợp lệ"
        };
    }
    return { 
        status: 200,
        message: "Token hợp lệ"
    };
  } catch (error) {
    return { 
        status: 401,
        message: "Lỗi khi xác thực token"
    };
  }
}