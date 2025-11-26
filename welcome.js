// Remove background color shift — only ripple effect on click
document.addEventListener("click", () => {
  document.body.classList.add("clicked");
  setTimeout(() => {
    document.body.classList.remove("clicked");
  }, 500);
});

// Load particles.js config
particlesJS("particles-js", {
  particles: {
    number: { value: 60, density: { enable: true, value_area: 800 } },
    color: { value: "#a970ff" },
    shape: { type: "circle" },
    opacity: { value: 0.3 },
    size: { value: 3 },
    line_linked: {
      enable: true,
      distance: 150,
      color: "#a970ff",
      opacity: 0.2,
      width: 1
    },
    move: {
      enable: true,
      speed: 2,
      direction: "none",
      out_mode: "out"
    }
  },
  interactivity: {
    detect_on: "canvas",
    events: {
      onhover: { enable: true, mode: "repulse" },
      onclick: { enable: true, mode: "push" }
    },
    modes: {
      repulse: { distance: 100, duration: 0.4 },
      push: { particles_nb: 4 }
    }
  },
  retina_detect: true
});
