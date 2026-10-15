export const PLANT_STAGES = 6;
export const CHAT_DAYS = 7;

export const stageForDay = (day: number) =>
  Math.min(Math.max(day - 1, 0), PLANT_STAGES - 1);
