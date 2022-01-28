import { IRouter, Request, Response, Router } from "express";
import { oneOf, param, body, validationResult, query } from "express-validator";
import { generateJwtToken } from "../services/auth.service";
import { IUser, IUserDocument, User } from "../models/User.model";
import {
  IErrorModelMessageResponse,
  IDefaultMessageResponse,
  NotFoundResponse,
} from "../helpers/constant";
import { authorize } from "../middlewares/auth";
import { Types } from "mongoose";

export const usersRouter: IRouter = Router();

const userListValidationChains = [
  oneOf([query("cursor").isString(), query("size").isEmpty()]),
  oneOf([query("size").isInt({ min: 10, max: 100 }), query("size").isEmpty()]),
];

usersRouter.get(
  "/",
  authorize,
  userListValidationChains,
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: "Request model is invalid.",
        errors: errors.array(),
      } as IErrorModelMessageResponse);
    }

    const cursor = req.query?.cursor as string;
    const size = parseInt(req.query?.size as string, 10) || 10;
    const { search } = req.query;

    const users = await User.find(
      !search ? {} : { displayName: new RegExp(`.*${search}.*`, "i") }
    )
      .find(!cursor ? {} : { _id: { $lt: new Types.ObjectId(cursor) } })
      .sort({ createdAt: -1 })
      .limit(size);
    res.status(200).json(users);
  }
);

usersRouter.get(
  "/:id",
  authorize,
  param("id").notEmpty(),
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: "Request model is invalid.",
        errors: errors.array(),
      } as IErrorModelMessageResponse);
    }

    const { id } = req.params;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json(NotFoundResponse);
    }

    res.status(200).json(user);
  }
);

const registerValidationChains = [
  body("username").trim().isLength({ min: 3, max: 32 }),
  body("displayName").trim().isLength({ min: 3, max: 32 }),
  oneOf([body("email").isEmpty(), body("email").isEmail()]),
  body("password").isLength({ min: 3, max: 32 }),
];

usersRouter.post(
  "/register",
  registerValidationChains,
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: "Request model is invalid.",
        errors: errors.array(),
      } as IErrorModelMessageResponse);
    }

    try {
      const { username, email, displayName, password } = req.body as IUser;

      const user = new User({ username, email, displayName });
      await user.setPassword(password);
      await user.save();
      await user.generateAvatar();
      res
        .status(201)
        .json({ message: "Register successfully." } as IDefaultMessageResponse);
    } catch (e) {
      console.log(e);
      res
        .status(400)
        .json({ message: "Register failed." } as IDefaultMessageResponse);
    }
  }
);

const loginValidationChains = [
  body("username").notEmpty(),
  body("password").notEmpty(),
];

usersRouter.post(
  "/login",
  loginValidationChains,
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: "Request model is invalid.",
        errors: errors.array(),
      } as IErrorModelMessageResponse);
    }

    try {
      const { username, password } = req.body as IUser;

      const user = await User.findByUsername(username).select("+password");
      if (!(await user?.checkPassword(password)))
        return res.status(400).json({
          message: "Username or password is invalid.",
        } as IDefaultMessageResponse);

      res.status(200).json({
        message: "Login successfully.",
        token: generateJwtToken(user),
      });
    } catch {
      res
        .status(400)
        .json({ message: "Login failed." } as IDefaultMessageResponse);
    }
  }
);
