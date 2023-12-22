import { randomInt } from "crypto";

interface UserData {
  userId: string;
  cost: number;
  request: number;
  costPerDay: number;
  requestPerDay: number;
  budgetUsage: number;
}

function getRandomInt(max: number) {
  return Math.floor(Math.random() * max);
}

// todo: option to read user email if available
const mockDataGenerator = (): UserData => {
  return {
    userId: "1234",
    cost: 0 + getRandomInt(100),
    request: 0 + getRandomInt(500),
    costPerDay: 0.05 + getRandomInt(10) / 100,
    requestPerDay: 1 + getRandomInt(10),
    budgetUsage: 0 + getRandomInt(100),
  };
};

export const getUserData = (): UserData[] => {
  const data: UserData[] = [];
  for (let i = 0; i < 10; i++) {
    data.push(mockDataGenerator());
  }
  return data;
};
