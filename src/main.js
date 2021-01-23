import InfoPresenter from './presenter/info.js';
import TripPresenter from './presenter/trip.js';
import PointsModel from './model/points.js';
import DestinationsModel from "./model/destinations.js";
import OffersModel from './model/offers.js';
import FilterModel from './model/filter.js';
import {getNavigationLinks} from './mock/navigation.js';
import Api from './api/api.js';
import {UpdateType} from './const.js';

const AUTHORIZATION = `Basic iHG6PGr3zNr`;
const END_POINT = `https://13.ecmascript.pages.academy/big-trip`;

const api = new Api(END_POINT, AUTHORIZATION);

const pageHeaderElement = document.querySelector(`.page-header`);
const pageMainElement = document.querySelector(`.page-main`);
const tripMainElement = pageHeaderElement.querySelector(`.trip-main`);
const tripControlsElement = tripMainElement.querySelector(`.trip-controls`);
const menuReferenceElement = tripControlsElement.querySelectorAll(`h2`)[1];
const eventsElement = pageMainElement.querySelector(`.trip-events`);

const pointsModel = new PointsModel();
const destinationsModel = new DestinationsModel();
const offersModel = new OffersModel();
const filterModel = new FilterModel();

const headerRenderPlaces = {
  menu: {container: tripControlsElement, referenceElement: menuReferenceElement},
  filter: tripControlsElement
};

const infoPresenter = new InfoPresenter(tripMainElement, headerRenderPlaces, pointsModel, filterModel);
const tripPresenter = new TripPresenter(eventsElement, pointsModel, destinationsModel, offersModel, filterModel, api);

infoPresenter.init(getNavigationLinks());
tripPresenter.init();

document.querySelector(`.trip-main__event-add-btn`).addEventListener(`click`, (evt) => {
  evt.preventDefault();
  tripPresenter.createPoint();
});

api.getTripPoints()
  .then((points) => {
    pointsModel.setPoints(UpdateType.INIT, points);
  })
  .catch(() => {
    pointsModel.setPoints(UpdateType.INIT, []);
  });

api.getDestinations()
  .then((destinations) => {
    setTimeout(() => destinationsModel.setDestinations(UpdateType.INIT, destinations), 5000);
  }).catch(() => {
    destinationsModel.setDestinations(UpdateType.INIT, []);
  });

api.getOffers()
  .then((offers) => {
    setTimeout(() => offersModel.setOffers(UpdateType.INIT, offers), 7000);
  }).catch(() => {
    offersModel.setOffers(UpdateType.INIT, []);
  });
