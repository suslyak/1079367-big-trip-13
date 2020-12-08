// from you dont need lodash underscore
export const randomInt = (a = 1, b = 0) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));
  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

export const getRandomArrayElement = (arr) => arr[randomInt(0, arr.length - 1)];

export const sortByStartDates = (a, b) => {
  //сортирует объекты dayjs

  if (a.startDate.isBefore(b.startDate)) {
    return -1;
  }
  if (b.startDate.isBefore(a.startDate)) {
    return 1;
  }

  return 0;
};

export const sortByPrice = (a, b) => {
  //сортирует объекты, имеющие свойство cost

  if (b.cost < a.cost) {
    return -1;
  }
  if (b.cost > a.cost) {
    return 1;
  }

  return 0;
};
