import AbstractView from './abstract.js';

export default class TripEvents extends AbstractView {
  getTemplate() {
    return `
      <ul class="trip-events__list">
      </ul>`;
  }
}
