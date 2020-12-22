export const sortByStartDates = (a, b) => {
  // сортирует объекты dayjs

  if (a.start.isBefore(b.start)) {
    return -1;
  }
  if (b.start.isBefore(a.start)) {
    return 1;
  }

  return 0;
};

export const sortByPrice = (a, b) => {
  // сортирует объекты, имеющие свойство cost

  if (b.cost < a.cost) {
    return -1;
  }
  if (b.cost > a.cost) {
    return 1;
  }

  return 0;
};
