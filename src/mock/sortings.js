const sortByStartDates = (a, b) => {
  if (a.startDate.isBefore(b.startDate)) {
    return -1;
  }
  if (b.startDate.isBefore(a.startDate)) {
    return 1;
  }

  return 0;
};

const sortByPrice = (a, b) => {
  if (b.cost < a.cost) {
    return -1;
  }
  if (b.cost > a.cost) {
    return 1;
  }

  return 0;
};

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
