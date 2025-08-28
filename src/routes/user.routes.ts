import { Router } from "express";
import { UserController } from "../controller/user.controller";
import { verifyToken, requireRole} from "../middleware/auth";

export function buildUserRouter() {
  const router = Router();
  const controller = new UserController();

  router.get("/",  verifyToken, controller.getUsers);
  router.post("/", verifyToken, requireRole, controller.createUser);
  router.get("/:id", verifyToken, controller.getUserById);
  router.put("/:id", verifyToken, controller.updateUser);
  router.delete("/:id", verifyToken, requireRole, controller.deleteUser);

  return router;
}
