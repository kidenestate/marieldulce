(() => {
  // Use the business WhatsApp number in international format without spaces or +.
  const WHATSAPP_NUMBER = "256778281586";
  const whatsappPlaceholder = "+256 778 281 586";

  const menuToggle = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".primary-nav");
  const toast = document.querySelector("#toast");
  const form = document.querySelector("#order-form");
  const deliveryField = document.querySelector("#delivery-field");
  const deliveryLocation = document.querySelector("#delivery-location");
  const formError = document.querySelector("#form-error");
  const lightbox = document.querySelector("#lightbox");
  const backToTop = document.querySelector(".back-to-top");

  if (document.querySelector("#current-year")) {
    document.querySelector("#current-year").textContent =
      new Date().getFullYear();
  }

  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add("show");
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => toast.classList.remove("show"), 4200);
  }

  function closeMenu() {
    if (!nav || !menuToggle) return;
    nav.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation");
  }

  if (menuToggle && nav) {
    menuToggle.addEventListener("click", () => {
      const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
      menuToggle.setAttribute("aria-expanded", String(!isOpen));
      menuToggle.setAttribute(
        "aria-label",
        isOpen ? "Open navigation" : "Close navigation",
      );
      nav.classList.toggle("open", !isOpen);
    });

    nav
      .querySelectorAll("a")
      .forEach((link) => link.addEventListener("click", closeMenu));
    document.addEventListener("click", (event) => {
      if (!nav.contains(event.target) && !menuToggle.contains(event.target))
        closeMenu();
    });
  }

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeMenu();
      if (lightbox) closeLightbox();
    }
  });

  function openWhatsApp(message) {
    const cleanedNumber = String(WHATSAPP_NUMBER).replace(/\D/g, "");

    if (!/^\d{10,15}$/.test(cleanedNumber)) {
      showToast(
        `WhatsApp is ready to connect. Replace the placeholder ${whatsappPlaceholder} in script.js with the business number to enable ordering.`,
      );
      const orderSection = document.querySelector("#order");
      if (orderSection) orderSection.scrollIntoView({ behavior: "smooth" });
      return false;
    }

    const url = `https://wa.me/${cleanedNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank", "noopener,noreferrer");
    return true;
  }

  document.querySelectorAll(".whatsapp-trigger").forEach((button) => {
    button.addEventListener("click", () => {
      openWhatsApp(
        "Hello Mariel Dulce Cakes! I'd like to place an order. Please help me with the available cakes and prices.",
      );
    });
  });

  document.querySelectorAll(".order-product").forEach((button) => {
    button.addEventListener("click", () => {
      const productSelect = document.querySelector("#cake-choice");
      if (!productSelect) return;
      productSelect.value = button.dataset.product;
      const orderSection = document.querySelector("#order");
      if (orderSection) orderSection.scrollIntoView({ behavior: "smooth" });
      const customerName = document.querySelector("#customer-name");
      if (customerName) {
        window.setTimeout(
          () => customerName.focus({ preventScroll: true }),
          550,
        );
      }
    });
  });

  if (document.querySelector("#fulfilment")) {
    document
      .querySelector("#fulfilment")
      .addEventListener("change", (event) => {
        const needsLocation = event.target.value === "Delivery";
        if (deliveryField) deliveryField.hidden = !needsLocation;
        if (deliveryLocation) deliveryLocation.required = needsLocation;
      });
  }

  const dateInput = document.querySelector("#cake-date");
  if (dateInput) {
    const today = new Date();
    dateInput.min = new Date(
      today.getTime() - today.getTimezoneOffset() * 60000,
    )
      .toISOString()
      .slice(0, 10);
  }

  if (form) {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      if (formError) formError.textContent = "";
      if (!form.checkValidity()) {
        form.reportValidity();
        if (formError)
          formError.textContent =
            "Please complete the required fields and check the delivery details.";
        return;
      }

      const data = new FormData(form);
      const orderDetails = [
        "Hello Mariel Dulce Cakes! I'd like to enquire about an order:",
        "",
        `Name: ${data.get("name")}`,
        `Phone: ${data.get("phone")}`,
        `Cake / treat: ${data.get("product")}`,
        `Size: ${data.get("size") || "Please advise"}`,
        `Flavour: ${data.get("flavour") || "Please advise"}`,
        `Quantity: ${data.get("quantity")}`,
        `Preferred date: ${data.get("date")}`,
        `Pickup or delivery: ${data.get("fulfilment")}`,
        ...(data.get("fulfilment") === "Delivery"
          ? [`Delivery location: ${data.get("location")}`]
          : []),
        `Special instructions: ${data.get("notes") || "None"}`,
        "",
        "Please confirm availability and the final price. Thank you!",
      ].join("\n");

      if (openWhatsApp(orderDetails))
        showToast(
          "Your order message is ready in WhatsApp. Review and send it to confirm your enquiry.",
        );
    });
  }

  let activeImageIndex = 0;
  let previousFocus = null;
  let toastTimer;

  if (lightbox) {
    const lightboxImage = lightbox.querySelector("img");
    const galleryItems = [...document.querySelectorAll(".gallery-trigger")];

    function updateLightbox(index) {
      if (!galleryItems.length) return;
      activeImageIndex = (index + galleryItems.length) % galleryItems.length;
      const item = galleryItems[activeImageIndex];
      lightboxImage.src = item.dataset.image;
      lightboxImage.alt = item.dataset.alt;
      lightbox.querySelector(".lightbox-count").textContent =
        `${activeImageIndex + 1} / ${galleryItems.length}`;
    }

    function openLightbox(index) {
      previousFocus = document.activeElement;
      updateLightbox(index);
      lightbox.classList.add("open");
      lightbox.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
      lightbox.querySelector(".lightbox-close").focus();
    }

    function closeLightbox() {
      if (!lightbox.classList.contains("open")) return;
      lightbox.classList.remove("open");
      lightbox.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
      if (previousFocus) previousFocus.focus();
    }

    galleryItems.forEach((item, index) =>
      item.addEventListener("click", () => openLightbox(index)),
    );
    lightbox
      .querySelector(".lightbox-close")
      .addEventListener("click", closeLightbox);
    lightbox
      .querySelector(".lightbox-prev")
      .addEventListener("click", () => updateLightbox(activeImageIndex - 1));
    lightbox
      .querySelector(".lightbox-next")
      .addEventListener("click", () => updateLightbox(activeImageIndex + 1));
    lightbox.addEventListener("click", (event) => {
      if (event.target === lightbox) closeLightbox();
    });
    document.addEventListener("keydown", (event) => {
      if (!lightbox.classList.contains("open")) return;
      if (event.key === "ArrowLeft") updateLightbox(activeImageIndex - 1);
      if (event.key === "ArrowRight") updateLightbox(activeImageIndex + 1);
      if (event.key === "Tab") {
        const controls = [...lightbox.querySelectorAll("button")];
        const first = controls[0];
        const last = controls[controls.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    });
  }

  if (backToTop) {
    window.addEventListener(
      "scroll",
      () => {
        backToTop.classList.toggle("visible", window.scrollY > 600);
      },
      { passive: true },
    );
    backToTop.addEventListener("click", () =>
      window.scrollTo({ top: 0, behavior: "smooth" }),
    );
  }

  const navLinks = nav
    ? [...nav.querySelectorAll('a[href^="#"]')].filter(
        (link) => link.hash !== "#home",
      )
    : [];
  if (navLinks.length) {
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          navLinks.forEach((link) =>
            link.classList.toggle(
              "active",
              link.hash === `#${entry.target.id}`,
            ),
          );
        });
      },
      { rootMargin: "-32% 0px -58% 0px" },
    );
    navLinks.forEach((link) => {
      const section = document.querySelector(link.hash);
      if (section) sectionObserver.observe(section);
    });
  }

  if (
    "IntersectionObserver" in window &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches
  ) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 },
    );
    document
      .querySelectorAll(".reveal")
      .forEach((element) => revealObserver.observe(element));
  } else {
    document
      .querySelectorAll(".reveal")
      .forEach((element) => element.classList.add("revealed"));
  }
})();
