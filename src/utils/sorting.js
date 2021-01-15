import {SortType} from '../const.js';

export const sortByStartDates = (a, b) => {
  // сортирует объекты, имеющие свойство start, содержащее объект dayjs

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

export const sortByTime = (a, b) => {
  // сортирует объекты, имеющие свойста start и end, содержащие объекты dayjs

  const duration = (obj) => {
    return obj.end.diff(obj.start);
  };

  if (duration(b) < duration(a)) {
    return -1;
  }
  if (duration(b) > duration(a)) {
    return 1;
  }

  return 0;
};

export const sortings = {
  [SortType.DAY]: {name: SortType.DAY, result: (points) => points.sort(sortByStartDates), disabled: false},
  [SortType.EVENT]: {name: SortType.EVENT, result: (points) => points, disabled: true},
  [SortType.TIME]: {name: SortType.TIME, result: (points) => points.sort(sortByTime), disabled: false},
  [SortType.PRICE]: {name: SortType.PRICE, result: (points) => points.sort(sortByPrice), disabled: false},
  [SortType.OFFERS]: {name: SortType.OFFERS, result: (points) => points, disabled: true},
};
