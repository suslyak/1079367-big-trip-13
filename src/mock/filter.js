import dayjs from 'dayjs';

const filterMap = {
  everything: (points) => points.filter(() => true),
  future: (points) => points.filter((point) => dayjs().isBefore(point.start)),
  past: (points) => points.filter((point) => point.start.isBefore(dayjs()))
};

export const generateFilter = (points) => {
  return Object.entries(filterMap).map(([filterName, result]) => {
    return {
      name: filterName,
      result: result(points),
    };
  });
};