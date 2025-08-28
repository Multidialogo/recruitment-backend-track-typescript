import type { Request, Response, NextFunction } from "express";
import { UserService } from "../service/user.service";
import { UserMapper } from "../mapper/user.mapper";

export class UserController {

  constructor(private readonly service = new UserService()) {}

  getUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const page = req.query.page ? Number(req.query.page) : 1;
      const pageSize = req.query.pageSize ? Number(req.query.pageSize) : 10;

      const result = await this.service.getAllUsers(
        UserMapper.toUserRequestToFilterDto(req),
        page,
        pageSize
      );

      res.setHeader("X-Total-Count", String(result.total));
      return res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  };

  getUserById = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    try {
      const user = await this.service.getUserById(BigInt(id));
      return res.status(200).json(user);
    } catch (err) {
      next(err);
    }
  };

  createUser = async (req: Request, res:Response, next: NextFunction) => {
    const userData = req.body;

    try {
      const newUser = await this.service.createUser(userData);
      res.status(201).json(newUser);
    } catch (error) {
      next(error)
    }
  }

  updateUser = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    try {
      const updatedUser = await this.service.updateUser(BigInt(id), req.body);
      res.status(200).json(updatedUser);
    } catch (error) {
      next(error);
    }
  }

  deleteUser = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    try {
      await this.service.deleteUser(BigInt(id));
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  } 
 
}
