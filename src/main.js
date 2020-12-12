import TripInfo from './view/trip-info.js';
import TripCost from './view/trip-cost.js';
import Menu from './view/main-menu.js';
import Filter from './view/trip-filters.js';
import Sorting from './view/trip-sort.js';
import Events from './view/trip-events.js';
import EditPointForm from './view/edit-trip-point.js';
import TripPoint from './view/trip-point.js';
import {getNavigationLinks} from './mock/navigation.js';
import {generatePoint} from './mock/trip-point.js';
import {generateFilter} from './mock/filter.js';
import {generateSorting} from './mock/sortings.js';

import {sortByStartDates} from './utils.js';
import {renderElement} from './utils.js';

const pageHeaderElement = document.querySelector(`.page-header`);
const pageMainElement = document.querySelector(`.page-main`);
const tripMainElement = pageHeaderElement.querySelector(`.trip-main`);
const tripControlsElement = tripMainElement.querySelector(`.trip-controls`);
const eventsElement = pageMainElement.querySelector(`.trip-events`);

const tripPoints = new Array(20).fill().map(generatePoint);
const destinations = Array.from(new Set(tripPoints.map((point) => point.destination.name)));

destinations.sort();
tripPoints.sort(sortByStartDates);

const tripDestinationsGraph = Array.from(new Set(tripPoints.map((point) => point.destination.name)));
const tripTimeGap = {
  start: tripPoints[0].start,
  end: tripPoints.slice(-1)[0].end
};

const tripCost = tripPoints.reduce((total, point) => total + point.cost, 0);

renderElement(tripMainElement, new TripInfo(tripDestinationsGraph, tripTimeGap).getElement(), `afterbegin`);

const tripInfoElement = pageHeaderElement.querySelector(`.trip-info`);

renderElement(tripInfoElement, new TripCost(tripCost).getElement(), `beforeend`);

const menuReferenceElement = tripControlsElement.querySelectorAll(`h2`)[1];

renderElement(tripControlsElement, new Menu(getNavigationLinks()).getElement(), menuReferenceElement);
renderElement(tripControlsElement, new Filter(generateFilter(tripPoints)).getElement(), `beforeend`);
renderElement(eventsElement, new Sorting(generateSorting(tripPoints)).getElement(), `beforeend`);
renderElement(eventsElement, new Events().getElement(), `beforeend`);

const tripEventsListElement = eventsElement.querySelector(`.trip-events__list`);

for (const tripPoint of tripPoints) {
  const EditPointFormElement = new EditPointForm(tripPoint).getElement();
  const TripPointElement = new TripPoint(tripPoint).getElement();

  TripPointElement.querySelector(`.event__rollup-btn`)
  .addEventListener(`click`, () => {
    tripEventsListElement.replaceChild(EditPointFormElement, TripPointElement);
  });

  EditPointFormElement.querySelector(`.event__rollup-btn`)
  .addEventListener(`click`, () => {
    tripEventsListElement.replaceChild(TripPointElement, EditPointFormElement);
  });

  renderElement(tripEventsListElement, TripPointElement, `beforeend`);
}
