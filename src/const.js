export const UserAction = {
  UPDATE_POINT: `UPDATE_POINT`,
  ADD_POINT: `ADD_POINT`,
  DELETE_POINT: `DELETE_POINT`
};

export const UpdateType = {
  PATCH: `PATCH`,
  MINOR: `MINOR`,
  MEDIUM: `MEDIUM`,
  MAJOR: `MAJOR`,
  INIT: `INIT`
};

export const FilterType = {
  EVERYTHING: `everything`,
  FUTURE: `future`,
  PAST: `past`
};

export const ErrorMessage = {
  WRONG_DESTINATION: `No such destination. Pick one from droplist`,
};

export const ErrorColor = {
  INPUT: `red`,
};

export const DefaultColor = {
  INPUT: `inherit`,
};

export const SortType = {
  DAY: `day`,
  EVENT: `event`,
  TIME: `time`,
  PRICE: `price`,
  OFFERS: `offers`
};

export const TRIP_POINT_TYPES = [
  `taxi`,
  `bus`,
  `train`,
  `ship`,
  `transport`,
  `drive`,
  `flight`,
  `check-in`,
  `sightseeing`,
  `restaurant`
];

export const PointDefaultParameter = {
  DEFAULT_TYPE: `flight`
};

export const MenuItem = {
  POINTS: `Table`,
  STATISTICS: `Stats`
};

export const ChartParameter = {
  BAR_HEIGHT: 55,
  MIN_BAR_LENGTH: 50,
  BAR_THICKNESS: 44
};
