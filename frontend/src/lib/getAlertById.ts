export const getAlertById = async (id: string) => {
  const res = await fetch(`/api/mongo/${id}`);
  const data = await res.json();
  return data;
};
