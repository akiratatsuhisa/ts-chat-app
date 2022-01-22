import { IRouter, Request, Response, Router } from "express";
import { body, param, validationResult } from "express-validator";
import {
  ForbiddenResponse,
  IErrorModelMessageResponse,
  NotFoundResponse,
} from "../helpers/constant";
import { ChatRoom } from "../models/ChatRoom.model";

export const chatRoomsRouter: IRouter = Router();

chatRoomsRouter.get("/", async (req: Request, res: Response) => {
  const chatRooms = await ChatRoom.find({});
  res.status(200).json(chatRooms);
});

chatRoomsRouter.get(
  "/:id",
  param("id").notEmpty(),
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: "Request is invalid.",
        errors: errors.array(),
      } as IErrorModelMessageResponse);
    }

    if (!(await ChatRoom.hasUserInRoom(req.params.id, req.user?.id))) {
      return res.status(403).json(ForbiddenResponse);
    }

    const chatRoom = await ChatRoom.findById(req.params.id);
    if (!chatRoom) {
      return res.status(404).json(NotFoundResponse);
    }

    res.status(200).json(chatRoom);
  }
);

const chatRoomCreateValidationChains = [body("name").notEmpty()];

chatRoomsRouter.post(
  "/",
  chatRoomCreateValidationChains,
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: "Request is invalid.",
        errors: errors.array(),
      } as IErrorModelMessageResponse);
    }

    const { name } = req.body;

    const chatRoom = new ChatRoom({ name, users: req.user?.id });
    await chatRoom.save();
    res.status(201).json(chatRoom);
  }
);

const chatRoomUpdateValidationChains = [
  param("id").notEmpty(),
  body("name").notEmpty(),
];

chatRoomsRouter.put(
  "/:id",
  chatRoomUpdateValidationChains,
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: "Request is invalid.",
        errors: errors.array(),
      } as IErrorModelMessageResponse);
    }

    const { id } = req.params;

    if (!(await ChatRoom.hasUserInRoom(id, req.user?.id))) {
      return res.status(404).json(ForbiddenResponse);
    }

    const { name } = req.body;

    const chatRoom = await ChatRoom.findByIdAndUpdate(
      id,
      {
        name,
        users: req.user?.id,
      },
      { new: true }
    );

    if (!chatRoom) {
      return res.status(403).json(NotFoundResponse);
    }
    res.status(200).json(chatRoom);
  }
);

const chatRoomDeleteValidationChains = [param("id").notEmpty()];

chatRoomsRouter.delete(
  "/:id",
  chatRoomDeleteValidationChains,
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: "Request is invalid.",
        errors: errors.array(),
      } as IErrorModelMessageResponse);
    }

    const { id } = req.params;

    if (!(await ChatRoom.hasUserInRoom(id, req.user?.id))) {
      return res.status(403).json(ForbiddenResponse);
    }

    const chatRoom = await ChatRoom.findByIdAndDelete(id);

    if (!chatRoom) {
      return res.status(404).json(NotFoundResponse);
    }
    res.status(200).json(chatRoom);
  }
);
