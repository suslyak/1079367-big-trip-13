import dayjs from 'dayjs';

import {FilterType} from "../const";

export const filter = {
  [FilterType.EVERYTHING]: (points) => points.filter(() => true),
  [FilterType.FUTURE]: (points) => points.filter((point) => dayjs().isBefore(point.start)),
  [FilterType.PAST]: (points) => points.filter((point) => point.start.isBefore(dayjs()))
};
