export const getAlerts = async () => {
  const res = await fetch("/api/mongo");
  const data = await res.json();
  return data;
};
