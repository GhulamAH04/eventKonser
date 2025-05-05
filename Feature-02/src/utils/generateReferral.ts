export const generateReferralCode = (fullName: string): string => {
  const namePart = fullName.replace(/\s+/g, "").substring(0, 3).toUpperCase();
  const randomPart = Math.floor(1000 + Math.random() * 9000); // 4 digit random
  return `${namePart}${randomPart}`;
};
