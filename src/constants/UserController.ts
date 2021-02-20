export default class UserController {
  public static readonly MULTER_ERR_500 = "Error on Profile Picture Multer Upload";
  public static readonly DEFAULT_ERR_500 = "Error on Profile Picture Upload";
  public static readonly MESSAGE_CREATED = "User Saved Successfully";
  public static readonly UNPROCESSABLE_ENTITY = "Error on save user on database";
  public static readonly UNPROCESSABLE_UPDATE_ENTITY = "Error on update user on database";
  public static readonly UNPROCESSABLE_DELETE_ENTITY = "Error on update user on database";
  public static readonly USER_EXISTS = "We already have an user for this email";

  public static readonly RESOURCE_NOT_FOUND = "User not found on database";
}