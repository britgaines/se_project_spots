import "./index.css";

import {
  enableValidation,
  validationConfig,
  resetValidation,
  toggleButtonState,
  disableButton,
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

let currentUserId;

api
  .getAppInfo()
  .then(([cards, userData]) => {
    currentUserId = userData._id;

    cards.forEach((item) => {
      const cardElement = getCardElement(item);
      cardsList.append(cardElement);
    });

    profileNameEl.textContent = userData.name;
    profileDescriptionEl.textContent = userData.about;
    profileAvatarEl.src = userData.avatar;
  })
  .catch(console.error);

let selectedCard;
let selectedCardId;

//edit avatar elements
const profileAvatarEl = document.querySelector(".profile__avatar");
const avatarModal = document.querySelector("#edit-avatar-modal");
const avatarForm = avatarModal.querySelector(".modal__form");
const avatarModalBtn = document.querySelector(".profile__avatar-button");
const avatarSubmitButton = avatarModal.querySelector(".modal__submit-button");
const avatarCloseButton = avatarModal.querySelector(".modal__close-button");
const avatarInput = avatarModal.querySelector("#profile-avatar-input");

//edit profile elements
const editProfileBtn = document.querySelector(".profile__edit-button");
const editProfileModal = document.querySelector("#edit-profile-modal");
const editProfileSubmitButton = editProfileModal.querySelector(
  ".modal__submit-button"
);
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
    const isLiked = cardLikeBtnEl.classList.contains(
      "card__like-button_active"
    );
    const toggleLike = isLiked
      ? api.removeLike.bind(api)
      : api.addLike.bind(api);

    toggleLike(data._id)
      .then((updatedCard) => {
        const isLiked = updatedCard.likes.some(
          (user) => user._id === currentUserId
        );
        cardLikeBtnEl.classList.toggle("card__like-button_active", isLiked);
      })
      .catch(console.error);
  });

  const isLikedByUser = data.likes.some((user) => user._id === currentUserId);

  if (isLikedByUser) {
    cardLikeBtnEl.classList.add("card__like-button_active");
  }

  const cardDeleteBtnEl = cardElement.querySelector(".card__delete-button");
  cardDeleteBtnEl.addEventListener("click", () => {
    selectedCard = cardElement;
    selectedCardId = data._id;
    openModal(deleteModal);
  });

  deleteCancelButton.addEventListener("click", () => {
    selectedCard = null;
    selectedCardId = null;
    closeModal(deleteModal);
  });

  deleteCloseButton.addEventListener("click", function () {
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

avatarForm.addEventListener("submit", (evt) => {
  evt.preventDefault();
  const originalText = avatarSubmitButton.textContent;
  avatarSubmitButton.textContent = "Saving...";

  api
    .editAvatarInfo(avatarInput.value)
    .then((userData) => {
      profileAvatarEl.src = userData.avatar;
      closeModal(avatarModal);
      avatarForm.reset();
    })
    .catch(console.error)
    .finally(() => {
      avatarSubmitButton.textContent = originalText;
    });
});

editProfileForm.addEventListener("submit", (evt) => {
  evt.preventDefault();
  const originalText = editProfileSubmitButton.textContent;
  editProfileSubmitButton.textContent = "Saving...";

  api
    .editUserInfo({
      name: editProfileNameInput.value,
      about: editProfileDescriptionInput.value,
    })
    .then((userData) => {
      profileNameEl.textContent = userData.name;
      profileDescriptionEl.textContent = userData.about;
      closeModal(editProfileModal);
    })
    .catch(console.error)
    .finally(() => {
      editProfileSubmitButton.textContent = originalText;
    });
});

newPostForm.addEventListener("submit", (evt) => {
  evt.preventDefault();
  const originalText = cardSubmitButton.textContent;
  cardSubmitButton.textContent = "Saving...";

  api
    .addNewCard({
      name: newPostCaptionInput.value,
      link: newPostImageInput.value,
    })
    .then((cardData) => {
      const cardElement = getCardElement(cardData);
      cardsList.prepend(cardElement);
      closeModal(newPostModal);
      newPostForm.reset();
    })
    .catch(console.error)
    .finally(() => {
      cardSubmitButton.textContent = originalText;
    });
});

deleteForm.addEventListener("submit", (evt) => {
  evt.preventDefault();
  const originalText = deleteSubmitButton.textContent;
  deleteSubmitButton.textContent = "Deleting...";

  api
    .removeCard(selectedCardId)
    .then(() => {
      selectedCard.remove();
      closeModal(deleteModal);
    })
    .catch(console.error)
    .finally(() => {
      deleteSubmitButton.textContent = originalText;
    });
});

enableValidation(validationConfig);
