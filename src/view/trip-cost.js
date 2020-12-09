export const getTripCostTemplate = (cost) => {
  return `
    <p class="trip-info__cost">
      Total: &euro;&nbsp;<span class="trip-info__cost-value">${cost}</span>
    </p>`;
};
