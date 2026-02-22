document.addEventListener("DOMContentLoaded", function () {

    /* ================= SMOOTH SCROLL ================= */

    window.scrollToSection = function (id) {
        document.getElementById(id).scrollIntoView({
            behavior: "smooth"
        });
    };


    /* ================= ROTATING MARQUEE TAGLINES ================= */

    const baseTaglines = [
        "690 Laps. No Mercy.",
        "Hallway Endurance World Record Attempt.",
        "Hydration is Optional.",
        "Blisters are Temporary. Glory is Forever.",
        "Dorm History Will Be Made."
    ];

    const mainTitle = "Sammy’s Marathon";

    // Repeat main title in last 5 slots
    const extendedTaglines = [
        ...baseTaglines,
        mainTitle,
        mainTitle,
        mainTitle,
        mainTitle,
        mainTitle
    ];

    const taglineElement = document.getElementById("tagline");
    let taglineIndex = 0;

    function showTagline() {
        const text = extendedTaglines[taglineIndex];
        taglineElement.textContent = text;

        // Reset off-screen left
        taglineElement.style.transition = "none";
        taglineElement.style.transform = "translateX(-100%)";
        taglineElement.style.opacity = 0;

        // Force reflow
        void taglineElement.offsetWidth;

        // Zip in fast
        taglineElement.style.transition =
            "transform 1s cubic-bezier(0.25, 1, 0.5, 1), opacity 0.3s ease-in";
        taglineElement.style.transform = "translateX(10%)";
        taglineElement.style.opacity = 1;

        // Slow move toward center
        setTimeout(() => {
            taglineElement.style.transition = "transform 2s linear";
            taglineElement.style.transform = "translateX(50%)";
        }, 1000);

        // Glide out
        setTimeout(() => {
            taglineElement.style.transition =
                "transform 1.5s ease-in, opacity 1.5s ease-in";
            taglineElement.style.transform = "translateX(120%)";
            taglineElement.style.opacity = 0;
        }, 3500);

        taglineIndex = (taglineIndex + 1) % extendedTaglines.length;
    }

    showTagline();
    setInterval(showTagline, 5000);


    /* ================= COUNTDOWN TIMER ================= */

    function getNextTuesdayNoon() {
        const now = new Date();
        const dayOfWeek = now.getDay(); // Sunday=0 ... Saturday=6
        let daysUntilTuesday = (2 - dayOfWeek + 7) % 7;

        if (daysUntilTuesday === 0 && now.getHours() >= 12) {
            daysUntilTuesday = 7;
        }

        const nextTuesday = new Date(now);
        nextTuesday.setDate(now.getDate() + daysUntilTuesday);
        nextTuesday.setHours(12, 0, 0, 0);

        return nextTuesday;
    }

    const eventDate = getNextTuesdayNoon().getTime();
    const countdownElement = document.getElementById("countdown");

    function updateCountdown() {
        const now = new Date().getTime();
        const distance = eventDate - now;

        if (distance < 0) {
            countdownElement.innerHTML = "THE MARATHON HAS BEGUN.";
            return;
        }

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor(
            (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        const minutes = Math.floor(
            (distance % (1000 * 60 * 60)) / (1000 * 60)
        );
        const seconds = Math.floor(
            (distance % (1000 * 60)) / 1000
        );

        countdownElement.innerHTML =
            days + "d " +
            hours + "h " +
            minutes + "m " +
            seconds + "s";
    }

    setInterval(updateCountdown, 1000);
    updateCountdown();


    /* ================= LOAD BETTING ODDS ================= */

    async function loadOdds() {
        try {
            const response = await fetch("odds.json");
            const data = await response.json();

            const bettingSection = document.getElementById("betting");

            // Prevent duplicates on reload
            bettingSection.innerHTML = "<h2>Countdown Timer</h2><div id='countdown'></div><h2>Betting Section</h2>";

            data.markets.forEach(market => {
                const marketDiv = document.createElement("div");
                marketDiv.style.marginBottom = "30px";

                const title = document.createElement("h3");
                title.textContent = market.title;
                marketDiv.appendChild(title);

                market.options.forEach(option => {
                    const p = document.createElement("p");
                    p.textContent = option.name + " — " + option.odds;
                    marketDiv.appendChild(p);
                });

                bettingSection.appendChild(marketDiv);
            });

        } catch (error) {
            console.error("Error loading odds:", error);
        }
    }

    loadOdds();

});
