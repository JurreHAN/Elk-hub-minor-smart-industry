document.addEventListener('DOMContentLoaded', () => {
    
    // --- CONFIGURATIE ---
    const apiKey = "b5ae199dcccfcdeff8a464bf313e5da7"; 

    // DOM Elementen
    const btn = document.getElementById('getWeatherBtn');
    const input = document.getElementById('cityInput');
    const tempEl = document.getElementById('temp');
    const conditionEl = document.getElementById('condition');
    const iconEl = document.getElementById('weatherIcon');
    const bodyEl = document.body; // Nodig om de achtergrond te veranderen

    // Functie om weer op te halen
    async function getWeather(city) {
        
        if(apiKey === "") {
            console.warn("Geen API Key ingesteld!");
            conditionEl.innerText = "No Key";
            return;
        }

        const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
        
        try {
            const response = await fetch(url);
            
            if (!response.ok) {
                if (response.status === 404) throw new Error("Stad niet gevonden");
                else if (response.status === 401) throw new Error("API Key nog niet actief");
                else throw new Error(`API Error: ${response.status}`);
            }
            
            const data = await response.json();
            const temperature = Math.round(data.main.temp);
            const mainCondition = data.weather[0].main;
            const description = data.weather[0].description;

            updateWeatherUI(temperature, mainCondition, description);

        } catch (error) {
            console.error("Weather Fout:", error.message);
            tempEl.innerText = "--";
            
            if (error.message.includes("401") || error.message.includes("actief")) {
                conditionEl.innerText = "Key Activating...";
                conditionEl.style.color = "orange";
            } else if (error.message.includes("Stad")) {
                conditionEl.innerText = "City not found";
                conditionEl.style.color = "red";
            } else {
                conditionEl.innerText = "Error";
            }
        }
    }

    function updateWeatherUI(temp, main, desc) {
        // Reset styles
        conditionEl.style.color = ""; 
        tempEl.innerText = `${temp}°`;
        conditionEl.innerText = main;
        
        let iconClass = 'bi-cloud';
        // Haal oude weer-classes weg van de body
        bodyEl.classList.remove('weather-clear', 'weather-clouds', 'weather-rain', 'weather-snow', 'weather-thunder');

        const condition = main.toLowerCase();
        
        // Bepaal icoon EN achtergrond class
        if(condition.includes('clear')) {
            iconClass = 'bi-sun';
            bodyEl.classList.add('weather-clear');
        }
        else if(condition.includes('cloud')) {
            iconClass = 'bi-cloud';
            bodyEl.classList.add('weather-clouds');
        }
        else if(condition.includes('rain') || condition.includes('drizzle')) {
            iconClass = 'bi-cloud-rain';
            bodyEl.classList.add('weather-rain');
        }
        else if(condition.includes('snow')) {
            iconClass = 'bi-snow';
            bodyEl.classList.add('weather-snow');
        }
        else if(condition.includes('thunder')) {
            iconClass = 'bi-cloud-lightning';
            bodyEl.classList.add('weather-thunder');
        }
        else if(condition.includes('mist') || condition.includes('fog')) {
             iconClass = 'bi-cloud-haze';
             bodyEl.classList.add('weather-clouds'); // Mist is ook soort bewolkt
        }
        
        iconEl.className = `weather-icon-large bi ${iconClass}`;
    }

    // --- EVENT LISTENERS ---
    if(btn && input) {
        btn.addEventListener('click', () => getWeather(input.value));
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') getWeather(input.value);
        });

        // Start
        getWeather(input.value);
    }
});