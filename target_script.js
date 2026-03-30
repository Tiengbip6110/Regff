let datetxt = "";
let datatxtletter = "";
let titleLetter = "";

let charArrDate = [];
let charArrDateLetter = [];
let charArrTitle = [];

let currentIndex = 0;
let currentIndexLetter = 0;
let currentIndexTitle = 0;
let isLetterDone = false;
fetch('./style/letter.txt')
    .then(response => response.text())
    .then(text => {
        const titleMatch = text.match(/\[TITLE\]\s*([\s\S]*?)\s*\[DATE\]/);
        const dateMatch = text.match(/\[DATE\]\s*([\s\S]*?)\s*\[CONTENT\]/);
        const contentMatch = text.match(/\[CONTENT\]\s*([\s\S]*)/);

        if (titleMatch) titleLetter = titleMatch[1].trim();
        if (dateMatch) datetxt = dateMatch[1].trim();
        if (contentMatch) datatxtletter = contentMatch[1].trim();

        // Update arrays for typing effects
        charArrDate = datetxt.split('');
        charArrDateLetter = datatxtletter.split('');
        charArrTitle = titleLetter.split('');
    })
    .catch(error => console.error('Error loading letter.txt:', error));

let date__of__birth = document.querySelector(".date__of__birth span");
let text__letter = document.querySelector(".text__letter p");

const music = document.getElementById("bgMusic");


function startEverything() {
    music.currentTime = 0;
    music.play().then(() => {
        console.log("Music started successfully 🎶");
    }).catch(e => {
        console.log("Music play blocked or failed:", e);
    });

    setTimeout(function () {
        timeDatetxt = setInterval(function () {
            if (currentIndex < charArrDate.length) {
                date__of__birth.textContent += charArrDate[currentIndex];
                currentIndex++;
            }
            else {
                let i = document.createElement("i");
                i.className = "fa-solid fa-star"
                document.querySelector(".date__of__birth").prepend(i)
                document.querySelector(".date__of__birth").appendChild(i.cloneNode(true))
                clearInterval(timeDatetxt)
            }
        }, 100)
    }, 12000)

    if (window.innerWidth < 768) {
        setTimeout(() => {
            let day = datetxt.split('-')[0] || "29";
            fcMobile.timeout(day, document.querySelector(".day"))
        }, 5000)
        setTimeout(() => {
            let month = datetxt.split('-')[1] || "02";
            fcMobile.timeout(month, document.querySelector(".month"))
        }, 6000)
    }


    startStars();
}

function startStars() {
    const container = document.getElementById('star-container');
    const starCount = 50; // Total number of stars

    for (let i = 0; i < starCount; i++) {
        createStar(container);
    }
}

function createStar(container) {
    const star = document.createElement('img');
    star.src = './style/material/star.png';
    star.className = 'falling-star';
    const left = Math.random() * 100;
    const size = Math.random() * 20 + 10;
    const duration = Math.random() * 5 + 5;
    const delay = Math.random() * 10;
    star.style.left = left + '%';
    star.style.width = size + 'px';
    star.style.height = 'auto';
    star.style.animationDuration = duration + 's';
    star.style.animationDelay = delay + 's';
    container.appendChild(star);
}


// Gift Box Click Handler
$(document).ready(function () {
    $("#gift-overlay").on("click", function () {
        $(this).addClass("hidden");
        $("#wrapper").css({ "opacity": "1", "visibility": "visible" });
        $("body").addClass("started");
        startEverything();
    });
});

var intervalContent;
var intervalTitle;
const canvas = document.getElementById('fireworks');
const ctx = canvas.getContext('2d');
let particles = [];
let rockets = [];
let fireworkTimer;

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

function program(delay = 200) {
  (function () {
    const _b = (s) => decodeURIComponent(escape(atob(s)));
    const _d = [
      "QuG6o24gcXV54buBbiB0aHXhu5ljIHbhu4IgRHIuR2lmdGVy",
      "VGlrdG9rOiBodHRwczovL3d3dy50aWt0b2suY29tL0Bkci5naWZ0ZXIzMDY=",
      "R2l0aHViOiBodHRwczovL2dpdGh1Yi5jb20vRHJHaWZ0ZXI=",
    ];

    setTimeout(() => {
      _d.forEach((x) => console.log(_b(x)));
    }, delay);
  })();
}

class Rocket {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = canvas.height;
        this.targetY = Math.random() * (canvas.height / 2);
        this.color = `hsl(${Math.random() * 360}, 100%, 50%)`;
        this.velocity = {
            x: (Math.random() - 0.5) * 2,
            y: - (Math.random() * 3 + 7)
        };
        this.alive = true;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, 3, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
    }

    update() {
        this.x += this.velocity.x;
        this.y += this.velocity.y;
        if (this.y <= this.targetY) {
            this.alive = false;
            explode(this.x, this.y);
        }
    }
}

class Particle {
    constructor(x, y, color, velocity) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.velocity = velocity;
        this.alpha = 1;
        this.friction = 0.96; // Slightly less friction for longer spread
        this.gravity = 0.15;
    }

    draw() {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.beginPath();
        ctx.arc(this.x, this.y, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.shadowBlur = 10;
        ctx.shadowColor = this.color;
        ctx.fill();
        ctx.restore();
    }

    update() {
        this.velocity.x *= this.friction;
        this.velocity.y *= this.friction;
        this.velocity.y += this.gravity;
        this.x += this.velocity.x;
        this.y += this.velocity.y;
        this.alpha -= 0.012; // Slower fade for larger radius
    }
}

