document.addEventListener("DOMContentLoaded", () => {
  const elements = document.querySelectorAll(".typing");
  const PAUSE_DURATION = 800; // Time to wait after a period (in ms)

  function typeEffect(el, text, delay = 0, speed = 100, callback) {
    // 1. Clear text immediately to prevent the "flash"
    el.textContent = "";

    setTimeout(() => {
      let i = 0;

      function typeChar() {
        if (i < text.length) {
          const char = text.charAt(i);
          el.textContent += char;
          
          // Determine speed for the NEXT character
          let nextCharSpeed = speed;

          // If the character just typed is a period, wait longer
          if (char === '.') {
            nextCharSpeed = PAUSE_DURATION;
          }

          i++;
          setTimeout(typeChar, nextCharSpeed);
        } else {
          // Done typing this element
          el.classList.add("done");
          if (callback) callback();
        }
      }

      // Start the typing loop
      typeChar();
    }, delay);
  }

  let totalDelay = 0;

  elements.forEach((el, index) => {
    const text = el.getAttribute("data-text");
    const speed = index === 0 ? 120 : 50; // Slower title, faster subtitle

    // Run the effect
    typeEffect(el, text, totalDelay, speed, () => {
      if (index === 0) {
        el.classList.add("wave");
      }
    });

    // Calculate duration for the NEXT element to wait
    // Base duration: length * speed
    let duration = text.length * speed;
    
    // Add extra duration for every period (.) found in the text
    const dotCount = (text.match(/\./g) || []).length;
    duration += (dotCount * PAUSE_DURATION);

    // Add extra buffer between lines (e.g., 1000ms)
    totalDelay += duration + 1000;
  });
});

// --- DRAGGABLE WIDGET LOGIC ---
const dragItem = document.getElementById("draggable-widget");
let active = false;
let currentX, currentY, initialX, initialY;
let xOffset = 0, yOffset = 0;

// Voor het detecteren van klik vs sleep
let startClickX, startClickY;

dragItem.addEventListener("mousedown", dragStart, false);
document.addEventListener("mouseup", dragEnd, false);
document.addEventListener("mousemove", drag, false);

function dragStart(e) {
    startClickX = e.clientX;
    startClickY = e.clientY;

    // Niet slepen als je op de input of search knop klikt
    if (e.target.tagName === 'INPUT' || e.target.closest('button')) {
        return; 
    }

    initialX = e.clientX - xOffset;
    initialY = e.clientY - yOffset;

    if (e.target === dragItem || dragItem.contains(e.target)) {
        active = true;
    }
}

function dragEnd(e) {
    initialX = currentX;
    initialY = currentY;
    active = false;

    // Bereken beweging
    const moveX = Math.abs(e.clientX - startClickX);
    const moveY = Math.abs(e.clientY - startClickY);

    // Als we bijna niet bewogen hebben (<5px), is het een klik -> Toggle!
    if (moveX < 5 && moveY < 5) {
        if (e.target.tagName !== 'INPUT' && !e.target.closest('button')) {
            toggleWidget();
        }
    }
}

function drag(e) {
    if (active) {
        e.preventDefault();
        currentX = e.clientX - initialX;
        currentY = e.clientY - initialY;
        xOffset = currentX;
        yOffset = currentY;
        setTranslate(currentX, currentY, dragItem);
    }
}

function setTranslate(xPos, yPos, el) {
    el.style.transform = "translate3d(" + xPos + "px, " + yPos + "px, 0)";
}

function toggleWidget() {
    dragItem.classList.toggle('minimized');
}

// --- EASTER EGG / MATRIX LOGIC ---
document.addEventListener('DOMContentLoaded', () => {
    const secretCode = 'smart'; 
    let input = '';
    const canvas = document.getElementById('matrixCanvas');
    const ctx = canvas.getContext('2d');
    const triggerBtn = document.getElementById('matrixTrigger');
    let animationId;

    if(triggerBtn) {
        triggerBtn.addEventListener('click', startMatrix);
    }

    window.addEventListener('keyup', (e) => {
        input += e.key.toLowerCase();
        if (input.length > secretCode.length) {
            input = input.substr(input.length - secretCode.length);
        }
        if (input === secretCode) {
            startMatrix();
        }
    });

    canvas.addEventListener('click', () => {
        stopMatrix();
    });

    function startMatrix() {
        canvas.style.display = 'block';
        setTimeout(() => {
            canvas.style.opacity = '0.7'; 
        }, 10);
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        const characters = '01SMARTINDUSTRYluukveekenIOT';
        const fontSize = 16;
        const columns = canvas.width / fontSize;
        const drops = [];

        for (let i = 0; i < columns; i++) {
            drops[i] = 1;
        }

        function draw() {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = '#0F0'; 
            ctx.font = fontSize + 'px monospace';
            for (let i = 0; i < drops.length; i++) {
                const text = characters.charAt(Math.floor(Math.random() * characters.length));
                ctx.fillText(text, i * fontSize, drops[i] * fontSize);
                if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) { drops[i] = 0; }
                drops[i]++;
            }
            drawCenterText();
            animationId = requestAnimationFrame(draw);
        }
        draw();
    }

    function drawCenterText() {
        ctx.save(); 
        ctx.shadowColor = '#0F0';
        ctx.shadowBlur = 15;
        ctx.textAlign = 'center';
        ctx.font = 'bold 50px "Courier New", monospace';
        ctx.fillStyle = '#FFFFFF'; 
        ctx.fillText("BE CAUTIOS", canvas.width / 2, canvas.height / 2);
        if (Math.floor(Date.now() / 500) % 2 === 0) { 
            ctx.font = '20px "Courier New", monospace';
            ctx.fillStyle = '#0F0'; 
            ctx.fillText("> WE ARE WATHCING YOU <", canvas.width / 2, canvas.height / 2 + 50);
        }
        ctx.restore(); 
    }

    function stopMatrix() {
        canvas.style.opacity = '0';
        setTimeout(() => {
            cancelAnimationFrame(animationId);
            canvas.style.display = 'none';
            input = ''; 
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }, 1500); 
    }

    window.addEventListener('resize', () => {
        if (canvas.style.display === 'block') {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
    });
});