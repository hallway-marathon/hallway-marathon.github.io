document.addEventListener("DOMContentLoaded", function () {

    /* ================= SMOOTH SCROLL ================= */

    window.scrollToSection = function (id) {
        document.getElementById(id).scrollIntoView({
            behavior: "smooth"
        });
    };


    /* ================= ROTATING TAGLINES ================= */

    const baseTaglines = [
        "690 Laps. No Mercy.",
        "Hallway Endurance World Record Attempt.",
        "Hydration is Optional.",
        "Blisters are Temporary. Glory is Forever.",
        "Dorm History Will Be Made."
    ];

    const mainTitle = "Sammy’s Marathon";

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

        taglineElement.style.transition = "none";
        taglineElement.style.transform = "translateX(-100%)";
        taglineElement.style.opacity = 0;

        void taglineElement.offsetWidth;

        taglineElement.style.transition =
            "transform 1s cubic-bezier(0.25, 1, 0.5, 1), opacity 0.3s ease-in";
        taglineElement.style.transform = "translateX(10%)";
        taglineElement.style.opacity = 1;

        setTimeout(() => {
            taglineElement.style.transition = "transform 2s linear";
            taglineElement.style.transform = "translateX(50%)";
        }, 1000);

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
        const dayOfWeek = now.getDay();
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

                // Animate fill
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
