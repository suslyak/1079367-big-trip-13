import Observer from '../utils/observer.js';
import {TripPointTypes} from '../const.js';
export default class Offer extends Observer {
  constructor() {
    super();
    this._offers = [];
  }

  setOffers(updateType, offers) {
    this._offers = offers.slice();

    this._notify(updateType);
  }

  getOffers() {
    const outputedOffers = {};
    if (this._offers.length) {
      this._offers.forEach((offersOfType) => {
        outputedOffers[offersOfType.type] = offersOfType.offers;
      });
    } else {
      TripPointTypes.forEach((type) => {
        outputedOffers[type] = [{name: type, title: `loading offers..`, cost: ``}];
      });
    }

    return outputedOffers;
  }

  static adaptToClient(offersOfType) {
    const adaptedOffersOfType = Object.assign(
        {},
        offersOfType,
        {
          offers: offersOfType.offers
            .map((offer) => ({
              name: offersOfType.type,
              title: offer.title,
              cost: offer.price
            }))
        }
    );

    return adaptedOffersOfType;
  }
}
