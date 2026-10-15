import { useEffect, useState } from "react";

export type TimeOfDay = "day" | "night";

const compute = (): TimeOfDay => {
  const hour = new Date().getHours();
  return hour >= 6 && hour < 19 ? "day" : "night";
};

export function useTimeOfDay() {
  const [time, setTime] = useState<TimeOfDay>(compute);

  useEffect(() => {
    const id = setInterval(() => setTime(compute()), 60000);
    return () => clearInterval(id);
  }, []);

  return time;
}
