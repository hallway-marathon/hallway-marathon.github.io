document.addEventListener("DOMContentLoaded", function () {

    /* ================= SMOOTH SCROLL ================= */

    window.scrollToSection = function (id) {
        document.getElementById(id).scrollIntoView({ behavior: "smooth" });
    };


    /* ================= ROTATING TAGLINES ================= */

    const taglines = [
        "Pain is temporary.",
        "690 laps. No mercy.",
        "Hydration is optional.",
        "The hallway will remember.",
        "Legends aren't comfortable.",
        "Dorm history in the making."
    ];

    const taglineElement = document.getElementById("tagline");
    let lastIndexes = [];

    function getUniqueTagline() {
        let available = taglines
            .map((_, i) => i)
            .filter(i => !lastIndexes.includes(i));

        if (available.length === 0) {
            lastIndexes = [];
            available = taglines.map((_, i) => i);
        }

        const pick = available[Math.floor(Math.random() * available.length)];
        lastIndexes.push(pick);
        if (lastIndexes.length > taglines.length - 1) lastIndexes.shift();
        return taglines[pick];
    }

    function animateTagline() {
        taglineElement.style.transition = "none";
        taglineElement.style.transform = "translateX(-100%)";
        taglineElement.style.opacity = "0";

        setTimeout(() => {
            taglineElement.textContent = getUniqueTagline();
            taglineElement.style.transition =
                "transform 3s cubic-bezier(0.2, 0.9, 0.3, 1), opacity 0.4s ease";
            taglineElement.style.transform = "translateX(0%)";
            taglineElement.style.opacity = "1";
        }, 100);

        setTimeout(() => {
            taglineElement.style.transition = "transform 1s ease-in, opacity 0.5s ease";
            taglineElement.style.transform = "translateX(100%)";
            taglineElement.style.opacity = "0";
        }, 4500);
    }

    animateTagline();
    setInterval(animateTagline, 6000);


    /* ================= COUNTDOWN TIMER ================= */

    function getNextTuesdayNoon() {
        const now = new Date();
        const dayOfWeek = now.getDay();
        let daysUntilTuesday = (2 - dayOfWeek + 7) % 7;

        // If it's already Tuesday past noon, push to next week
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
            countdownElement.innerHTML = "🚨 THE MARATHON HAS BEGUN.";
            return;
        }

        const days    = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours   = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        countdownElement.innerHTML =
            `${days}d ${hours}h ${minutes}m ${seconds}s`;
    }

    setInterval(updateCountdown, 1000);
    updateCountdown();


    /* ================= LOAD BETTING ODDS ================= */

    async function loadOdds() {
        try {
            const response = await fetch("odds.json");
            const data = await response.json();

            const container = document.getElementById("bets-container");
            container.innerHTML = "";

            data.bets.forEach(bet => {
                const betItem = document.createElement("div");
                betItem.className = "bet-item";

                const title = document.createElement("div");
                title.className = "bet-title";
                title.textContent = bet.title;

                const barContainer = document.createElement("div");
                barContainer.className = "bet-bar-container";

                const bar = document.createElement("div");
                bar.className = "bet-bar";

                const noDiv = document.createElement("div");
                noDiv.className = "bet-no";
                noDiv.style.width = "0%";
                noDiv.textContent = "NO " + bet.noPercent + "%";

                const yesDiv = document.createElement("div");
                yesDiv.className = "bet-yes";
                yesDiv.style.width = "0%";
                yesDiv.textContent = "YES " + bet.yesPercent + "%";

                const info = document.createElement("div");
                info.className = "bet-info";
                info.textContent = "ⓘ";
                info.setAttribute("data-info", bet.description);

                bar.appendChild(noDiv);
                bar.appendChild(yesDiv);
                barContainer.appendChild(bar);
                barContainer.appendChild(info);
                betItem.appendChild(title);
                betItem.appendChild(barContainer);
                container.appendChild(betItem);

                // Animate bars in after a tick
                setTimeout(() => {
                    noDiv.style.width = bet.noPercent + "%";
                    yesDiv.style.width = bet.yesPercent + "%";
                }, 100);
            });

        } catch (error) {
            console.error("Error loading odds:", error);
        }
    }

    loadOdds();

});
