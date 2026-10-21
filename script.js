
const book = document.getElementById("book");
const openBook = document.getElementById("openBook");
const song = document.getElementById("song");
const musicToggle = document.getElementById("musicToggle");
const statusText = document.getElementById("status");

const pages = [...document.querySelectorAll(".page[data-page]")];

let currentPage = 0;
let noCount = 0;

// OPEN THE PINK BOOK
openBook.addEventListener("click", async () => {
  book.classList.add("open");

  // Try to start music after the user's click.
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

  // Restart the entrance animations when returning to Page 1.
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
document.getElementById("noButton").addEventListener("click", () => {
  noCount++;

  const noButton = document.getElementById("noButton");
  const yesButton = document.getElementById("yesButton");

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

// YES BUTTON
document.getElementById("yesButton").addEventListener("click", async () => {
  const yesButton = document.getElementById("yesButton");

  yesButton.disabled = true;
  statusText.textContent = "You said YES! 💗";

  // EMAILJS SETUP:
  // Replace these values after creating your EmailJS account.
  const PUBLIC_KEY = "YOUR_EMAILJS_PUBLIC_KEY";
  const SERVICE_ID = "YOUR_EMAILJS_SERVICE_ID";
  const TEMPLATE_ID = "YOUR_EMAILJS_TEMPLATE_ID";

  const emailConfigured = [
    PUBLIC_KEY,
    SERVICE_ID,
    TEMPLATE_ID
  ].every(value => value && !value.startsWith("YOUR_"));

  if (emailConfigured) {
    try {
      const response = await fetch(
        "https://api.emailjs.com/api/v1.0/email/send",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            service_id: SERVICE_ID,
            template_id: TEMPLATE_ID,
            user_id: PUBLIC_KEY,
            template_params: {
              subject: "She said YES! 💗",
              message:
                "She accepted your invitation on your romantic book website!",
              answer: "YES",
              date: "Friday, October 30, 2026"
            }
          })
        }
      );

      if (!response.ok) {
        throw new Error("Email could not be sent.");
      }

      statusText.textContent = "YES! Notification sent! 💌";
    } catch (error) {
      statusText.textContent =
        "YES! 💗 Your email notification needs checking.";
    }
  } else {
    statusText.textContent =
      "YES! 💗 Email notification needs to be configured.";
  }

  // Open Page 2 after the acceptance animation.
  setTimeout(() => {
    showPage(1);
    statusText.textContent = "";
    yesButton.disabled = false;
  }, 1200);
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
