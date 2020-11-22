export default () => () => {

  const getRawHtmlTemplate = () => {
    return `
      <a class="trip-tabs__btn  trip-tabs__btn--active" href="#">Table</a>
      <a class="trip-tabs__btn" href="#">Stats</a>`;
  };

  return {
    getRawHtmlTemplate
  };
};
