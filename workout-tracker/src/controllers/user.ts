import { userSigninInputType, userSignupInputType } from "../types/userTypes";
import { userService } from "../services/user";
import { userInputParserVarifier } from "../utils/userInputParser&Varifier";

export class userController {
  userInputParserVarifier = new userInputParserVarifier();
  userService = new userService();

  async createUser(userData: userSignupInputType) {
    try {
      userInputParserVarifier.validateUserSignupInput(userData);
      return await this.userService.createUser(userData);
    } catch (error) {
      return new Error("error while creating user.");
    }
  }

  async findUser(userData: userSigninInputType) {
    try {
      userInputParserVarifier.validateUserSigninInput(userData);
      return await this.userService.findUser(userData);
    } catch (error) {
      return new Error("error while creating user.");
    }
  }
}
