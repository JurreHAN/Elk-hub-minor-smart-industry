window.onscroll = function() { updateProgress() };

function updateProgress() {
    // Horizontale balk update
    let winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    let height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    let scrolled = (winScroll / height) * 100;
    document.getElementById("myBar").style.width = scrolled + "%";

    // Update actieve stip aan de rechterkant
    const cards = document.querySelectorAll('.comp-card');
    const dots = document.querySelectorAll('.scroll-dot');
    
    let current = "";
    cards.forEach((card, index) => {
        const cardTop = card.offsetTop;
        if (pageYOffset >= cardTop - 200) {
            current = index;
        }
    });

    dots.forEach((dot, index) => {
        dot.classList.remove("active");
        if (index === current) {
            dot.classList.add("active");
        }
    });
}

// Klikbaar maken van de stippen
function scrollToComp(index) {
    const cards = document.querySelectorAll('.comp-card');
    window.scrollTo({
        top: cards[index].offsetTop - 100,
        behavior: 'smooth'
    });
}