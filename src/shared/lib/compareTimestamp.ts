export const compareServerTimestampByNow = (
  serverTimestamp: string,
): number => {
  const date = new Date(serverTimestamp + 'Z');
  const now = new Date();

  const diff = date.getTime() - now.getTime();

  return diff;
};
