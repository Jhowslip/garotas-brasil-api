import { Router } from "express";
import UserController from "./controllers/UserController";
import SessionController from "./controllers/SessionController";
import ProfileController from "./controllers/ProfileController";
import FeedBackController from "./controllers/FeedBackController";
import PlanController from "./controllers/PlanController";

const routes = Router();

routes.post("/users", UserController.store);
routes.post("/upload", UserController.upload);
routes.post("/uploadVideos", UserController.uploadVideos);
routes.post("/sessions", SessionController.store);
routes.post("/feedback", FeedBackController.store);
routes.post("/plan", PlanController.store);
routes.get("/plan", PlanController.getAll);
routes.get("/feedback", FeedBackController.getAll);
routes.post("/feedback", FeedBackController.store);
routes.get("/feedback/:id", FeedBackController.getByProfileId);
routes.get("/profiles", ProfileController.getAll);
routes.put("/profiles", ProfileController.update);
routes.get("/profiles/:id", ProfileController.getById);
routes.post("/users", UserController.update);
routes.get("/users", UserController.getAll);

export default routes;
