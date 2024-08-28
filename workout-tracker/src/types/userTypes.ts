import z, { nullable, number, optional } from "zod";
export interface userSignupInputType {
  email: string;
  username: string;
  name: string;
  password: string;
}
export interface userSigninInputType {
  email: string;
  password: string;
}

export const userSignupSchema = z.object({
  username: z.string(),
  name: z.string(),
  password: z.string(number().min(8)),
  email: z.string().email(),
});
export const waitlistSchema = z.object({
  email: z.string().email(),
});
export const userSigninSchema = z.object({
  email: z.string().email(),
  password: z.string(number().min(8)),
});
