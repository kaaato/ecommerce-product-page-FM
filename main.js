"use strict"
// mobile nav menu
const mobileMenuOpenButton = document.querySelector(".mobile-nav-menu-open-button");
mobileMenuOpenButton.addEventListener("click", toggleMobileMenu);

// mobile gallery
const mobileSliderContainer = document.querySelector(".mobile-slider-container");
const mobileSlider = {
  imageX: 0,
  imageIndex: 0,
}

mobileSliderContainer.addEventListener("click", handleClickOnMobileSlider);
window.addEventListener("resize", makeMobileSliderImagesResponsive);

// Desktop gallery
const desktopGalleryContainer = document.querySelector(".desktop-gallery-container");
const desktopGalleryLargeImageDivs = document.querySelectorAll(".desktop-gallery-large-image-item");
desktopGalleryContainer.addEventListener("click", handleClickOnDesktopGallery);

// shopping cart and add to cart buttons
document.body.addEventListener("click", handleClickToAddToCart);
const product = {
  quantity: 0,
  cost: 125,
}
const cart = document.querySelector(".nav-shopping-cart");
const cartButton = document.querySelector(".nav-shopping-cart-toggle-button");
const decreaseButton = document.querySelector("[data-decrease-button]");
const increaseButton = document.querySelector("[data-increase-button]");
const quantityInput = document.querySelector(".product-actions-quantity-text");
const emptyCartContent = document.querySelector(".cart-empty");
const filledCartContent = document.querySelector(".cart-with-items");
const productQuantityText = document.querySelector(".cart-with-items-description-quantity");
const productCostText = document.querySelector(".cart-with-items-description-price");
const productIconTitle = document.querySelector(".nav-shopping-cart-icon-title");
const productIconDesc = document.querySelector(".nav-shopping-cart-icon-desc");
let cartCounter = null;

const emptyCartButton = document.querySelector(".cart-with-items-description-button-empty");
emptyCartButton.addEventListener("click", emptyCart);

const checkoutButton = document.querySelector(".cart-with-items-button-checkout");
checkoutButton.addEventListener("click", goToCheckout);

// mobile nav menu
function toggleMobileMenu() {
  const mobileMenuContainer = document.querySelector(".nav-menu-container");
  const mobileMenuCloseButton = document.querySelector(".mobile-nav-menu-close-button");

  openMobileMenu();
  mobileMenuContainer.addEventListener("click", handleClick);
  document.addEventListener("keydown", closeMobileMenuByEscape);
  window.addEventListener("resize", closeMobileMenuWhenResize);

  function handleClick(event) {
    const isCloseButton = event.target.closest(".mobile-nav-menu-close-button");
    const mobileNavCoords = document.querySelector(".nav-menu").getBoundingClientRect();
    const isClickAtOutsideMenu = mobileNavCoords.right < event.clientX;
    if (isCloseButton || isClickAtOutsideMenu) {
      closeMobileMenu();
    }
  }

  function closeMobileMenuWhenResize(event) {
    closeMobileMenu();
  }

  function closeMobileMenuByEscape (event) {
    if (event.key === "Escape") {
      closeMobileMenu();
    }
  }

  function openMobileMenu() {
    mobileMenuOpenButton.setAttribute("aria-expanded", "true");
    mobileMenuContainer.classList.toggle("mobile-menu-active");
    mobileMenuCloseButton.focus();
  }

  function closeMobileMenu() {
    mobileMenuOpenButton.setAttribute("aria-expanded", "false");
    mobileMenuContainer.classList.toggle("mobile-menu-active");
    mobileMenuCloseButton.focus();
    mobileMenuContainer.removeEventListener("click", handleClick);
    document.removeEventListener("keydown", closeMobileMenuByEscape);
    window.removeEventListener("resize", closeMobileMenuWhenResize);
  }
}

// mobile gallery
function handleClickOnMobileSlider(event) {
  const mobileSliderImages = document.querySelector(".mobile-slider-item-container");
  const numberOfSliderImages = document.querySelectorAll(".mobile-slider-item").length;
  const mobileSliderPreviousButton = document.querySelector(".mobile-slider-arrow-button-previous");
  const mobileSliderNextButton = document.querySelector(".mobile-slider-arrow-button-next");
  const maxImageX = mobileSliderImages.offsetWidth - mobileSliderContainer.offsetWidth;

  const target = event.target.closest(".mobile-slider-arrow-button");
  if(!target) return;
  const isPreviousButton = target.classList.contains("mobile-slider-arrow-button-previous");

  if (isPreviousButton) {
    mobileSlider.imageX = Math.max(0, (mobileSlider.imageX - mobileSliderContainer.offsetWidth));
    mobileSlider.imageIndex--;
  } else {
    mobileSlider.imageX = Math.min(maxImageX, (mobileSlider.imageX + mobileSliderContainer.offsetWidth));
    mobileSlider.imageIndex++;
  }

  mobileSliderImages.style.transform = `translateX(-${mobileSlider.imageX}px)`;

  if (mobileSlider.imageIndex === 0) {
    mobileSliderPreviousButton.classList.add("mobile-slider-arrow-button-disabled");
  } else if (mobileSlider.imageIndex === numberOfSliderImages - 1) {
    mobileSliderNextButton.classList.add("mobile-slider-arrow-button-disabled");
  } else if (mobileSlider.imageIndex === 1) {
    mobileSliderPreviousButton.classList.remove("mobile-slider-arrow-button-disabled");
  } else if (mobileSlider.imageIndex === numberOfSliderImages - 2) {
    mobileSliderNextButton.classList.remove("mobile-slider-arrow-button-disabled");
  }
}

