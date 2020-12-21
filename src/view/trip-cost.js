import AbstractView from "./abstract.js";

export default class TripCost extends AbstractView {
  constructor(cost = ``) {
    super();
    this._cost = cost;
  }

  getTemplate() {
    return `
      <p class="trip-info__cost">
        Total: &euro;&nbsp;<span class="trip-info__cost-value">${this._cost}</span>
      </p>`;
  }
}
