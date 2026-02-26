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

    // Marathon starts tomorrow at 12:00 PM
    // Month is 0-indexed: 0=Jan, 1=Feb, 2=Mar, 3=Apr ...
    const marathonStart = new Date(2026, 1, 25, 12, 0, 0); // Feb 26 at 12:00 PM
    const marathonEnd   = new Date(2026, 1, 25, 19, 59, 59); // Feb 27 at 11:59 PM

    const countdownElement = document.getElementById("countdown");

    function updateCountdown(finishTime) {
        const now       = new Date().getTime();
        const startDist = marathonStart.getTime() - now;
        const endDist   = marathonEnd.getTime() - now;

        if (startDist > 0) {
            // Counting down to start
            const days    = Math.floor(startDist / (1000 * 60 * 60 * 24));
            const hours   = Math.floor((startDist % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((startDist % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((startDist % (1000 * 60)) / 1000);

            countdownElement.innerHTML = days > 0
                ? `${days}d ${hours}h ${minutes}m ${seconds}s`
                : `${hours}h ${minutes}m ${seconds}s`;

        } else if (endDist > 0) {
            // Live
            countdownElement.innerHTML = "🚨 THE MARATHON HAS BEGUN.";

        } else {
            // Over
            if (finishTime && finishTime.trim() !== "") {
                countdownElement.innerHTML = `🏁 Marathon finished — Final time: ${finishTime}`;
            } else {
                countdownElement.innerHTML = "🏁 The marathon has finished.";
            }
        }
    }


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

        // Aggregate by number: sum money, count bets
        const totals = {};
        bet.guesses.forEach(([num, amount]) => {
            if (!totals[num]) totals[num] = { money: 0, count: 0 };
            totals[num].money += amount;
            totals[num].count += 1;
        });

        const keys     = Object.keys(totals).map(Number).sort((a, b) => a - b);
        const maxMoney = Math.max(...keys.map(k => totals[k].money));

        const histogram = document.createElement("div");
        histogram.className = "histogram";

        keys.forEach(val => {
            const { money, count } = totals[val];
            const heightPct = (money / maxMoney) * 100;

            const col = document.createElement("div");
            col.className = "hist-col";

            const bar = document.createElement("div");
            bar.className = "hist-bar";
            bar.style.height = "0%";
            bar.setAttribute("data-tooltip", `$${money} · ${count} bet${count > 1 ? "s" : ""}`);

            const label = document.createElement("div");
            label.className = "hist-label";
            label.textContent = val;

            col.appendChild(bar);
            col.appendChild(label);
            histogram.appendChild(col);

            setTimeout(() => { bar.style.height = heightPct + "%"; }, 150);

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
                    tip.style.left = (e.clientX + 14) + "px";
                    tip.style.top  = (e.clientY - 36) + "px";
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
            const response  = await fetch("odds.json");
            const data      = await response.json();
            const container = document.getElementById("bets-container");
            container.innerHTML = "";

            // Run countdown with finishTime from JSON
            updateCountdown(data.finishTime || "");
            setInterval(() => updateCountdown(data.finishTime || ""), 1000);

            data.bets.forEach(bet => {
                if (bet.type === "yesno") {
                    renderYesNo(bet, container);
                } else if (bet.type === "histogram") {
                    renderHistogram(bet, container);
                }
            });

        } catch (error) {
            console.error("Error loading odds:", error);
            updateCountdown("");
            setInterval(() => updateCountdown(""), 1000);
        }
    }

    loadOdds();

});
