import User, { User as UserModel } from "../database/schemas/User";
import RegistrationFailedException from "../exceptions/RegistrationFailedException";
import UserController from "../constants/UserController";
import ResourceNotFoundException from "../exceptions/ResourceNotFoundException";
import AuthConstants from "../constants/AuthConstants";
import BusinessException from "../exceptions/BusinessException";
import UpdateFailedException from "../exceptions/UpdateFailedException";
import DeleteFailedException from "../exceptions/DeleteFailedException";

export default class UserRepository {
  public async create(user: UserModel) {
    const userDataBase = await User.findOne({ state: user.state });
    if (!userDataBase) {
      try {
        const userCreated = await User.create(user);
        return userCreated;
      } catch (err) {
        throw new RegistrationFailedException(
          UserController.UNPROCESSABLE_ENTITY
        );
      }
    } else {
      try {
        const userUpdated = await this.update(user);
        return userUpdated;
      } catch (err) {
        throw new RegistrationFailedException(
          UserController.UNPROCESSABLE_ENTITY
        );
      }
    }
  }

  public async update(user: UserModel) {
    try {
      const { state } = user;
      const userUpdated = await User.findOneAndUpdate({ state }, user, {
        new: true,
      }).lean();
      return userUpdated;
    } catch (err) {
      throw new UpdateFailedException(
        UserController.UNPROCESSABLE_UPDATE_ENTITY
      );
    }
  }

  public async delete(_id: string) {
    try {
      const userDeleted = await User.findByIdAndDelete({ _id }).lean();
      return userDeleted;
    } catch (err) {
      throw new DeleteFailedException(
        UserController.UNPROCESSABLE_DELETE_ENTITY
      );
    }
  }

  public async get(_id: string) {
    try {
      const user = await User.findById({ _id }).lean();
      return user;
    } catch (err) {
      throw new ResourceNotFoundException(UserController.RESOURCE_NOT_FOUND);
    }
  }

  public async getByState(state: string) {
    try {
      const user = await User.findOne({ state }).orFail();
      return user;
    } catch (err) {
      throw new BusinessException(AuthConstants.USER_INVALID);
    }
  }

  public async getAll() {
    try {
      const users = await User.find().lean();
      return users;
    } catch (err) {
      throw new ResourceNotFoundException(UserController.RESOURCE_NOT_FOUND);
    }
  }

  public async getBlocked() {
    try {
      const users = await User.find({ locked: true }).lean();
      return users;
    } catch (err) {
      throw new ResourceNotFoundException(UserController.RESOURCE_NOT_FOUND);
    }
  }
}
