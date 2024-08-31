import { PrismaClient } from "@prisma/client";
import { updateWorkout, workoutType } from "../types/workoutTypes";
import { optional } from "zod";
const prisma = new PrismaClient();
export class workoutService {
  async createWorkout(workoutData: workoutType, userId: number) {
    try {
      const workout = await prisma.workout.create({
        data: {
          name: workoutData.name,
          description: workoutData.description,
          exercises: {
            create: workoutData.exerciseIds.map((id) => ({
              exerciseId: id,
            })),
          },
          schedules: {
            create: {
              scheduleTime: new Date(),
            },
          },
          userId: userId,
        },
        include: {
          exercises: true,
          schedules: true,
        },
      });

      return workout;
    } catch (error) {
      console.error(error);
      throw new Error("errror while creating workout plan ");
    }
  }

  async updateWorkout(workoutData: updateWorkout, userId: number) {
    try {
      const updatedWorkout = await prisma.workout.update({
        where: { id: workoutData.id },
        data: {
          name: workoutData.name,
          description: workoutData.description,
          schedules: {
            create: {
              scheduleTime: new Date(),
            },
          },
        },
      });

      // If exercise IDs are provided, update the exercise associations
      if (workoutData.exerciseIds) {
        // Delete existing associations
        await prisma.workoutExercise.deleteMany({
          where: { workoutId: workoutData.id },
        });

        // Create new associations for the provided exercise IDs
        const workoutExerciseData = workoutData.exerciseIds.map(
          (exerciseId) => ({
            workoutId: workoutData.id,
            exerciseId: exerciseId,
          })
        );

        await prisma.workoutExercise.createMany({
          data: workoutExerciseData,
        });
      }

      // Return the updated workout with its associated exercises
      const workoutWithExercises = await prisma.workout.findUnique({
        where: { id: workoutData.id },
        include: { exercises: { include: { Exercise: true } } }, // Include associated exercises
      });

      return workoutWithExercises;
    } catch (error) {
      console.error(error);
      throw new Error("errror while updating workout plan ");
    }
  }
  async deleteWorkout(workoutId: number, userId: number) {
    console.log(workoutId, userId);
    try {
      const traansaction = await prisma.$transaction(async (tx) => {
        await prisma.workoutExercise.deleteMany({
          where: {
            workoutId: workoutId,
          },
        });
        await prisma.workout.delete({
          where: {
            id: workoutId,
            userId: userId,
          },
        });
      });

      console.log("deletion complete");

      return traansaction;
    } catch (error) {
      console.error(error);
      throw new Error("errror while deleting workout plan ");
    }
  }
  async addNote(workoutId: number, note: { note: string }) {
    try {
      const result = await prisma.workout.update({
        where: {
          id: workoutId,
        },
        data: note,
      });
      return result;
    } catch (error) {
      console.error(error);
      throw new Error("errror while adding note to  workout plan ");
    }
  }
  async listWorkouts() {
    try {
      const result = await prisma.workoutSchedule.findMany({
        where: {
          scheduleTime: {
            lte: new Date(),
          },
        },
      });
      return result;
    } catch (error) {
      console.error(error);
      throw new Error("errror while adding note to  workout plan ");
    }
  }
}
