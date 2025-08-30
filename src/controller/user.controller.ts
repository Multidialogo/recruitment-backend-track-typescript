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
        UserMapper.fromUserRequestToFilterDto(req),
        page,
        pageSize
      );

      res.setHeader("X-Total-Count", String(result.total));
      return res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  };


  createUser = async (req: Request, res: Response, next: NextFunction) => {
    const userData = req.body;

    try {
      const newUser = await this.service.createUser(userData);
      res.status(201).json(newUser);
    } catch (error) {
      next(error);
    }
  };


  getUserById = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    try {
      const user = await this.service.getUserById(UserMapper.convertId(id));
      return res.status(200).json(user);
    } catch (err) {
      next(err);
    }
  };

  updateUserById = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    try {
      const updatedUser = await this.service.updateUser(
        UserMapper.convertId(id),
        UserMapper.fromUserUpdateRequestToDto(req.body)
      );
      res.status(200).json(updatedUser);
    } catch (error) {
      next(error);
    }
  };

  patchUserById = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    try {
      const updatedUser = await this.service.patchUser(
        UserMapper.convertId(id),
        UserMapper.fromUserPatchRequestToDto(req.body)
      );
      res.status(200).json(updatedUser);
    } catch (error) {
      next(error);
    }
  };

  deleteUserById = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    try {
      await this.service.deleteUser(UserMapper.convertId(id));
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };

}