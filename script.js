
const book = document.getElementById("book");
const openBook = document.getElementById("openBook");
const song = document.getElementById("song");
const musicToggle = document.getElementById("musicToggle");
const statusText = document.getElementById("status");
const yesButton = document.getElementById("yesButton");
const noButton = document.getElementById("noButton");

const pages = [...document.querySelectorAll(".page[data-page]")];

let currentPage = 0;
let noCount = 0;

// EMAILJS SETTINGS
const EMAILJS_SERVICE_ID = "service_h7frpgp";
const EMAILJS_TEMPLATE_ID = "template_x8ibc85";

// OPEN THE PINK BOOK
openBook.addEventListener("click", async () => {
  book.classList.add("open");

  try {
    await song.play();
    musicToggle.textContent = "Ⅱ Pause music";
  } catch {
    musicToggle.textContent = "▶ Play music";
  }
});

// MUSIC BUTTON
musicToggle.addEventListener("click", async () => {
  if (song.paused) {
    try {
      await song.play();
      musicToggle.textContent = "Ⅱ Pause music";
    } catch {
      musicToggle.textContent = "▶ Play music";
    }
  } else {
    song.pause();
    musicToggle.textContent = "▶ Play music";
  }
});

// SHOW A BOOK PAGE
function showPage(index) {
  currentPage = Math.max(0, Math.min(pages.length - 1, index));

  pages.forEach((page, i) => {
    page.hidden = i !== currentPage;
    page.classList.toggle("active", i === currentPage);
  });

  if (currentPage === 0) {
    const tickets = document.querySelector(".tickets");
    const cartoon = document.querySelector(".cartoon");

    [tickets, cartoon].forEach((element) => {
      if (!element) return;

      element.style.animation = "none";
      void element.offsetWidth;
      element.style.animation = "";
    });
  }
}

// NEXT PAGE BUTTONS
document.querySelectorAll("[data-next]").forEach((button) => {
  button.addEventListener("click", () => {
    showPage(currentPage + 1);
  });
});

// BACK BUTTONS
document.querySelectorAll("[data-back]").forEach((button) => {
  button.addEventListener("click", () => {
    showPage(currentPage - 1);
  });
});

// RETURN TO PAGE 1
document.getElementById("restartButton").addEventListener("click", () => {
  showPage(0);
});

// NO BUTTON: YES BUTTON GROWS
noButton.addEventListener("click", () => {
  noCount++;

  yesButton.style.transform =
    `scale(${Math.min(1 + noCount * 0.12, 1.65)})`;

  const messages = [
    "Are you sure? 🥺",
    "Think about the tickets! 💗",
    "One little date? 🌷",
    "I would love to go with you ♡"
  ];

  statusText.textContent =
    messages[Math.min(noCount - 1, messages.length - 1)];

  noButton.style.transform =
    `translateX(${noCount % 2 ? 6 : -6}px)`;
});

// YES BUTTON: SEND EMAIL NOTIFICATION
yesButton.addEventListener("click", async () => {
  // Prevent repeated clicks while the email is being sent.
  yesButton.disabled = true;
  noButton.disabled = true;
  statusText.textContent = "Sending your answer... 💌";

  let emailSent = false;

  try {
    if (!window.emailjs) {
      throw new Error("EmailJS library did not load.");
    }

    const response = await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID,
      {
        subject: "She said YES! 💗",
        message: "She accepted your invitation on your romantic book website!",
        answer: "YES 💗",
        response: "YES",
        date: "Friday, October 30, 2026"
      }
    );

    emailSent = true;
    console.log("EmailJS notification sent:", response.status);
    statusText.textContent = "YES! Email notification sent! 💗💌";
  } catch (error) {
    console.error("EmailJS notification failed:", error);

    statusText.textContent =
      "You said YES! 💗 The email couldn't be sent, but let's continue.";
  }

  // Turn to Page 2 whether or not the email succeeded.
  setTimeout(() => {
    showPage(1);
    statusText.textContent = "";

    yesButton.disabled = false;
    noButton.disabled = false;

    // Reset button size for when Page 1 is revisited.
    yesButton.style.transform = "";
    noButton.style.transform = "";
    noCount = 0;
  }, emailSent ? 1200 : 1800);
});

// FOUR PHOTO PREVIEWS
document.querySelectorAll(".media-slot input").forEach((input, index) => {
  input.addEventListener("change", () => {
    const file = input.files?.[0];
    if (!file) return;

    const slot = input.closest(".media-slot");
    const image = slot.querySelector("img");
    const label = slot.querySelector("small");
    const plus = slot.querySelector("span");

    if (image.dataset.previewUrl) {
      URL.revokeObjectURL(image.dataset.previewUrl);
    }

    const previewUrl = URL.createObjectURL(file);

    image.src = previewUrl;
    image.dataset.previewUrl = previewUrl;
    image.style.display = "block";
    plus.style.display = "none";
    label.textContent = `Photo ${index + 1} ✓`;
  });
});

// VIDEO PREVIEW
const videoInput = document.getElementById("videoInput");
const videoPreview = document.getElementById("videoPreview");

videoInput.addEventListener("change", () => {
  const file = videoInput.files?.[0];
  if (!file) return;

  if (videoPreview.dataset.previewUrl) {
    URL.revokeObjectURL(videoPreview.dataset.previewUrl);
  }

  const previewUrl = URL.createObjectURL(file);

  videoPreview.src = previewUrl;
  videoPreview.dataset.previewUrl = previewUrl;
  videoPreview.hidden = false;
  videoPreview.load();
});
