const Carousel = (() => {
    const getActiveSlide = () =>
        document.querySelector(".carousel__slide.active");
    const getFirstSlide = () =>
        document.querySelector(".carousel__slider").firstElementChild;
    const getLastSlide = () =>
        document.querySelector(".carousel__slider").lastElementChild;

    const getSiblingSlide = (slide, direction) =>
        direction === "prev"
            ? slide.previousElementSibling
            : slide.nextElementSibling;

    const getNewActiveSlide = (key, activeSlide) => {
        const actions = {
            Home: getFirstSlide,
            End: getLastSlide,
            ArrowLeft: () => getSiblingSlide(activeSlide, "prev"),
            ArrowRight: () => getSiblingSlide(activeSlide, "next")
        };
        return actions[key]?.() || null;
    };

    const updateScreen = (activeSlide) => {
        const carouselScreen = document.querySelector(".image-display .screen");
        const img = activeSlide.querySelector("img").cloneNode(true);
        carouselScreen.innerHTML = "";
        carouselScreen.appendChild(img);
    };

    const scrollToActiveSlide = (activeSlide) => {
        const carouselSlider = document.querySelector(".carousel__slider");
        const { offsetLeft, offsetWidth } = activeSlide;
        const { clientWidth } = carouselSlider;

        carouselSlider.scrollTo({
            left: offsetLeft - clientWidth / 2 + offsetWidth / 2,
            behavior: "smooth"
        });
    };

    const updateActiveSlideClass = (activeSlide) => {
        document
            .querySelectorAll(".carousel__slide.active")
            .forEach((slide) => slide.classList.remove("active"));
        activeSlide.classList.add("active");
    };

    const updateCarousel = (activeSlide) => {
        updateActiveSlideClass(activeSlide);
        updateScreen(activeSlide);
        scrollToActiveSlide(activeSlide);
        updateButtonStates(activeSlide);
    };

    const updateButtonStates = (activeSlide) => {
        const prevButton = document.querySelector(".carousel__btn.prev");
        const nextButton = document.querySelector(".carousel__btn.next");

        prevButton.disabled = !getSiblingSlide(activeSlide, "prev");
        nextButton.disabled = !getSiblingSlide(activeSlide, "next");
    };

    const handleKeydown = (e) => {
        if (!e.target.closest(".carousel__slider")) return;
        const activeSlide = getActiveSlide();
        const newActiveSlide = getNewActiveSlide(e.key, activeSlide);

        if (newActiveSlide) {
            e.preventDefault();
            updateCarousel(newActiveSlide);
        }
    };

    const handleButtonClick = (e) => {
        const activeSlide = getActiveSlide();
        const newActiveSlide = getSiblingSlide(
            activeSlide,
            e.currentTarget.classList.contains("prev") ? "prev" : "next"
        );

        if (newActiveSlide) {
            updateCarousel(newActiveSlide);
        }
    };

    const handleCarouselClick = (e) => {
        const clickedSlide = e.target.closest(".carousel__slide");
        if (clickedSlide) {
            updateCarousel(clickedSlide);
        }
    };

    const initCarousel = () => {
        const carouselSlider = document.querySelector(".carousel__slider");
        const prevButton = document.querySelector(".carousel__btn.prev");
        const nextButton = document.querySelector(".carousel__btn.next");

        updateCarousel(getFirstSlide());

        document.addEventListener("keydown", handleKeydown);
        prevButton.addEventListener("click", handleButtonClick);
        nextButton.addEventListener("click", handleButtonClick);
        carouselSlider.addEventListener("click", handleCarouselClick);
    };

    initCarousel();
})();
