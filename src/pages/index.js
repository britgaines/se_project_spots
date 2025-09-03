import "./index.css";

import {
  enableValidation,
  validationConfig,
  resetValidation,
  toggleButtonState,
} from "../scripts/validation.js";

import Api from "../utils/Api.js";

// const initialCards = [
//   {
//     name: "Golden Gate bridge",
//     link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/7-photo-by-griffin-wooldridge-from-pexels.jpg",
//   },
//   {
//     name: "Val Thorens",
//     link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/1-photo-by-moritz-feldmann-from-pexels.jpg",
//   },
//   {
//     name: "Restaurant terrace",
//     link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/2-photo-by-ceiline-from-pexels.jpg",
//   },
//   {
//     name: "An outdoor cafe",
//     link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/3-photo-by-tubanur-dogan-from-pexels.jpg",
//   },
//   {
//     name: "A very long bridge, over the forest and through the trees",
//     link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/4-photo-by-maurice-laschet-from-pexels.jpg",
//   },
//   {
//     name: "Tunnel with morning light",
//     link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/5-photo-by-van-anh-nguyen-from-pexels.jpg",
//   },
//   {
//     name: "Mountain house",
//     link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/6-photo-by-moritz-feldmann-from-pexels.jpg",
//   },
// ];

const api = new Api({
  baseUrl: "https://around-api.en.tripleten-services.com/v1",
  headers: {
    authorization: "efa3fd7e-44a9-4904-b673-bc559522ea1a",
    "Content-Type": "application/json",
  },
});

api
  .getAppInfo()
  .then(([cards, userData]) => {
    cards.forEach((item) => {
      const cardElement = getCardElement(item);
      cardsList.append(cardElement);
    });

    profileNameEl.textContent = userData.name;
    profileDescriptionEl.textContent = userData.about;
    document.querySelector(".profile__avatar").src = userData.avatar;
  })
  .catch(console.error);

//edit avatar elements
const avatarModal = document.querySelector("#edit-avatar-modal");
const avatarForm = avatarModal.querySelector(".modal__form");
const avatarModalBtn = document.querySelector(".profile__avatar-button");
const avatarSubmitButton = avatarModal.querySelector(".modal__submit-button");
const avatarCloseButton = avatarModal.querySelector(".modal__close-button");
const avatarInput = avatarModal.querySelector("#profile-avatar-input");

//edit profile elements
const editProfileBtn = document.querySelector(".profile__edit-button");
const editProfileModal = document.querySelector("#edit-profile-modal");
const editProfileCloseButton = editProfileModal.querySelector(
  ".modal__close-button"
);
const editProfileForm = editProfileModal.querySelector(".modal__form");
const editProfileNameInput = editProfileModal.querySelector(
  "#profile-name-input"
);
const editProfileDescriptionInput = editProfileModal.querySelector(
  "#profile-description-input"
);

//new post elements
const newPostBtn = document.querySelector(".profile__add-button");
const newPostModal = document.querySelector("#new-post-modal");
const cardSubmitButton = newPostModal.querySelector(".modal__submit-button");
const newPostCloseButton = newPostModal.querySelector(".modal__close-button");
const newPostForm = newPostModal.querySelector(".modal__form");
const newPostImageInput = newPostModal.querySelector("#card-image-input");
const newPostCaptionInput = newPostModal.querySelector("#card-caption-input");

//delete card elements
const deleteModal = document.querySelector("#delete-modal");
const deleteForm = deleteModal.querySelector(".modal__form");
const deleteSubmitButton = deleteForm.querySelector(".modal__delete-button");
const deleteCancelButton = deleteForm.querySelector(".modal__cancel-button");
const deleteCloseButton = deleteModal.querySelector(".modal__close-button");

//preview elements
const previewModal = document.querySelector("#preview-modal");
const previewModalCloseBtn = previewModal.querySelector(".modal__close-button");
const previewImageEl = previewModal.querySelector(".modal__image");
const previewCaptionEl = previewModal.querySelector(".modal__caption");

const cardTemplate = document
  .querySelector("#card-template")
  .content.querySelector(".card");

const cardsList = document.querySelector(".cards__list");

