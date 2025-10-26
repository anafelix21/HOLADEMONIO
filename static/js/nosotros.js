document.addEventListener("DOMContentLoaded", () => {
  const sections = document.querySelectorAll(".text-content, .image-content");
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("fade-in");
      }
    });
  }, { threshold: 0.2 });
  
  sections.forEach(section => observer.observe(section));
});
