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
const mockDataGenerator = (index: number): UserData => {
  return {
    userId: `1234_${index + 1}`,
    cost: 0 + getRandomInt(100),
    request: 0 + getRandomInt(500),
    costPerDay: 0.05 + getRandomInt(10) / 100,
    requestPerDay: 1 + getRandomInt(10),
    budgetUsage: 0 + getRandomInt(100),
  };
};

export const getDynamicUserData = (): UserData[] => {
  const data: UserData[] = [];
  for (let i = 0; i < 10; i++) {
    data.push(mockDataGenerator(i));
  }
  return data;
};

export const getUserData = (): UserData[] => {
  return getStaticUserData();
};

export const getStaticUserData = (): UserData[] => {
  return [
    {
      userId: "1234_1",
      cost: 63,
      request: 169,
      costPerDay: 0.11,
      requestPerDay: 1,
      budgetUsage: 73,
    },
    {
      userId: "1234_2",
      cost: 69,
      request: 93,
      costPerDay: 0.13,
      requestPerDay: 2,
      budgetUsage: 84,
    },
    {
      userId: "1234_3",
      cost: 40,
      request: 297,
      costPerDay: 0.08,
      requestPerDay: 7,
      budgetUsage: 58,
    },
    {
      userId: "1234_4",
      cost: 99,
      request: 487,
      costPerDay: 0.060000000000000005,
      requestPerDay: 3,
      budgetUsage: 30,
    },
    {
      userId: "1234_5",
      cost: 93,
      request: 218,
      costPerDay: 0.060000000000000005,
      requestPerDay: 9,
      budgetUsage: 2,
    },
    {
      userId: "1234_6",
      cost: 15,
      request: 358,
      costPerDay: 0.09,
      requestPerDay: 4,
      budgetUsage: 34,
    },
    {
      userId: "1234_7",
      cost: 41,
      request: 200,
      costPerDay: 0.08,
      requestPerDay: 4,
      budgetUsage: 46,
    },
    {
      userId: "1234_8",
      cost: 93,
      request: 297,
      costPerDay: 0.08,
      requestPerDay: 8,
      budgetUsage: 15,
    },
    {
      userId: "1234_9",
      cost: 74,
      request: 293,
      costPerDay: 0.060000000000000005,
      requestPerDay: 2,
      budgetUsage: 80,
    },
    {
      userId: "1234_10",
      cost: 77,
      request: 239,
      costPerDay: 0.09,
      requestPerDay: 6,
      budgetUsage: 16,
    },
  ];
};
