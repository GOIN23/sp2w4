import dotenv from "dotenv";
dotenv.config();

export const SETTINGS = {
  PORT: process.env.PORT || 3004,
  JWT_SECRET: "123",
  PATH: {
    BLOGS: "/api/blogs",
    POSTS: "/api/posts",
    ALLDATA: "/api/testing/all-data",
    USERS: "/api/users",
    AUTH: "/api/auth",
    COMMENTES: "/api/comments",
    SECURITY:"/api/security"
  },
  HTTPCOD: {
    HTTPCOD_200: 200,
    HTTPCOD_201: 201,
    HTTPCOD_202: 202,
    HTTPCOD_400: 400,
    HTTPCOD_404: 404,
    HTTPCOD_204: 204,
    HTTPCOD_401: 401,
    HTTPCOD_403: 403,
  },
  MONGO_URL: process.env.MONGO_URL || "mongodb://localhost:27017",
  DB_NAME: "page",
  DB_TEST: "test",
  BLOG_COLLECTION_NAME: "blogs",
  POST_COLLECTION_NAME: "posts",
  USER_COLLECTION_NAME: "users",
  COMMENT_COLLECTION_NAME: "comments",
  REFRESH_TOKEN_BLACK_LIST: "refreshToken",
  CUSTOM_RATEL_LIMIT: "customRateLimit",
  SESION_USER:"sesionUser"
};
