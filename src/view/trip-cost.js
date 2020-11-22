export default () => () => {

  const getRawHtmlTemplate = () => {
    return `
      <p class="trip-info__cost">
        Total: &euro;&nbsp;<span class="trip-info__cost-value">1230</span>
      </p>`;
  };

  return {
    getRawHtmlTemplate
  };
};
