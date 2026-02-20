/* ================= SMOOTH SCROLL ================= */

function scrollToSection(id) {
    document.getElementById(id).scrollIntoView({
        behavior: "smooth"
    });
}

// ================= ROTATING MARQUEE TAGLINES =================

const baseTaglines = [
    "690 Laps. No Mercy.",
    "Hallway Endurance World Record Attempt.",
    "Hydration is Optional.",
    "Blisters are Temporary. Glory is Forever.",
    "Dorm History Will Be Made."
];

const mainTitle = "Sammy’s Marathon";

// For last 5, inject the title
const extendedTaglines = [...baseTaglines, mainTitle, mainTitle, mainTitle, mainTitle, mainTitle];

const taglineElement = document.getElementById("tagline");
let taglineIndex = 0;

function showTagline() {
    const text = extendedTaglines[taglineIndex];
    taglineElement.textContent = text;

    // Reset position off left
    taglineElement.style.transition = 'none';
    taglineElement.style.transform = 'translateX(-100%)';
    taglineElement.style.opacity = 0;

    // Force reflow
    void taglineElement.offsetWidth;

    // Animate: zip in, slow center, slide out
    taglineElement.style.transition = 'transform 2s cubic-bezier(0.5,0,0.5,1), opacity 0.5s ease';
    taglineElement.style.transform = 'translateX(10%)';
    taglineElement.style.opacity = 1;

    // Slide out after delay
    setTimeout(() => {
        taglineElement.style.transition = 'transform 1.5s ease-in, opacity 1.5s ease-in';
        taglineElement.style.transform = 'translateX(120%)';
        taglineElement.style.opacity = 0;
    }, 2000);

    taglineIndex = (taglineIndex + 1) % extendedTaglines.length;
}

// Start
showTagline();
setInterval(showTagline, 4000);


/* ================= COUNTDOWN TIMER ================= */

/* Set your event date here */
const eventDate = new Date("2026-05-01T18:00:00").getTime();

const countdownElement = document.getElementById("countdown");

function updateCountdown() {
    const now = new Date().getTime();
    const distance = eventDate - now;

    if (distance < 0) {
        countdownElement.innerHTML = "THE MARATHON HAS BEGUN.";
        return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    countdownElement.innerHTML =
        days + "d " +
        hours + "h " +
        minutes + "m " +
        seconds + "s ";
}

setInterval(updateCountdown, 1000);
updateCountdown();
