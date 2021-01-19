import InfoPresenter from './presenter/info.js';
import TripPresenter from './presenter/trip.js';
import PointsModel from "./model/points.js";
import FilterModel from "./model/filter.js";
import {getNavigationLinks} from './mock/navigation.js';
import {generatePoint} from './mock/trip-point.js';
import {sortByStartDates} from './utils/sorting.js';

const pageHeaderElement = document.querySelector(`.page-header`);
const pageMainElement = document.querySelector(`.page-main`);
const tripMainElement = pageHeaderElement.querySelector(`.trip-main`);
const tripControlsElement = tripMainElement.querySelector(`.trip-controls`);
const menuReferenceElement = tripControlsElement.querySelectorAll(`h2`)[1];
const eventsElement = pageMainElement.querySelector(`.trip-events`);

const tripPoints = new Array(0).fill().map(generatePoint);
tripPoints.sort(sortByStartDates);

const pointsModel = new PointsModel();
pointsModel.setPoints(tripPoints);

const filterModel = new FilterModel();

const headerRenderPlaces = {
  menu: {container: tripControlsElement, referenceElement: menuReferenceElement},
  filter: tripControlsElement
};

const infoPresenter = new InfoPresenter(tripMainElement, headerRenderPlaces, pointsModel, filterModel);
const tripPresenter = new TripPresenter(eventsElement, pointsModel, filterModel);

infoPresenter.init(getNavigationLinks());
tripPresenter.init();

document.querySelector(`.trip-main__event-add-btn`).addEventListener(`click`, (evt) => {
  evt.preventDefault();
  tripPresenter.createPoint();
});
