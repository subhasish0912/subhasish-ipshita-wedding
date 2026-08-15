const weddingDate = new Date("2027-01-26").getTime();

setInterval(() => {
    const now = new Date().getTime();
    const diff = weddingDate - now;

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    document.getElementById("timer").innerHTML = days + " days to go";
}, 1000);