function makeMobileSliderImagesResponsive() {
  const isDesktopSize = getComputedStyle(document.querySelector(".mobile-slider")).display === "none";
  if (isDesktopSize) return;

  const mobileSliderImages = document.querySelector(".mobile-slider-item-container");
  const newWidth = document.querySelector(".mobile-slider-container").clientWidth;
  mobileSlider.imageX = newWidth * mobileSlider.imageIndex;
  mobileSliderImages.style.transform = `translateX(-${mobileSlider.imageX}px)`;
}

// Desktop gallery
function handleClickOnDesktopGallery (event) {
  const target = event.target.closest(".desktop-gallery-large-image-item-button, .desktop-gallery-thumb-image-button");
  if (!target) return;

  const modal = document.querySelector(".modal");
  const modalLargeImageList = document.querySelector(".modal-slider-large-image-list");
  const numberOfSliderImages = document.querySelectorAll(".modal-slider-large-image-container").length;
  const modalSliderPreviousButton = document.querySelector(".modal-slider-arrow-button-previous");
  const modalSliderNextButton = document.querySelector(".modal-slider-arrow-button-next");

  const desktopMedia = {
    imageWidth: 0,
    imageX: 0,
    imageIndex: 0,
  }

  if (target.matches(".desktop-gallery-large-image-item-button")) {
    // large button -> open modal
    openModalSlider(target, desktopMedia);
    modal.addEventListener("click", handleClickOnModal);
    modal.addEventListener("keydown", closeModalByEscape);
  } else if(target.matches(".desktop-gallery-thumb-image-button")) {
    // small button -> switch images of the large block
    switchDesktopImage(target, desktopGalleryLargeImageDivs);
  }

  function handleClickOnModal(event) {
    const target = event.target.closest(".modal-button-close, .modal-slider-arrow-button, .modal-slider-thumb-image-button");
    if (!target) return;

    if (target.matches(".modal-button-close")) {
      // close modal oparation
      modal.close();
      closeModal();

    } else if (target.matches(".modal-slider-arrow-button")) {
      // slide image oparation
      if (target.matches(".modal-slider-arrow-button-previous")) {
        desktopMedia.imageIndex--;
        desktopMedia.imageX -= desktopMedia.imageWidth; 
      } else if (target.matches(".modal-slider-arrow-button-next")) {
        desktopMedia.imageIndex++;
        desktopMedia.imageX += desktopMedia.imageWidth;
      }

      modalLargeImageList.style.transform = `translateX(-${desktopMedia.imageX}px)`;
      setArrowButtons(desktopMedia, numberOfSliderImages);

    } else if (target.matches(".modal-slider-thumb-image-button")) {
      // switch image oparation
      desktopMedia.imageIndex = +target.dataset.elementIndex;
      desktopMedia.imageX = desktopMedia.imageWidth * desktopMedia.imageIndex;
      modalLargeImageList.style.transform = `translateX(-${desktopMedia.imageX}px)`;
      setArrowButtons(desktopMedia, numberOfSliderImages);
    }
  }

  function switchDesktopImage (target, collection) {
    const targetIndex = target.dataset.elementIndex;
    for(let div of collection) {
      if (targetIndex === div.dataset.elementIndex && !div.classList.contains("active")) {
        div.classList.add("active");
      } else if (targetIndex !== div.dataset.elementIndex && div.classList.contains("active")) {
        div.classList.remove("active");
      }
    }
  }

  function openModalSlider(target, desktopMedia) {
    modal.showModal();

    desktopMedia.imageIndex = +target.dataset.elementIndex;
    desktopMedia.imageWidth = document.querySelector(".modal-container").offsetWidth;
    desktopMedia.imageX = desktopMedia.imageWidth * desktopMedia.imageIndex;

    setArrowButtons(desktopMedia, numberOfSliderImages);
    modalLargeImageList.style.transform = `translateX(-${desktopMedia.imageX}px)`;
    window.addEventListener("resize", closeModalWhenResize);
  }

  function setArrowButtons(mediaObject, numberOfImages) {
    if (mediaObject.imageIndex == 0) {
      // first image
      modalSliderPreviousButton.classList.add("modal-slider-arrow-button-disabled");
      modalSliderNextButton.classList.remove("modal-slider-arrow-button-disabled");
    } else if (mediaObject.imageIndex == (numberOfImages - 1)) {
      // last image
      modalSliderPreviousButton.classList.remove("modal-slider-arrow-button-disabled");
      modalSliderNextButton.classList.add("modal-slider-arrow-button-disabled");
    } else if (mediaObject.imageIndex == 1) {
      // second image
      modalSliderPreviousButton.classList.remove("modal-slider-arrow-button-disabled");
      modalSliderNextButton.classList.remove("modal-slider-arrow-button-disabled");
    } else if (mediaObject.imageIndex == (numberOfImages - 2)) {
      // second last image
      modalSliderPreviousButton.classList.remove("modal-slider-arrow-button-disabled");
      modalSliderNextButton.classList.remove("modal-slider-arrow-button-disabled");
    }
  }

  function closeModalByEscape(event) {
    if (event.key === "Escape") {
      closeModal();
    }
  }

  function closeModal() {
    window.removeEventListener("resize", closeModalWhenResize);
    modal.removeEventListener("keydown", closeModalByEscape);
    modal.removeEventListener("click", handleClickOnModal);
    for (let button of document.querySelectorAll(".modal-slider-arrow-button")) {
      button.classList.remove("modal-slider-arrow-button-disabled");
    }
  }

  function closeModalWhenResize(event) {
    modal.close();
    closeModal();
  }
}

