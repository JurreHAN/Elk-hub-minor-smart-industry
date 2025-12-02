    document.addEventListener('DOMContentLoaded', (event) => {
        // Lijst met afbeeldingspaden - **DEZE MOET JE AANPASSEN!**
        const images = [
            '../images/elk-nijmegen-14.webp', 
            '../images/van happen.jpg',
            '../images/Renuwi.jpg',
            '../images/bnext.jpg',
        ];

        console.error("testttttttt");
        let currentImageIndex = 0;
        // Nu weten we zeker dat 'background-slider' bestaat
        const slider = document.getElementById('background-slider');
        const intervalTime = 10000; // 10 seconden wisselen

        // We checken of het element echt gevonden is voordat we de slider starten
        if (slider) {
            function changeBackground() {
                // Stap 1: Huidige afbeelding verbergen (fade-out)
                slider.style.opacity = 0;

                // Wacht op de fade-out (1.5s)
                setTimeout(() => {
                    // Stap 2: Stel de nieuwe achtergrondafbeelding in
                    slider.style.backgroundImage = `url('${images[currentImageIndex]}')`;

                    // Stap 3: Toon de nieuwe afbeelding (fade-in)
                    slider.style.opacity = 1;

                    // Stap 4: Update de index voor de volgende cyclus
                    currentImageIndex = (currentImageIndex + 1) % images.length;
                }, 1500); // Wachttijd gelijk aan de CSS transition
            }

            // Start het proces direct en herhaal elke 5 seconden
            changeBackground();
            setInterval(changeBackground, intervalTime);
        } else {
            console.error("Fout: Het element met ID 'background-slider' is niet gevonden.");
        }
    });