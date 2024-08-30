import { PrismaClient, Category } from "@prisma/client";
const prisma = new PrismaClient();

const seed = async () => {
  try {
    // List of exercises to seed
    const exercises = [
      {
        name: "Push-Up",
        description:
          "A bodyweight exercise to strengthen the chest and triceps.",
        sets: 3,
        reps: 15,
        rest: 60,
        category: Category.STRENGTH,
      },
      {
        name: "Squat",
        description:
          "A lower-body exercise that targets the quadriceps, hamstrings, and glutes.",
        sets: 4,
        reps: 12,
        rest: 90,
        category: Category.STRENGTH,
      },
      {
        name: "Jumping Jacks",
        description:
          "A cardio exercise that increases heart rate and burns calories.",
        sets: 5,
        reps: 50,
        rest: 30,
        category: Category.AEROBIC,
      },
      {
        name: "Plank",
        description:
          "Core-strengthening exercise that engages multiple muscle groups.",
        sets: 3,
        reps: 1, // Hold for 1 minute per set
        rest: 60,
        category: Category.STRENGTH,
      },
      {
        name: "Lunges",
        description: "A lower-body exercise to strengthen legs and glutes.",
        sets: 3,
        reps: 12,
        rest: 60,
        category: Category.STRENGTH,
      },
      {
        name: "Yoga Stretch",
        description: "A flexibility exercise involving various stretches.",
        sets: 1,
        reps: 1,
        rest: 0,
        category: Category.FLEXIBILITY,
      },
      {
        name: "Bicep Curls",
        description: "An exercise to strengthen the biceps using weights.",
        sets: 3,
        reps: 10,
        rest: 60,
        category: Category.STRENGTH,
      },
      {
        name: "Mountain Climbers",
        description: "A high-intensity cardio and core workout.",
        sets: 4,
        reps: 20,
        rest: 30,
        category: Category.ENDURANCE,
      },
      {
        name: "Deadlift",
        description:
          "A full-body strength exercise targeting legs, back, and core.",
        sets: 4,
        reps: 8,
        rest: 120,
        category: Category.STRENGTH,
      },
      {
        name: "Cycling",
        description:
          "A cardio exercise that improves endurance and leg strength.",
        sets: 1,
        reps: 30, // 30 minutes
        rest: 0,
        category: Category.AEROBIC,
      },
    ];

    // Use createMany to insert multiple exercises
    await prisma.exercise.createMany({
      data: exercises,
      skipDuplicates: true, // Skips duplicates based on unique fields (if any)
    });

    console.log("Exercises have been seeded successfully!");
  } catch (error) {
    console.error("Error seeding exercises:", error);
  } finally {
    await prisma.$disconnect();
  }
};

seed();
