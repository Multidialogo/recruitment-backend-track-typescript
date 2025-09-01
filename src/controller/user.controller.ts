import type { Request, Response, NextFunction } from "express";
import { UserServiceImpl } from "../service/user.service.impl";
import { UserMapper } from "../mapper/user.mapper";
import {logger} from "../shared/logger";

export class UserController {

  constructor(private readonly service = new UserServiceImpl()) {}

  private log = logger.child({ module: "UserController" });

  getUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const page = req.query.page ? Number(req.query.page) : 1;
      const pageSize = req.query.pageSize ? Number(req.query.pageSize) : 10;

      this.log.debug("retrieve all users...")
      const result = await this.service.getAllUsers(
        UserMapper.fromUserRequestToFilterDto(req),
        page,
        pageSize
      );
      this.log.debug("retrieve all users = OK")

      res.setHeader("X-Total-Count", String(result.total));
      this.log.debug("result ="+ result.total);
      return res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  };

  createUser = async (req: Request, res: Response, next: NextFunction) => {
    const userData = req.body;

    try {
      this.log.debug("retrieve create a new user...");
      const newUser = await this.service.createUser(userData);
      this.log.debug("user created =>" + newUser.id);
      res.status(201).json(newUser);
    } catch (error) {
      this.log.error(error);
      next(error);
    }
  };

  getUserById = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    try {
      this.log.debug("retrieve user by id ...");
      const user = await this.service.getUserById(UserMapper.convertId(id));
      this.log.debug("user retrieved =>" + user);
      return res.status(200).json(user);
    } catch (error) {
      this.log.error(error);
      next(error);
    }
  };

  updateUserById = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    try {
      this.log.debug("update user by id ...");
      const updatedUser = await this.service.updateUser(
        UserMapper.convertId(id),
        UserMapper.fromUserUpdateRequestToDto(req.body)
      );
      this.log.debug("user updated => "+ updatedUser.id);
      res.status(200).json(updatedUser);
    } catch (error) {
      this.log.error(error);
      next(error);
    }
  };

  patchUserById = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    try {
      this.log.debug("update user by id ...");
      const updatedUser = await this.service.patchUser(
        UserMapper.convertId(id),
        UserMapper.fromUserPatchRequestToDto(req.body)
      );
      this.log.debug("user updated => "+ updatedUser.id);
      res.status(200).json(updatedUser);
    } catch (error) {
      this.log.error(error);
      next(error);
    }
  };

  deleteUserById = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    try {
      this.log.debug("delete user by id ...");
      await this.service.deleteUser(UserMapper.convertId(id));
      this.log.debug("user deleted");
      res.status(204).send();
    } catch (error) {
      this.log.error(error);
      next(error);
    }
  };
}
