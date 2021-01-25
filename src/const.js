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

export const ErrorMessages = {
  WRONG_DESTINATION: `Такой пункт назначения невозможен. Выберите один из списка.`,
};

export const ErrorColors = {
  INPUT: `red`,
};

export const DefaultColors = {
  INPUT: `inherit`,
};

export const SortType = {
  DAY: `day`,
  EVENT: `event`,
  TIME: `time`,
  PRICE: `price`,
  OFFERS: `offers`
};

export const TripPointTypes = [
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

export const MenuItem = {
  POINTS: `Table`,
  STATISTICS: `Stats`
};
