import InfoPresenter from './presenter/info.js';
import TripPresenter from './presenter/trip.js';
import {getNavigationLinks} from './mock/navigation.js';
import {generatePoint} from './mock/trip-point.js';
import {generateFilter} from './mock/filter.js';
import {generateSorting} from './mock/sortings.js';

import {sortByStartDates} from './utils/point.js';

const pageHeaderElement = document.querySelector(`.page-header`);
const pageMainElement = document.querySelector(`.page-main`);
const tripMainElement = pageHeaderElement.querySelector(`.trip-main`);
const tripControlsElement = tripMainElement.querySelector(`.trip-controls`);
const menuReferenceElement = tripControlsElement.querySelectorAll(`h2`)[1];
const eventsElement = pageMainElement.querySelector(`.trip-events`);

const tripPoints = new Array(20).fill().map(generatePoint);
const destinations = Array.from(new Set(tripPoints.map((point) => point.destination.name)));

destinations.sort();
tripPoints.sort(sortByStartDates);

const headerRenderPlaces = {
  menu: {container: tripControlsElement, referenceElement: menuReferenceElement},
  filter: tripControlsElement
};

const infoPresenter = new InfoPresenter(tripMainElement, headerRenderPlaces);
const tripPresenter = new TripPresenter(eventsElement);

infoPresenter.init(tripPoints, getNavigationLinks(), generateFilter(tripPoints));
tripPresenter.init(tripPoints, generateSorting(tripPoints));
