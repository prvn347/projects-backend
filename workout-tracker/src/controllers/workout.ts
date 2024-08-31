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
  async deleteWorkout(workoutId: number, userId: number) {
    try {
      return await this.workoutService.deleteWorkout(workoutId, userId);
    } catch (error) {
      return new Error("error while deleting workout.");
    }
  }
  async addNote(workoutId: number, note: { note: string }) {
    try {
      return await this.workoutService.addNote(workoutId, note);
    } catch (error) {
      return new Error("error while deleting workout.");
    }
  }
  async listWorkout() {
    try {
      return await this.workoutService.listWorkouts();
    } catch (error) {
      return new Error("error while listing workout.");
    }
  }
}
