import {sortByStartDates, sortByPrice} from '../utils/sorting.js';

const sortingsMap = {
  day: (points) => ({result: points.filter(() => true), disabled: false}),
  event: (points) => ({result: () => points, disabled: true}),
  time: (points) => ({result: () => points.sort(sortByStartDates), disabled: false}),
  price: (points) => ({result: () => points.sort(sortByPrice), disabled: false}),
  offers: (points) => ({result: () => points, disabled: true}),
};

export const generateSorting = (points) => {
  return Object.entries(sortingsMap).map(([sortingName, sorting]) => {
    return {
      name: sortingName,
      result: sorting(points).result,
      disabled: sorting(points).disabled,
    };
  });
};
