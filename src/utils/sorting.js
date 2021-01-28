import {SortType} from '../const.js';

export const sortByStartDates = (a, b) => {
  // сортирует объекты, имеющие свойство start, содержащее объект dayjs

  return a.start - b.start;
};

export const sortByPrice = (a, b) => {
  // сортирует объекты, имеющие свойство cost

  return b.cost - a.cost;
};

export const sortByTime = (a, b) => {
  // сортирует объекты, имеющие свойста start и end, содержащие объекты dayjs

  const duration = (obj) => {
    return obj.end.diff(obj.start);
  };

  return duration(b) - duration(a);
};

export const sortings = {
  [SortType.DAY]: {name: SortType.DAY, result: (points) => points.sort(sortByStartDates), isDisabled: false},
  [SortType.EVENT]: {name: SortType.EVENT, result: (points) => points, isDisabled: true},
  [SortType.TIME]: {name: SortType.TIME, result: (points) => points.sort(sortByTime), isDisabled: false},
  [SortType.PRICE]: {name: SortType.PRICE, result: (points) => points.sort(sortByPrice), isDisabled: false},
  [SortType.OFFERS]: {name: SortType.OFFERS, result: (points) => points, isDisabled: true},
};
