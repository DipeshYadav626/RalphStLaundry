window.addEventListener("load", function () {
    // JavaScript for Image Slider
    let currentSlide = 0;
    const slides = document.querySelectorAll(".slider img");
    const totalSlides = slides.length;
  
    // Function to show the current slide
    function showSlide(index) {
      slides.forEach((slide, i) => {
        slide.classList.remove("active");
        if (i === index) {
          slide.classList.add("active");
        }
      });
    }
  
    // Function to go to the next slide
    function nextSlide() {
      currentSlide = (currentSlide + 1) % totalSlides;
      showSlide(currentSlide);
    }
  
    // Show the first slide initially
    showSlide(currentSlide);
  
    // Change slide every 3 seconds
    setInterval(nextSlide, 3000);
  });
  
  // jQuery for Hamburger Menu Toggle
  $(function() {
    $('.hamburger').click(function() {
        $(this).toggleClass('active');
 
        if ($(this).hasClass('active')) {
            $('.globalMenuSp').addClass('active');
        } else {
            $('.globalMenuSp').removeClass('active');
        }
    });
});
$('.globalMenuSp').fadeIn(1000)
  