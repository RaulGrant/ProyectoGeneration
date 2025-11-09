// 🌐 Navbar reactiva
const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");

menuToggle.addEventListener("click", () => {
  navLinks.classList.toggle("active");
});

// 🖼️ Carruseles independientes
const carousels = document.querySelectorAll(".carousel");

carousels.forEach((carousel) => {
  const slides = carousel.querySelectorAll(".slide");
  const next = carousel.querySelector(".next");
  const prev = carousel.querySelector(".prev");

  let index = 0;

  function showSlide(i) {
    slides.forEach((s, idx) => {
      s.style.display = idx === i ? "block" : "none";
    });
  }

  showSlide(index);

  next.addEventListener("click", () => {
    index = (index + 1) % slides.length;
    showSlide(index);
  });

  prev.addEventListener("click", () => {
    index = (index - 1 + slides.length) % slides.length;
    showSlide(index);
  });

  // autoplay
  setInterval(() => {
    index = (index + 1) % slides.length;
    showSlide(index);
  }, 5000);
});
