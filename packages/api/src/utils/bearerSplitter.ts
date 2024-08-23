export const bearerSplitter = (bearerToken: string): string => {
  return bearerToken.split(' ')[1];
};
