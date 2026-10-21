
const book = document.getElementById("book");
const openBook = document.getElementById("openBook");
const song = document.getElementById("song");
const musicToggle = document.getElementById("musicToggle");
const statusText = document.getElementById("status");
const yesButton = document.getElementById("yesButton");
const noButton = document.getElementById("noButton");
const loopMessage = document.getElementById("loopMessage");
const lyricsOverlay = document.getElementById("lyricsOverlay");
const lyricsText = document.getElementById("lyricsText");

const pages = [...document.querySelectorAll(".page[data-page]")];

let currentPage = 0;
let noCount = 0;
let messageIndex = 0;
let lastLyricIndex = -1;
let messageTimer = null;
let statusTimer = null;

// EMAILJS SETTINGS — KEEP THESE MATCHED TO YOUR ACCOUNT
const EMAILJS_SERVICE_ID = "service_h7frpgp";
const EMAILJS_TEMPLATE_ID = "template_x8ibc85";

// These are original romantic captions, not the song's lyrics.
// Replace them with lyrics you provide if you want the actual words.
const lyricLines = [
  "Every little moment feels sweeter with you. ♡",
  "If I could choose again, I'd still choose you. 💗",
  "Somehow, you make ordinary days feel magical. ✨",
  "Let the music play while we make a memory. 🎶",
  "A little movie, a little music, and you. 🍿",
  "Maybe this is my favorite kind of story. 🌷",
  "And if the song ends, I hope our story doesn't. ♡",
  "Just you, me, and a moment worth keeping. 💌"
];

const loopingMessages = [
  "Psst... you're my favorite person ♡",
  "Imagine us singing along together 🎶",
  "A date with you sounds pretty perfect 💗",
  "I saved a little place for you in my heart 🌷",
  "Just one YES could make my day 🥺",
  "You + me + a movie = a happy little memory 🍿",
  "This tiny book was made just for you 💌",
  "Okay, but imagine how cute we'd look together ♡"
];

// OPEN THE BOOK
openBook.addEventListener("click", async () => {
  book.classList.add("open");

  try {
    await song.play();
  } catch (error) {
    console.log("Music needs to be started manually:", error);
    musicToggle.textContent = "▶ Play music";
  }
});

// MUSIC BUTTON
musicToggle.addEventListener("click", async () => {
  if (song.paused) {
    try {
      await song.play();
    } catch (error) {
      console.error("Unable to play music:", error);
      musicToggle.textContent = "▶ Play music";
    }
  } else {
    song.pause();
  }
});

// KEEP THE RECORD, BUTTON, AND OVERLAY IN SYNC
function updateMusicDisplay() {
  const playing = !song.paused && !song.ended;

  musicToggle.textContent = playing
    ? "Ⅱ Pause music"
    : "▶ Play music";

  book.classList.toggle("music-playing", playing);

  lyricsOverlay.hidden = !(playing && book.classList.contains("open"));

  if (playing && lastLyricIndex === -1) {
    updateLyricCaption();
  }
}

song.addEventListener("play", updateMusicDisplay);
song.addEventListener("pause", updateMusicDisplay);
song.addEventListener("ended", updateMusicDisplay);

// CHANGE CAPTIONS ACCORDING TO THE SONG'S PLAYBACK TIME
function updateLyricCaption() {
  if (!Number.isFinite(song.currentTime)) return;

  // Each caption lasts approximately 5 seconds.
  // These are timed captions, not verified song-lyric timestamps.
  const intervalSeconds = 5;
  const index =
    Math.floor(song.currentTime / intervalSeconds) % lyricLines.length;

  if (index === lastLyricIndex) return;

  lastLyricIndex = index;
  lyricsText.textContent = lyricLines[index];

  lyricsOverlay.classList.remove("lyric-change");
  void lyricsOverlay.offsetWidth;
  lyricsOverlay.classList.add("lyric-change");
}

song.addEventListener("timeupdate", updateLyricCaption);

song.addEventListener("seeked", () => {
  lastLyricIndex = -1;
  updateLyricCaption();
});

// LOOP THE ROMANTIC MESSAGE UNDER YES / NO
function changeLoopMessage() {
  if (!loopMessage) return;

  messageIndex = (messageIndex + 1) % loopingMessages.length;

  loopMessage.classList.remove("changing");
  void loopMessage.offsetWidth;

  loopMessage.textContent = loopingMessages[messageIndex];
  loopMessage.classList.add("changing");
}

messageTimer = setInterval(changeLoopMessage, 3200);

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

  // Keep the overlay on top of the open book only.
  updateMusicDisplay();
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

// RETURN TO PAGE ONE
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
    "I would love to go with you ♡",
    "The YES button is getting bigger! 😭💗",
    "I'll keep asking nicely... 🥹"
  ];

  statusText.textContent =
    messages[Math.min(noCount - 1, messages.length - 1)];

  noButton.style.transform =
    `translateX(${noCount % 2 ? 6 : -6}px)`;
});

// YES BUTTON: SEND EMAIL NOTIFICATION
yesButton.addEventListener("click", async () => {
  if (yesButton.disabled) return;

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
        message:
          "She accepted your invitation on your romantic book website!",
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

  setTimeout(() => {
    showPage(1);

    statusText.textContent = "";
    yesButton.disabled = false;
    noButton.disabled = false;

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

// INITIAL STATE
showPage(0);
updateMusicDisplay();
