const toggleButton = document.getElementById('toggle-button');
        const navLinks = document.getElementById('nav-links');

        toggleButton.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });


$(document).ready(function () {
    $('.container').mouseenter(function () {
        $('.card').stop().animate({
            top: '-90px'
        }, 'slow');
    }).mouseleave(function () {
        $('.card').stop().animate({
            top: 0
        }, 'slow');
    });
});