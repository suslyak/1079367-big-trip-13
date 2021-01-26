import InfoPresenter from './presenter/info.js';
import TripPresenter from './presenter/trip.js';
import PointsModel from './model/points.js';
import DestinationsModel from "./model/destinations.js";
import OffersModel from './model/offers.js';
import FilterModel from './model/filter.js';
import SiteMenu from './view/main-menu.js';
import {render} from "./utils/render.js";
import Api from './api/api.js';
import {UpdateType, MenuItem} from './const.js';

const AUTHORIZATION = `Basic iHG6PGr3zNr`;
const END_POINT = `https://13.ecmascript.pages.academy/big-trip`;

const api = new Api(END_POINT, AUTHORIZATION);

const pageHeaderElement = document.querySelector(`.page-header`);
const pageMainElement = document.querySelector(`.page-main`);
const tripMainElement = pageHeaderElement.querySelector(`.trip-main`);
const tripControlsElement = tripMainElement.querySelector(`.trip-controls`);
const menuReferenceElement = tripControlsElement.querySelectorAll(`h2`)[1];
const mainContainerElement = pageMainElement.querySelector(`.page-body__container`);
const eventsElement = mainContainerElement.querySelector(`.trip-events`);

const pointsModel = new PointsModel();
const destinationsModel = new DestinationsModel();
const offersModel = new OffersModel();
const filterModel = new FilterModel();

const siteMenu = new SiteMenu(Object.values(MenuItem));

const headerRenderPlaces = {
  menu: {container: tripControlsElement, referenceElement: menuReferenceElement},
  filter: tripControlsElement
};

const newPointClickHandler = (evt) => {
  evt.preventDefault();
  tripPresenter.createPoint();
};

const renderMenu = () => {
  const container = headerRenderPlaces.menu.container;
  const position = headerRenderPlaces.menu.referenceElement;
  render(container, siteMenu, position);
};

const createInfo = () => {
  const infoPresenter = new InfoPresenter(tripMainElement, headerRenderPlaces, pointsModel, filterModel);
  const newPointButton = document.querySelector(`.trip-main__event-add-btn`);

  infoPresenter.init();
  renderMenu();

  newPointButton.removeEventListener(`click`, newPointClickHandler);
  newPointButton.addEventListener(`click`, newPointClickHandler);
};

const tripPresenter = new TripPresenter(eventsElement, siteMenu, pointsModel, destinationsModel, offersModel, filterModel, api);

destinationsModel.loading = true;
offersModel.loading = true;

tripPresenter.init();

api.getTripPoints()
  .then((points) => {
    pointsModel.setPoints(UpdateType.INIT, points);
  })
  .catch(() => {
    pointsModel.setPoints(UpdateType.INIT, []);
  })
  .finally(() => {
    createInfo();
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
