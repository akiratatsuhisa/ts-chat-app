import "dotenv/config";
import { default as express, Application } from "express";
import { default as cors } from "cors";
import { default as cookieParser } from "cookie-parser";
import { default as bodyParser } from "body-parser";
import { default as swaggerUi, SwaggerUiOptions } from "swagger-ui-express";

import { authenticate, authorize } from "./middlewares/auth";
import { dbContext } from "./services/dbContext.service";
import { registerChatSocket, startSocketIo } from "./services/socket.service";

import { usersRouter } from "./controllers/users.controller";
import { chatRoomsRouter } from "./controllers/chatRoom.controller";

const PORT: number = parseInt(process.env.PORT as string, 10);

const swaggerOptions: SwaggerUiOptions = {
  explorer: true,
  swaggerOptions: {
    urls: [
      {
        url: "/swagger.v1.json",
        name: "Version 1",
      },
    ],
  },
};

(async () => {
  await dbContext();

  const app: Application = express();

  //app config
  app.use(express.static("public"));

  app.use(cors());
  app.use(cookieParser());
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));

  app.use("/api/*", authenticate);
  app.use(
    "/api/docs",
    swaggerUi.serve,
    swaggerUi.setup(undefined, swaggerOptions)
  );

  //app route
  app.use("/api/users", usersRouter);
  app.use("/api/chatRooms", authorize, chatRoomsRouter);

  // app run
  const server = app.listen(PORT, () => {
    console.log(`App listening at http://localhost:${PORT} 🚀`);
    console.log(`Api docs link http://localhost:${PORT}/api/docs 🛰`);
  });
  
  const io = startSocketIo(server);
  registerChatSocket(io.of("/chat"));
})().catch((error: Error) => console.error(error));
