import { userSigninInputType, userSignupInputType } from "../types/userTypes";
import { userService } from "../services/user";
import { userInputParserVarifier } from "../utils/userInputParser&vVarifier";

export class userController {
  userInputParserVarifier = new userInputParserVarifier();
  userService = new userService();

  async createUser(userData: userSignupInputType) {
    try {
      userInputParserVarifier.validateUserSignupInput(userData);
      return await this.userService.createUser(userData);
    } catch (error) {
      console.error(error);

      return new Error("error while creating user.");
    }
  }

  async findUser(userData: userSigninInputType) {
    try {
      userInputParserVarifier.validateUserSigninInput(userData);
      return await this.userService.findUser(userData);
    } catch (error) {
      console.error(error);

      return new Error("error while creating user.");
    }
  }
}
