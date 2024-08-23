import express from "express";
import cookieParser from "cookie-parser";
import { routerBlogs } from "./routers/routerBlogs";
import { routerPosts } from "./routers/routerPosts";
import { routerDeletDate } from "./routers/routerDeleteDate";
import { SETTINGS } from "./seting/seting";
import { routerUsers } from "./routers/routerUsers";
import { routerAuth } from "./routers/routerAuth";
import { routerComments } from "./routers/routerComments";
import { routerSecurity } from "./routers/routersecurity";


export const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(SETTINGS.PATH.BLOGS, routerBlogs());
app.use(SETTINGS.PATH.POSTS, routerPosts());
app.use(SETTINGS.PATH.USERS, routerUsers());
app.use(SETTINGS.PATH.COMMENTES, routerComments());
app.use(SETTINGS.PATH.AUTH, routerAuth());
app.use(SETTINGS.PATH.SECURITY, routerSecurity())
app.use(SETTINGS.PATH.ALLDATA, routerDeletDate());
