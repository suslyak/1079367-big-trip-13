export default () => () => {

  const getRawHtmlTemplate = () => {
    return `
      <h1 class="trip-info__title">Amsterdam &mdash; Chamonix &mdash; Geneva</h1>
      <p class="trip-info__dates">Mar 18&nbsp;&mdash;&nbsp;20</p>`;
  };

  return {
    getRawHtmlTemplate
  };
};
