export const greeting = () => {
  const hour = new Date().getHours();
  if (hour < 6) return "Buenas noches";
  if (hour < 12) return "Buenos días";
  if (hour < 19) return "Buenas tardes";
  return "Buenas noches";
};

export const isToday = (iso: string) =>
  new Date(iso).toDateString() === new Date().toDateString();
