import { workoutService } from "../services/workout";
import { updateWorkout, workoutType } from "../types/workoutTypes";

export class workoutControllers {
  workoutService = new workoutService();
  async createWorkout(userId: number, workoutData: workoutType) {
    try {
      return await this.workoutService.createWorkout(workoutData, userId);
    } catch (error) {
      return new Error("error while creating workout.");
    }
  }
  async updateWorkout(userId: number, workoutData: updateWorkout) {
    try {
      return await this.workoutService.updateWorkout(workoutData, userId);
    } catch (error) {
      return new Error("error while updating workout.");
    }
  }
}