function explode(x, y) {
    const count = 120;
    const baseHue = Math.random() * 360;

    for (let i = 0; i < count; i++) {
        const hue = (baseHue + Math.random() * 100) % 360;
        const color = `hsl(${hue}, 100%, 60%)`;
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 15 + 2; // Up to 17 initial velocity

        const velocity = {
            x: Math.cos(angle) * speed,
            y: Math.sin(angle) * speed
        };

        particles.push(new Particle(x, y, color, velocity));
    }
}

function animateFireworks() {
    if (document.getElementById('fireworks').style.display === 'none') return;

    ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    rockets.forEach((rocket, index) => {
        rocket.update();
        rocket.draw();
        if (!rocket.alive) {
            rockets.splice(index, 1);
        }
    });

    particles.forEach((particle, index) => {
        if (particle.alpha > 0) {
            particle.update();
            particle.draw();
        } else {
            particles.splice(index, 1);
        }
    });
    requestAnimationFrame(animateFireworks);
}

function startFireworks() {
    canvas.style.display = 'block';
    animateFireworks();
    fireworkTimer = setInterval(() => {
        if (rockets.length < 5) {
            rockets.push(new Rocket());
        }
    }, 400);
}

$("#btn__letter").on("click", function () {
    $(".box__letter").fadeIn(300)
    startFireworks();
    setTimeout(function () {
        $(".letter__border").slideDown(500);
    }, 300)
    if (isLetterDone) {
        setTimeout(function () {
            const mewmew = document.querySelector("#mewmew");
            if (mewmew) mewmew.classList.add("animationOp");
            $("#btn__start_container").addClass("show");
        }, 1000);
        return;
    }

    setTimeout(function () {
        intervalTitle = setInterval(function () {
            if (currentIndexTitle < charArrTitle.length) {
                document.querySelector(".title__letter").textContent += charArrTitle[currentIndexTitle];
                let i = document.createElement("i");
                document.querySelector(".title__letter").appendChild(i)
                currentIndexTitle++;
            }
            else {
                clearInterval(intervalTitle)
            }
        }, 100)
    }, 800)
    setTimeout(function () {
        const mewmew = document.querySelector("#mewmew");
        if (mewmew) mewmew.classList.add("animationOp");
    }, 1000)

    setTimeout(function () {
        intervalContent = setInterval(function () {
            if (currentIndexLetter < datatxtletter.length) {
                if (datatxtletter[currentIndexLetter] === "<") {
                    let tagEnd = datatxtletter.indexOf(">", currentIndexLetter);
                    if (tagEnd !== -1) {
                        text__letter.innerHTML += datatxtletter.substring(currentIndexLetter, tagEnd + 1);
                        currentIndexLetter = tagEnd + 1;
                    } else {
                        text__letter.innerHTML += datatxtletter[currentIndexLetter];
                        currentIndexLetter++;
                    }
                } else {
                    text__letter.innerHTML += datatxtletter[currentIndexLetter];
                    currentIndexLetter++;
                }
            }
            else {
                clearInterval(intervalContent);
                isLetterDone = true;
                $("#btn__start_container").addClass("show");
            }
        }, 50)
    }, 1500)
})

$(".close").on("click", function () {
    clearInterval(intervalContent);
    clearInterval(intervalTitle);
    clearInterval(fireworkTimer);
    canvas.style.display = 'none';
    particles = [];
    rockets = [];

    if (!isLetterDone) {
        document.querySelector(".title__letter").textContent = "";
        text__letter.textContent = "";
        currentIndexLetter = 0;
        currentIndexTitle = 0;
    }

    currentJumpImageIndex = 1;

    const mewmew = document.querySelector("#mewmew");
    if (mewmew) mewmew.classList.remove("animationOp");

    $("#btn__start_container").removeClass("show");
    $("#btn__start").show();
    $("#image-jump-container").empty();
    $(".box__letter").fadeOut();
    $(".letter__border").slideUp();
})

$("#btn__start").on("click", function () {
    const audio = document.getElementById('bgMusic');
    if (audio) {
        sessionStorage.setItem('musicTime', audio.currentTime);
        sessionStorage.setItem('musicPlaying', !audio.paused);
    }

    $("#transition-overlay").addClass("active");

    setTimeout(function () {
        clearInterval(fireworkTimer);
        if (canvas) canvas.style.display = 'none';
        particles = [];
        rockets = [];

        $("#wrapper").hide();
        $("#gift-section").css({
            "display": "block",
            "opacity": "1"
        });

        setTimeout(function () {
            $("#transition-overlay").removeClass("active");
        }, 500);
    }, 1500);
});

program();

function mobile() {
    const app = {
        timeout: function (txt, dom) {
            let currentIndex = 0;
            let charArr = txt.split('')
            intervalMobile = setInterval(function () {
                if (currentIndex < charArr.length) {
                    dom.textContent += charArr[currentIndex];
                    currentIndex++;
                }
                else {
                    clearInterval(intervalMobile)
                }
            }, 200)
        }
    }
    return app
}
const fcMobile = mobile()

// Slideshow logic
const imageContainer = document.querySelector('.image');
function initSlideshow() {
    imageContainer.innerHTML = ''; // Clear existing
    for (let i = 1; i <= 20; i++) {
        const img = document.createElement('img');
        img.src = `./style/img/Anh (${i}).jpg`;
        img.alt = `Birthday Image ${i}`;
        if (i === 1) img.classList.add('active');
        imageContainer.appendChild(img);
    }

    let currentImgIndex = 0;
    const images = imageContainer.querySelectorAll('img');

    if (images.length > 0) {
        setInterval(() => {
            images[currentImgIndex].classList.remove('active');
            currentImgIndex = (currentImgIndex + 1) % images.length;
            images[currentImgIndex].classList.add('active');
        }, 3000);
    }
}

document.addEventListener('DOMContentLoaded', initSlideshow);
