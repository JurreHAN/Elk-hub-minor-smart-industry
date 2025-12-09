document.addEventListener('DOMContentLoaded', () => {

    const images = [
        '../images/elk-nijmegen-14.webp', 
        '../images/van happen.jpg',
        '../images/Renuwi.jpg',
        '../images/bnext.jpg',
    ];

    let currentImageIndex = 1; // ⬅️ Begin direct bij afbeelding 2
    const slider = document.getElementById('background-slider');
    const intervalTime = 6000; // 6 seconden

    if (slider) {

        // ⬅️ Eerste afbeelding direct plaatsen
        slider.style.backgroundImage = `url('${images[0]}')`;
        slider.style.opacity = 1;

        function changeBackground() {

            // Fade-out
            slider.style.opacity = 0;

            setTimeout(() => {

                // Nieuwe afbeelding
                slider.style.backgroundImage = `url('${images[currentImageIndex]}')`;

                // Fade-in
                slider.style.opacity = 1;

                // Volgende afbeelding
                currentImageIndex = (currentImageIndex + 1) % images.length;

            }, 1500); // Moet gelijk zijn aan CSS transition
        }

        // ⬅️ DIRECT starten: eerste wissel is nu wél na 10 sec
        setInterval(changeBackground, intervalTime);

    } else {
        console.error("Fout: #background-slider niet gevonden.");
    }
});
