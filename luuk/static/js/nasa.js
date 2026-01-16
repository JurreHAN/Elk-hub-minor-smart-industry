const nasaApiKey = "viZzcsAp4PxRjcFTsivgk3oOtxgCpuUW1VxpLfoL";
const nasaUrl = `https://api.nasa.gov/planetary/apod?api_key=${nasaApiKey}`;

async function fetchNASA() {
    try {
        const response = await fetch(nasaUrl);
        if (!response.ok) throw new Error("NASA API limit reached");
        const data = await response.json();

        // Update teksten
        document.getElementById("title").textContent = data.title;
        document.getElementById("explanation").textContent = data.explanation;
        
        const creditEl = document.getElementById("credit");
        creditEl.textContent = data.copyright ? `© ${data.copyright}` : "Public Domain";

        const imgEl = document.getElementById("apodImage");
        const vidWrapper = document.getElementById("videoWrapper");
        const vidEl = document.getElementById("apodVideo");

        if (data.media_type === "image") {
            imgEl.src = data.url;
            imgEl.classList.remove("d-none");
            vidWrapper.classList.add("d-none");
        } else {
            vidEl.src = data.url;
            vidWrapper.classList.remove("d-none");
            imgEl.classList.add("d-none");
        }
    } catch (error) {
        console.error("NASA Error:", error);
        document.getElementById("title").textContent = "The Cosmos is resting...";
    }
}

// Start pas als de pagina geladen is
window.addEventListener('DOMContentLoaded', () => {
    fetchNASA();
});