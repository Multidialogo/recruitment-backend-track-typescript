import { Router } from "express";
import { UserController } from "../controller/user.controller";
import { verifyToken, requireRole} from "../middleware/auth";
import { UserRole } from "../api/dto";

export function buildUserRouter() {
  const router = Router();
  const controller = new UserController();

  router.get("/",  verifyToken, controller.getUsers);
  router.post("/", verifyToken, requireRole(UserRole.ADMIN), controller.createUser);
  router.get("/:id", verifyToken, controller.getUserById);
  router.patch("/:id", verifyToken, controller.patchUserById);
  router.put("/:id", verifyToken, requireRole(UserRole.ADMIN), controller.updateUserById);
  router.delete("/:id", verifyToken, requireRole(UserRole.ADMIN), controller.deleteUserById);
  return router;
}
