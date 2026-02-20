/* ================= SMOOTH SCROLL ================= */

function scrollToSection(id) {
    document.getElementById(id).scrollIntoView({
        behavior: "smooth"
    });
}

/* ================= ROTATING TAGLINES ================= */

const taglines = [
    "690 laps later",
    "The long hall",
    "4th floor legend",
    "Run the hall",
    "Built for the corridor",
    "Sammy vs the hallway",
    "Marathon, but its a dorm",
    "like that one guy on TikTok",
    "Hallway ultra",
    "#NoHillsNoExcuses",
    "Fire exit 26-2",
    "Sponsored by: The 3rd Floor Vending Machine",
    "Official Hydration Partner: That One Brita Filter",
    "Powered by 2 a.m. Motivation"
];

const taglineElement = document.getElementById("tagline");

let taglineIndex = 0;

function rotateTagline() {
    taglineElement.style.opacity = 0;

    setTimeout(() => {
        taglineElement.textContent = taglines[taglineIndex];
        taglineElement.style.opacity = 1;

        taglineIndex = (taglineIndex + 1) % taglines.length;
    }, 400);
}

taglineElement.textContent = taglines[0];
setInterval(rotateTagline, 3000);


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