// shopping cart and add to cart buttons

function handleClickToAddToCart(event) {
  const target = event.target.closest(".nav-shopping-cart-toggle-button, .product-actions-button, .product-actions-add-to-cart-button");

  if (!target) return;

  if (target.matches(".nav-shopping-cart-toggle-button")) {
    // the shopping cart button in nav
    toggleCart();
    if (target.getAttribute("aria-expanded") === "false") {
      target.setAttribute("aria-expanded", "true");
    } else {
      target.setAttribute("aria-expanded", "false");
    }
  } else if (target.matches(".product-actions-button")) {
    // the increase/decrease buttons
    if (target.hasAttribute("data-decrease-button")) {
      product.quantity--;
    } else if (target.hasAttribute("data-increase-button")) {
      product.quantity++;
    }

    quantityInput.value = product.quantity;
    toggleDisabledStateOnButtons(decreaseButton, increaseButton);

  } else if (target.matches(".product-actions-add-to-cart-button")) {
    // the add to cart button
    
    if (cartButton.getAttribute("aria-expanded") === "false") {
      toggleCart();
      cartButton.setAttribute("aria-expanded", "true");
    }

    if (product.quantity === 0) {
      if(cartCounter) {
        cartCounter.remove();
        cartCounter = null;

        editCartContent(productQuantityText, productCostText);
        editProductIconContent(productIconTitle, productIconDesc);

        emptyCartContent.classList.remove("cart-hidden");
        filledCartContent.classList.add("cart-hidden");
      } else {
        product.quantity = 1;
        showCartCounter(cartButton, product);
        cartCounter = document.querySelector(".cart-counter");
        toggleDisabledStateOnButtons(decreaseButton, increaseButton);
        quantityInput.value = 1;

        editCartContent(productQuantityText, productCostText);
        editProductIconContent(productIconTitle, productIconDesc);

        emptyCartContent.classList.add("cart-hidden");
        filledCartContent.classList.remove("cart-hidden");
        return;
      }

    } else if (0 < product.quantity) {
      emptyCartContent.classList.add("cart-hidden");
      filledCartContent.classList.remove("cart-hidden");

      editCartContent(productQuantityText, productCostText);
      editProductIconContent(productIconTitle, productIconDesc);
      checkoutButton.focus();

      if (cartCounter) {
        cartCounter.firstElementChild.textContent = product.quantity;
      } else {
        showCartCounter(cartButton, product);
        cartCounter = document.querySelector(".cart-counter");
      }
    }
  }

  function toggleCart() {
    cart.classList.toggle("cart-hidden");
  }

  function toggleDisabledStateOnButtons(decreaseButton, increaseButton) {
    if (product.quantity === 0) {
      decreaseButton.setAttribute("disabled", "true");
    } else if (product.quantity === 1) {
      decreaseButton.removeAttribute("disabled");
    } else if (product.quantity === 8) {
      increaseButton.removeAttribute("disabled");
    } else if (product.quantity === 9) {
      increaseButton.setAttribute("disabled", "true");
    }
  }

  function showCartCounter(cartButton, product) {
    cartButton.insertAdjacentHTML(
      "beforeend",
      `<span class="cart-counter" aria-hidden="true"><span>${product.quantity}</span></span>`
    )
  }
}

function editProductIconContent(title, desc) {
  title.textContent = `Cart ${product.quantity} Items`;
  desc.textContent = `Cart ${product.quantity} Items`;
}

function editCartContent(quantity, cost) {
  quantity.textContent = product.quantity;
  cost.textContent = `$${product.quantity * product.cost}.00`;
}

function emptyCart() {
  filledCartContent.classList.add("cart-hidden");
  emptyCartContent.classList.remove("cart-hidden");
  product.quantity = 0;
  cartCounter.remove();
  cartCounter = null;
  quantityInput.value = "";
  editProductIconContent(productIconTitle, productIconDesc);
  editCartContent(productQuantityText, productCostText);
}

function goToCheckout() {
  emptyCart();
  cart.classList.toggle("cart-hidden");
  cartButton.setAttribute("aria-expanded", "false");
  alert("thanks");
}