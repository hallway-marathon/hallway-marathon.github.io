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

function getRandomTagline() {
    return taglines[Math.floor(Math.random() * taglines.length)];
}

function animateTagline() {
    taglineElement.style.transition = "none";
    taglineElement.style.transform = "translateX(-120%)";
    taglineElement.style.opacity = "0";

    taglineElement.innerText = getRandomTagline();

    setTimeout(() => {
        taglineElement.style.transition = "transform 2.5s ease-out, opacity 0.4s";
        taglineElement.style.transform = "translateX(0%)";
        taglineElement.style.opacity = "1";
    }, 100);

    setTimeout(() => {
        taglineElement.style.transition = "transform 1s ease-in, opacity 0.5s";
        taglineElement.style.transform = "translateX(120%)";
        taglineElement.style.opacity = "0";
    }, 3500);
}

animateTagline();
setInterval(animateTagline, 4500);
