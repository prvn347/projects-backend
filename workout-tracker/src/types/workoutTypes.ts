export type workoutType = {
  name: string;
  description: string;
  exerciseIds: number[];
};

export type updateWorkout = {
  id: number;
  name?: string;
  description?: string;
  exerciseIds: number[];
};
