/* SLIDER CONSTRUCT */
function Slider(target, property) {
  const slider = this;

  slider.wrapper = document.querySelector(`.${target}`);
  slider.wrapperSlide = slider.wrapper.getElementsByClassName("wrapper-slide")[0];
  slider.slide = slider.wrapperSlide.children;

  slider.index = 0;

  slider.slideIdentify;
  slider.property = property;

  initializeSlider(slider);
}

const initializeSlider = (slider) => {
  getSlide = () => slider.wrapperSlide.children;

  /* VARIABLES ELEMENTS */
  let prevButton,
    nextButton,
    bullets,
    slideWidth = slider.slide[0].clientWidth,
    infinite = false,
    loop = false;

  if (slider.property.breakpoints) {
    let sizeWidth = window.innerWidth,
      slidePerPage,
      spaceBetween = 0;

    let breakpoints = slider.property.breakpoints;
    let keys = Object.keys(breakpoints);

    if (sizeWidth > keys[2]) {
      slidePerPage = breakpoints[keys[2]];
    } else if (sizeWidth > keys[1]) {
      slidePerPage = breakpoints[keys[1]];
    } else {
      slidePerPage = breakpoints[keys[0]];
    }

    if (slider.property.spaceBetween) {
      spaceBetween = slider.property.spaceBetween;
    }

    for (let i = 0; i < slider.slide.length; i++) {
      slider.slide[i].style.marginRight = `${spaceBetween}px`;
      slider.slide[i].style.minWidth = `calc((100% - ${spaceBetween}px) / ${slidePerPage})`;
    }

    slideWidth = slider.slide[0].clientWidth + spaceBetween;
  }

  if (slider.wrapper.getElementsByClassName("slide-controls")[0]) {
    let slideControls = slider.wrapper.getElementsByClassName("slide-controls")[0];
    prevButton = slideControls.children[0];
    nextButton = slideControls.children[1];
  }

  if (slider.wrapper.getElementsByClassName("slide-navigation")) {
    let slideNavigation = slider.wrapper.getElementsByClassName("slide-navigation")[0];

    /* INITIALIZE BULLETS NAVIGATION */
    let spanLength = slider.slide.length;

    for (let i = 0; i < spanLength; i++) {
      let span = document.createElement("span");
      span.classList.add("bullet");
      if (i == 0) span.classList.add("active");
      slideNavigation.appendChild(span);
    }

    bullets = slideNavigation.children;
  }

  if (slider.property.infinite) {
    infinite = true;
  }

  if (slider.property.loop) {
    loop = true;
  }

  /* RESET BULLETS */
  if (bullets) {
    function resetBullets(index) {
      for (let i = 0; i < bullets.length; i++) {
        bullets[i].classList.remove("active");
      }

      bullets[index].classList.add("active");
    }
  }

  /* CONSTROLS NAVIGATION SLIDER */
  function moveToNextSlide() {
    slider.slide = getSlide();
    if (slider.index >= slider.slide.length - 1) return;

    slider.index++;
    slider.wrapperSlide.style.transform = `translateX(${-slideWidth * slider.index}px)`;
    slider.wrapperSlide.style.transition = `1s`;

    if (bullets) {
      if (infinite) {
        // if(slider.index == 0) {resetBullets(slider.index);}
        if (slider.index <= bullets.length) resetBullets(slider.index - 1);
      } else {
        if (slider.index <= bullets.length) resetBullets(slider.index);
      }
    }
  }

  function moveToPreviousSlide() {
    slider.slide = getSlide();

    if (infinite) {
      if (slider.index <= 0) return;
    } else {
      if (slider.index <= 0) return;
    }

    slider.index--;
    slider.wrapperSlide.style.transform = `translateX(${-slideWidth * slider.index}px)`;
    slider.wrapperSlide.style.transition = `1s`;

    console.log(slider.index);

    if (bullets) {
      if (infinite) {
        if (slider.index > 0) resetBullets(slider.index - 1);
      } else {
        if (slider.index >= 0) resetBullets(slider.index);
      }
    }
  }

  if (bullets) {
    for (let i = 0; i < bullets.length; i++) {
      bullets[i].addEventListener("click", () => {
        if (infinite) {
          slider.index = i + 1;
        } else {
          slider.index = i;
        }

        slider.wrapperSlide.style.transform = `translateX(${-slideWidth * slider.index}px)`;
        slider.wrapperSlide.style.transition = `1s`;

        resetBullets(i);
      });
    }
  }

  nextButton.addEventListener("click", moveToNextSlide);
  prevButton.addEventListener("click", moveToPreviousSlide);

  /* INFINITE SLIDER */
  if (infinite) {
    infiniteSlider(slider, bullets, slideWidth, resetBullets);
  }

  /* LOOP SLIDER */
  if (loop) {
    loopSlider(slider, moveToNextSlide);
  }
};

const infiniteSlider = (slider, bullets, slideWidth, resetBullets) => {
  slider.index = 1;

  let firstClone = slider.slide[0].cloneNode(true),
    lastClone = slider.slide[slider.slide.length - 1].cloneNode(true);

  firstClone.setAttribute("data-slide", "fisrt-clone");
  lastClone.setAttribute("data-slide", "last-clone");

  slider.wrapperSlide.append(firstClone);
  slider.wrapperSlide.prepend(lastClone);

  slider.slide = getSlide();

  slider.wrapperSlide.style.transform = `translateX(${-slideWidth * slider.index}px)`;

  slider.wrapperSlide.addEventListener("transitionend", () => {
    slider.slide = getSlide();
    if (slider.slide[slider.index].dataset.slide === "fisrt-clone") {
      slider.wrapperSlide.style.transition = `none`;
      slider.index = 1;
      slider.wrapperSlide.style.transform = `translateX(${-slideWidth * slider.index}px)`;
    }

    if (slider.slide[slider.index].dataset.slide === "last-clone") {
      slider.wrapperSlide.style.transition = `none`;
      slider.index = slider.slide.length - 2;
      slider.wrapperSlide.style.transform = `translateX(${-slideWidth * slider.index}px)`;
    }
  });

  if (bullets) {
    slider.wrapperSlide.addEventListener("transitionstart", () => {
      slider.slide = getSlide();
      if (slider.slide[slider.index].dataset.slide === "fisrt-clone") {
        resetBullets(0);
      }
      if (slider.slide[slider.index].dataset.slide == "last-clone") {
        resetBullets(bullets.length - 1);
      }
    });
  }
};

const loopSlider = (slider, moveToNextSlide) => {
  startSlide();

  function startSlide() {
    slider.slideIdentify = setInterval(() => {
      moveToNextSlide();
    }, 2000);
  }

  slider.wrapper.addEventListener("mouseenter", () => clearInterval(slider.slideIdentify));
  slider.wrapper.addEventListener("mouseleave", startSlide);
};

window.addEventListener("DOMContentLoaded", () => {
  var wrapperBannerInfinite = new Slider("wrapper-banner-infinite", { infinite: true, loop: true, breakpoints: { 0: 1, 480: 2, 992: 3 }, spaceBetween: 12 });
});