function getCardElement(data) {
  const cardElement = cardTemplate.cloneNode(true);
  const cardTitleEl = cardElement.querySelector(".card__title");
  const cardImageEl = cardElement.querySelector(".card__image");

  cardImageEl.src = data.link;
  cardImageEl.alt = data.name;
  cardTitleEl.textContent = data.name;

  const cardLikeBtnEl = cardElement.querySelector(".card__like-button");
  cardLikeBtnEl.addEventListener("click", () => {
    cardLikeBtnEl.classList.toggle("card__like-button_active");
  });

  const cardDeleteBtnEl = cardElement.querySelector(".card__delete-button");
  cardDeleteBtnEl.addEventListener("click", () => {
    openModal(deleteModal);
    deleteForm.cardToDelete = cardElement;
  });

  deleteForm.addEventListener("submit", (evt) => {
    evt.preventDefault();

    if (deleteForm.cardToDelete) {
      deleteForm.cardToDelete.remove();
      delete deleteForm.cardToDelete;
    }

    closeModal(deleteModal);
  });

  deleteCancelButton.addEventListener("click", () => {
    delete deleteForm.cardToDelete;
    closeModal(deleteModal);
  });

  cardImageEl.addEventListener("click", () => {
    previewImageEl.src = data.link;
    previewImageEl.alt = data.name;
    previewCaptionEl.textContent = data.name;
    openModal(previewModal);
  });

  const previewCloseBtnEl = previewModal.querySelector(
    ".modal__close-button_type_preview"
  );
  previewCloseBtnEl.addEventListener("click", () => {
    closeModal(previewModal);
  });

  return cardElement;
}

const profileNameEl = document.querySelector(".profile__name");
const profileDescriptionEl = document.querySelector(".profile__description");

function openModal(modal) {
  modal.classList.add("modal_is-opened");

  function handleEscClose(evt) {
    if (evt.key === "Escape") {
      closeModal(modal);
      document.removeEventListener("keydown", handleEscClose);
      modal.removeEventListener("mousedown", handleOverlayClick);
    }
  }

  function handleOverlayClick(evt) {
    if (evt.target === modal) {
      closeModal(modal);
      document.removeEventListener("keydown", handleEscClose);
      modal.removeEventListener("mousedown", handleOverlayClick);
    }
  }

  document.addEventListener("keydown", handleEscClose);
  modal.addEventListener("mousedown", handleOverlayClick);
}

function closeModal(modal) {
  modal.classList.remove("modal_is-opened");
}

editProfileBtn.addEventListener("click", function () {
  editProfileNameInput.value = profileNameEl.textContent;
  editProfileDescriptionInput.value = profileDescriptionEl.textContent;
  resetValidation(
    editProfileForm,
    [editProfileNameInput, editProfileDescriptionInput],
    validationConfig
  );
  const inputList = Array.from(
    editProfileForm.querySelectorAll(validationConfig.inputSelector)
  );

  toggleButtonState(
    inputList,
    editProfileForm.querySelector(validationConfig.submitButtonSelector),
    validationConfig
  );
  openModal(editProfileModal);
});

editProfileCloseButton.addEventListener("click", function () {
  closeModal(editProfileModal);
});

const cardImageEl = document.querySelector(".card__image");
const cardCaptionEl = document.querySelector(".card__title");

newPostBtn.addEventListener("click", function () {
  resetValidation(
    newPostForm,
    [newPostImageInput, newPostCaptionInput],
    validationConfig
  );

  const inputList = Array.from(
    newPostForm.querySelectorAll(validationConfig.inputSelector)
  );

  toggleButtonState(
    inputList,
    newPostForm.querySelector(validationConfig.submitButtonSelector),
    validationConfig
  );

  openModal(newPostModal);
});

newPostCloseButton.addEventListener("click", function () {
  closeModal(newPostModal);
});

avatarModalBtn.addEventListener("click", function () {
  resetValidation(avatarForm, [avatarInput], validationConfig);

  const inputList = Array.from(
    avatarForm.querySelectorAll(validationConfig.inputSelector)
  );

  toggleButtonState(
    inputList,
    avatarForm.querySelector(validationConfig.submitButtonSelector),
    validationConfig
  );

  openModal(avatarModal);
});

avatarCloseButton.addEventListener("click", function () {
  closeModal(avatarModal);
});

avatarForm.addEventListener("submit", handleAvatarSubmit);

function handleAvatarSubmit(evt) {
  evt.preventDefault();

  api
    .editAvatarInfo(avatarInput.value)
    .then((data) => {
      document.querySelector(".profile__avatar").src = data.avatar;
      closeModal(avatarModal);
      avatarForm.reset();
    })
    .catch(console.error);
}

function handleEditProfileSubmit(evt) {
  evt.preventDefault();
  api
    .editUserInfo({
      name: editProfileNameInput.value,
      about: editProfileDescriptionInput.value,
    })
    .then((data) => {
      profileNameEl.textContent = data.name;
      profileDescriptionEl.textContent = data.about;
      closeModal(editProfileModal);
    })
    .catch(console.error);
}

editProfileForm.addEventListener("submit", handleEditProfileSubmit);

function handleNewPostSubmit(evt) {
  evt.preventDefault();

  const inputValues = {
    name: newPostCaptionInput.value,
    link: newPostImageInput.value,
  };

  const cardElement = getCardElement(inputValues);
  cardsList.prepend(cardElement);
  closeModal(newPostModal);
  newPostForm.reset();
  disableButton(cardSubmitButton, validationConfig);
}

newPostForm.addEventListener("submit", handleNewPostSubmit);

enableValidation(validationConfig);
