import z, { ZodError, nullable, number, optional } from "zod";
import {
  userSigninInputType,
  userSigninSchema,
  userSignupInputType,
  userSignupSchema,
  waitlistSchema,
} from "../types/userTypes";

export class userInputParserVarifier {
  static validateUserSignupInput(userDate: userSignupInputType) {
    try {
      const check = userSignupSchema.parse(userDate);
      return check;
    } catch (error) {
      if (error instanceof ZodError) {
        console.error("Validation error for user input:", error.errors);
      } else {
        console.error("Unexpected error while validating user input:", error);
      }
      throw error;
    }
  }
  static validateUserWaitlist(email: { email: string }) {
    try {
      const check = waitlistSchema.parse(email);
      return check;
    } catch (error) {
      if (error instanceof ZodError) {
        console.error("Validation error for user input:", error.errors);
      } else {
        console.error("Unexpected error while validating user input:", error);
      }
      throw error;
    }
  }
  static validateUserSigninInput(input: userSigninInputType) {
    try {
      userSigninSchema.parse(input);
    } catch (error) {
      if (error instanceof ZodError) {
        console.error("Validation error for user input:", error.errors);
      } else {
        console.error("Unexpected error while validating user input:", error);
      }
      throw error;
    }
  }
}
