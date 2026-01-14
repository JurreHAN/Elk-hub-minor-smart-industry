const baseUrl = "https://api.nasa.gov/planetary/apod?api_key=";
const apiKey = "5YOBA687ckrcCMYLIzeztAS1CSyGreRYCaGThj4Q";

const imageSection = `<a id="hdimg" href="" target="-blank">
<div class="image-div">
<img id="image_of_the_day" src="" alt="image-by-nasa" class="img-fluid rounded-3" style="max-height: 350px; object-fit: cover;">
</div>
</a>`;

const videoSection = `<div class="video-div"> <iframe id="videoLink" src="" frameborder="0"></iframe></div>`;
const mediaSection = document.querySelector("#media-section");

const imageOtdText = document.querySelector("#image-otd-text");

function fetchData() {
    fetch(baseUrl + apiKey)
        .then((response) => response.json() )
        .then((json) => {
            console.log("fetched nasa data: ", json);

            if (json.media_type == "video") {
                mediaSection.innerHTML = videoSection;
                document.getElementById("videoLink").src =
                    json.url;
            } else {
                mediaSection.innerHTML = imageSection;
                document.getElementById("hdimg").href =
                    json.hdurl;
                    console.log("hdurl: ", json.hdurl);
                document.getElementById(
                    "image_of_the_day"
                ).src = json.url;
                imageOtdText.innerText = json.explanation;
            }
        })
        .catch((error) => {
            var errorMessage = "error fetching nasa data: " + error;
            imageOtdText.innerText = errorMessage;
            console.error(errorMessage);
        });
}


function fetchAdvice() {
    console.log("fetching advice data...");
    fetch("https://api.adviceslip.com/advice")
    .then(response => response.json())
    .then(data => {
        console.log("fetched advice data successfully: ", data);
        document.getElementById("advice-text").innerText = '"' + data.slip.advice + '" - Jurre ' + new Date().getFullYear();
    })
    .catch(error => {
        console.error("Error fetching advice:", error);
    });
}


function fetchWeather( cityID ) {
    var key = '962b3206bed880c0a8d589fc0ebbe052';
    fetch('https://api.openweathermap.org/data/2.5/weather?id=' + cityID+ '&appid=' + key)
        .then(function(resp) { return resp.json() }) // Convert data to json
        .then(function(d) {
            var celcius = Math.round(parseFloat(d.main.temp) - 273.15);
            document.getElementById('weather-text').innerHTML= d.name + ": " + celcius + '&deg;C';

        })
        .catch(function() {
        // catch any errors
    });
}
fetchData();
fetchAdvice();
fetchWeather( 2749234 );
