import './toast.css';

const SHOW_TIME = 5000;

const toastContainerElement = document.createElement(`div`);

const hideToast = (toastElement) => {
  setTimeout(() => {
    toastElement.remove();
  }, SHOW_TIME);
};

toastContainerElement.classList.add(`toast-container`);
document.body.append(toastContainerElement);

const makeToast = ({toastMessage, isSelfHide = true, toastModificator = ``} = {}) => {
  const toastItemElement = document.createElement(`div`);
  toastItemElement.textContent = toastMessage;
  toastItemElement.classList.add(`toast-item`);

  if (toastModificator) {
    toastItemElement.classList.add(`toast-item--${toastModificator}`);
  }

  toastContainerElement.append(toastItemElement);

  if (isSelfHide) {
    hideToast(toastItemElement);
  }

  return toastItemElement;
};

const showSelfFadingGreenToast = (message) => {
  return makeToast({toastMessage: message, isSelfHide: true, toastModificator: `green`});
};

const showPermanentYellowtoast = (message) => {
  return makeToast({toastMessage: message, isSelfHide: false, toastModificator: `yellow`});
};

export {showSelfFadingGreenToast, showPermanentYellowtoast};
