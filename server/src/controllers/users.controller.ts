import { IRouter, Request, Response, Router } from "express";
import { oneOf, body, validationResult } from "express-validator";
import { generateJwtToken } from "../services/auth.service";
import { IUser, User } from "../models/User.model";
import {
  IErrorModelMessageResponse,
  IDefaultMessageResponse,
} from "../helpers/constant";

export const usersRouter: IRouter = Router();

const registerValidationChains = [
  body("username").isLength({ min: 3, max: 32 }),
  oneOf([body("email").isEmpty(), body("email").isEmail()]),
  body("displayName").isLength({ min: 3, max: 32 }),
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

      const user = await User.findByUsername(username);
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
