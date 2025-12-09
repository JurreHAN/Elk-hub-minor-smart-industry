// app.js

function nasarequested() {
  const baseUrl = 'https://api.nasa.gov/planetary/apod';
  const apiKey = 'VwTC0iyPal8vc5QLupebrXwAS5xEnc61D4XCxgz5';  

  const dateInput = document.querySelector('#datepicker');
  const titleEl = document.querySelector('#title');
  const dateEl = document.querySelector('#date');
  const copyrightEl = document.querySelector('#copyright');
  const mediaSection = document.querySelector('#media-section');
  const descEl = document.querySelector('#description');

  const currentDate = new Date().toISOString().slice(0, 10);
  dateInput.max = currentDate;
  dateInput.min = '1995-06-16';

  // Bepaal welke datum we requesten: als input leeg is, gebruik huidige datum
  const dateStr = dateInput.value ? dateInput.value : currentDate;
  const url = `${baseUrl}?api_key=${apiKey}&date=${dateStr}`;

  fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error('Netwerk response niet OK');
      }
      return response.json();
    })
    .then(data => {
      console.log(data);
      displayData(data);
    })
    .catch(error => {
      console.error('Fout bij fetch:', error);
      mediaSection.innerHTML = `<p>Kon data niet laden.</p>`;
    });

  function displayData(data) {
    titleEl.textContent = data.title;
    dateEl.textContent = data.date;

    if (data.hasOwnProperty('copyright')) {
      copyrightEl.textContent = data.copyright;
    } else {
      copyrightEl.textContent = '';
    }

    if (data.media_type === 'video') {
      mediaSection.innerHTML = `<div class="video-div">
        <iframe src="${data.url}" frameborder="0" allowfullscreen></iframe>
      </div>`;
    } else {
      // media_type is image
      mediaSection.innerHTML = `<a href="${data.hdurl}" target="_blank">
        <div class="image-div">
          <img src="${data.url}" alt="APOD image">
        </div>
      </a>`;
    }

    descEl.textContent = data.explanation;
  }
}

// Event listener: als gebruiker een datum kiest, doe een nieuwe request
document.querySelector('#datepicker').addEventListener('change', () => {
  nasarequested();
});

// Bij laadtijd meteen gegevens tonen
document.addEventListener('DOMContentLoaded', () => {
  nasarequested();
});
