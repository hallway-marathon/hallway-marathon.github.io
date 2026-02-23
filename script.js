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

        countdownElement.innerHTML = `${days}d ${hours}h ${minutes}m ${seconds}s`;
    }

    setInterval(updateCountdown, 1000);
    updateCountdown();


    /* ================= BETTING ODDS ================= */

    function renderYesNo(bet, container) {
        const betItem = document.createElement("div");
        betItem.className = "bet-item";

        const title = document.createElement("div");
        title.className = "bet-title";
        title.textContent = bet.title;

        const barContainer = document.createElement("div");
        barContainer.className = "bet-bar-container";

        const bar = document.createElement("div");
        bar.className = "bet-bar";

        const yesDiv = document.createElement("div");
        yesDiv.className = "bet-yes";
        yesDiv.style.width = "0%";
        yesDiv.textContent = "YES " + bet.yesPercent + "%";

        const noDiv = document.createElement("div");
        noDiv.className = "bet-no";
        noDiv.style.width = "0%";
        noDiv.textContent = "NO " + bet.noPercent + "%";

        const info = document.createElement("div");
        info.className = "bet-info";
        info.textContent = "ⓘ";
        info.setAttribute("data-info", bet.description);

        bar.appendChild(yesDiv);
        bar.appendChild(noDiv);
        barContainer.appendChild(bar);
        barContainer.appendChild(info);
        betItem.appendChild(title);
        betItem.appendChild(barContainer);
        container.appendChild(betItem);

        setTimeout(() => {
            yesDiv.style.width = bet.yesPercent + "%";
            noDiv.style.width  = bet.noPercent  + "%";
        }, 100);
    }

    function renderHistogram(bet, container) {
        const betItem = document.createElement("div");
        betItem.className = "bet-item";

        const title = document.createElement("div");
        title.className = "bet-title";
        title.textContent = bet.title;

        // Count frequency of each guess
        const freq = {};
        bet.guesses.forEach(n => { freq[n] = (freq[n] || 0) + 1; });

        const keys   = Object.keys(freq).map(Number).sort((a, b) => a - b);
        const maxFreq = Math.max(...Object.values(freq));

        const histogram = document.createElement("div");
        histogram.className = "histogram";

        keys.forEach(val => {
            const count     = freq[val];
            const heightPct = (count / maxFreq) * 100;

            const col = document.createElement("div");
            col.className = "hist-col";

            const bar = document.createElement("div");
            bar.className = "hist-bar";
            bar.style.height = "0%";
            bar.setAttribute("data-tooltip", `${count} guess${count > 1 ? "es" : ""}`);

            const label = document.createElement("div");
            label.className = "hist-label";
            label.textContent = val;

            col.appendChild(bar);
            col.appendChild(label);
            histogram.appendChild(col);

            setTimeout(() => { bar.style.height = heightPct + "%"; }, 150);

            // Shared tooltip element
            bar.addEventListener("mouseenter", () => {
                let tip = document.getElementById("hist-tooltip");
                if (!tip) {
                    tip = document.createElement("div");
                    tip.id = "hist-tooltip";
                    tip.className = "hist-tooltip";
                    document.body.appendChild(tip);
                }
                tip.textContent = bar.getAttribute("data-tooltip");
                tip.style.display = "block";
            });

            bar.addEventListener("mousemove", (e) => {
                const tip = document.getElementById("hist-tooltip");
                if (tip) {
                    tip.style.left = (e.pageX + 14) + "px";
                    tip.style.top  = (e.pageY - 36) + "px";
                }
            });

            bar.addEventListener("mouseleave", () => {
                const tip = document.getElementById("hist-tooltip");
                if (tip) tip.style.display = "none";
            });
        });

        betItem.appendChild(title);
        betItem.appendChild(histogram);
        container.appendChild(betItem);
    }

    async function loadOdds() {
        try {
            const response = await fetch("odds.json");
            const data     = await response.json();
            const container = document.getElementById("bets-container");
            container.innerHTML = "";

            data.bets.forEach(bet => {
                if (bet.type === "yesno") {
                    renderYesNo(bet, container);
                } else if (bet.type === "histogram") {
                    renderHistogram(bet, container);
                }
            });

        } catch (error) {
            console.error("Error loading odds:", error);
        }
    }

    loadOdds();

});
