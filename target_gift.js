const COLORS = ['#38bdf8', '#818cf8', '#c084fc', '#e879f9'];
const IMGS = Array.from({ length: 20 }, (_, i) => `./style/img/Anh (${i + 1}).jpg`);
let scene = 0;

// Canvases
const sc = document.getElementById('starfield'), sx = sc.getContext('2d');
const bgc = document.getElementById('bg-particles'), bgx = bgc.getContext('2d');
const pc = document.getElementById('particles'), px = pc.getContext('2d');
const fwc = document.getElementById('fw-cnv'), fwx = fwc.getContext('2d');


function resize() { sc.width = bgc.width = pc.width = fwc.width = innerWidth; sc.height = bgc.height = pc.height = fwc.height = innerHeight; }
window.onresize = resize; resize();

// Stars & Shooting Stars
let stars = Array.from({ length: 150 }, () => ({ x: Math.random() * innerWidth, y: Math.random() * innerHeight, r: Math.random() * 1.5 }));
let sStars = [];
function drawStars() {
    sx.clearRect(0, 0, innerWidth, innerHeight);
    sx.fillStyle = '#fff';
    stars.forEach(s => {
        sx.globalAlpha = 0.3 + Math.random() * 0.7;
        sx.beginPath(); sx.arc(s.x, s.y, s.r, 0, 7); sx.fill();
    });

    if (Math.random() < 0.015 && sStars.length < 2) {
        sStars.push({
            x: Math.random() * innerWidth + innerWidth / 2,
            y: Math.random() * -100 - 50,
            l: Math.random() * 100 + 80,
            sp: Math.random() * 15 + 15,
            ang: (Math.random() * 15 + 35) * Math.PI / 180,
            op: 1
        });
    }

    for (let i = sStars.length - 1; i >= 0; i--) {
        let s = sStars[i];
        let vx = -Math.cos(s.ang) * s.sp;
        let vy = Math.sin(s.ang) * s.sp;
        s.x += vx; s.y += vy;
        s.op -= 0.01;

        if (s.op <= 0 || s.x < -200 || s.y > innerHeight + 200) { sStars.splice(i, 1); continue; }

        sx.save();
        sx.globalAlpha = Math.max(0, s.op);
        sx.translate(s.x, s.y);
        sx.rotate(Math.atan2(vy, vx));

        const grad = sx.createLinearGradient(0, 0, -s.l, 0);
        grad.addColorStop(0, "rgba(255, 255, 255, 1)");
        grad.addColorStop(0.1, "rgba(6, 182, 212, 1)");
        grad.addColorStop(1, "rgba(79, 70, 229, 0)");

        sx.fillStyle = grad;
        sx.beginPath();
        sx.moveTo(0, -2);
        sx.lineTo(0, 2);
        sx.lineTo(-s.l, 0);
        sx.fill();

        sx.fillStyle = "#fff";
        sx.beginPath(); sx.arc(0, 0, 2, 0, 7); sx.fill();
        sx.restore();
    }

    requestAnimationFrame(drawStars);
}
drawStars();

// Hold Logic
let holding = false, prog = 0;
const holdBtn = document.getElementById('hold-btn');
function startH(e) {
    e.preventDefault();
    holding = true;
    holdBtn.classList.add('holding');
    updateH();
}
function endH() {
    holding = false;
    prog = 0;
    holdBtn.classList.remove('holding');
    const progressBar = document.getElementById('h-progress-bar');
    if (progressBar) progressBar.style.width = '0%';
}
function updateH() {
    if (!holding) return;
    prog += 0.012; // Slightly slowed down to allow enjoying the animation

    // Spawn particles from button center while holding
    const rect = holdBtn.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    for (let i = 0; i < 2; i++) {
        const a = Math.random() * 6.28, s = Math.random() * 5 + 2;
        iparts.push({ x: cx, y: cy, vx: Math.cos(a) * s, vy: Math.sin(a) * s, l: 1 });
    }

    if (prog >= 1) {
        holdBtn.classList.remove('holding');
        openGift();
        return;
    }

    const progressBar = document.getElementById('h-progress-bar');
    if (progressBar) progressBar.style.width = (prog * 100) + '%';
    requestAnimationFrame(updateH);
}


holdBtn.onmousedown = holdBtn.ontouchstart = startH;
window.onmouseup = window.ontouchend = endH;

// Removed auto-open to allow for Hold screen interaction
window.onload = () => {
    // Logic moved to openGift()
};


function openGift() {

    document.getElementById('s-hold').classList.add('off');
    document.getElementById('s-gift').classList.remove('off');
    initScenes(); startMusic(); fireworks();
}

function changeScene(i) {
    scene = i;
    document.querySelectorAll('.scene').forEach((s, idx) => s.classList.toggle('active', idx === i));
}


function initScenes() {
    // Float
    const fBox = document.getElementById('sc-float');
    const columns = window.innerWidth < 600 ? 3 : 5;
    const colWidth = 100 / columns;

    IMGS.forEach((src, i) => {
        const colIndex = i % columns;
        setTimeout(() => {
            const el = document.createElement('div'); el.className = 'fp';
            const w = (window.innerWidth < 600 ? 110 : 140) + Math.random() * 50;
            el.style.width = w + 'px';
            el.style.height = w * 1.4 + 'px';

            // Ensure X is within screen bounds [width/2, 100% - width/2]
            const wPct = (w / window.innerWidth) * 100;
            const colCenter = (colIndex * colWidth) + (colWidth / 2);
            const jitter = (Math.random() - 0.5) * (colWidth * 0.7);
            let xPos = colCenter + jitter;

            // Clamping to stay within screen
            xPos = Math.max(wPct / 2 + 2, Math.min(100 - wPct / 2 - 2, xPos));

            el.style.left = xPos + '%';
            el.style.setProperty('--r', (Math.random() - 0.5) * 30 + 'deg');

            const duration = 12 + Math.random() * 4;
            el.style.animation = `rise ${duration}s linear infinite`;

            const img = document.createElement('img'); img.src = src;
            img.style.width = '100%'; img.style.height = '100%'; img.style.objectFit = 'cover';
            el.appendChild(img);
            fBox.appendChild(el);
        }, i * 750);
    });

    // Sphere
    const sWrap = document.getElementById('sphere-wrap');
    const total = 40; // Higher density
    for (let i = 0; i < total; i++) {
        // More balanced Fibonacci sphere distribution
        const phi = Math.acos(-1 + (2 * i + 1) / total);
        const theta = Math.sqrt(total * Math.PI) * phi;

        // Convert angles for CSS
        const rotY = (theta * 180 / Math.PI);
        const rotX = (phi * 180 / Math.PI) - 90;

        const tile = document.createElement('div'); tile.className = 'sphere-tile';
        tile.style.transform = `rotateY(${rotY}deg) rotateX(${rotX}deg) translateZ(210px)`;
        const img = document.createElement('img'); img.src = IMGS[i % IMGS.length];
        img.draggable = false; // Prevent native dragging
        tile.appendChild(img); sWrap.appendChild(tile);
    }
    const grid = document.getElementById('sphere-grid');
    IMGS.forEach((src, i) => {
        const d = document.createElement('div'); d.className = 'grid-photo';
        // Staggered pop-in + infinite bobbing delay
        d.style.animationDelay = `${i * 0.08}s, ${Math.random() * -3}s`;
        const img = document.createElement('img'); img.src = src;
        img.style.width = '100%'; img.style.height = '100%'; img.style.objectFit = 'cover';
        d.appendChild(img); d.onclick = () => openLB(src);
        grid.appendChild(d);
    });
    setTimeout(() => {
        document.getElementById('btn-globe').classList.add('show');
    }, 10000);

    changeScene(0);
    animateSphere();
}

function goToSphere() {
    const btn = document.getElementById('btn-globe');
    btn.style.opacity = '0';
    btn.style.pointerEvents = 'none';

    const photos = document.querySelectorAll('.fp');
    photos.forEach((p, i) => {
        // Stop the rising animation
        const computed = window.getComputedStyle(p);
        const currentMatrix = computed.transform;
        p.style.animation = 'none';
        p.style.transform = currentMatrix; // Freeze at current spot

        // Force reflow
        p.offsetHeight;

        const side = i % 4; // 0: Right, 1: Bottom, 2: Left, 3: Top
        const angle = side * 90 + (Math.random() - 0.5) * 40;
        const dist = Math.max(innerWidth, innerHeight) * 1.5;
        const tx = Math.cos(angle * Math.PI / 180) * dist;
        const ty = Math.sin(angle * Math.PI / 180) * dist;

        p.style.transition = 'transform 1.4s cubic-bezier(0.15, 0, 0.15, 1), opacity 0.8s';
        p.style.transform = `translate(${tx}px, ${ty}px) scale(0.2) rotate(${Math.random() * 720}deg)`;
        p.style.opacity = '0';
    });

    setTimeout(() => {
        changeScene(1);
    }, 1300);
}




let sphereRotY = 0, sphereRotX = 10, sphereScale = 1;
let isDragging = false, lastX, lastY, moveDist = 0;
let velX = 0.2, velY = 0; // Initial velocity for auto-rotate
const sWrap = document.getElementById('sphere-wrap');

function updateSphereTransform() {
    // Re-ordered transforms to prevent distortion: Scale then Rotates
    sWrap.style.transform = `scale(${sphereScale}) rotateX(${sphereRotX}deg) rotateY(${sphereRotY}deg)`;
}

// Interactive & Inertia logic
function animateSphere() {
    if (!isDragging) {
        // Apply inertia/auto-rotate
        sphereRotY += velX;
        sphereRotX += velY;

        // Gentle return to level if not dragging
        velX *= 0.98;
        velY *= 0.98;

        // Base minimum speed
        if (Math.abs(velX) < 0.15) velX = (velX > 0 ? 0.15 : -0.15);

        updateSphereTransform();
    }
    requestAnimationFrame(animateSphere);
}

sWrap.onmousedown = (e) => {
    if (e.cancelable) e.preventDefault();
    isDragging = true;
    lastX = e.clientX;
    lastY = e.clientY;
    moveDist = 0;
    velX = 0; velY = 0;
};

sWrap.addEventListener('touchstart', (e) => {
    isDragging = true;
    lastX = e.touches[0].clientX;
    lastY = e.touches[0].clientY;
    moveDist = 0;
    velX = 0; velY = 0;
    if (scene === 1 && e.cancelable) e.preventDefault();
}, { passive: false });

window.onblur = () => { isDragging = false; };

window.onmousemove = (e) => {
    if (!isDragging) return;
    const dx = (e.clientX - lastX) * 0.3;
    const dy = (e.clientY - lastY) * 0.3;

    sphereRotY += dx;
    sphereRotX -= dy;
    sphereRotX = Math.max(-80, Math.min(80, sphereRotX));

    velX = dx; // Store for inertia
    velY = -dy;

    lastX = e.clientX;
    lastY = e.clientY;
    moveDist += Math.abs(dx) + Math.abs(dy);
    updateSphereTransform();
};

window.ontouchmove = (e) => {
    if (!isDragging) return;
    const dx = (e.touches[0].clientX - lastX) * 0.4;
    const dy = (e.touches[0].clientY - lastY) * 0.4;

    sphereRotY += dx;
    sphereRotX -= dy;
    sphereRotX = Math.max(-80, Math.min(80, sphereRotX));

    velX = dx;
    velY = -dy;

    lastX = e.touches[0].clientX;
    lastY = e.touches[0].clientY;
    moveDist += Math.abs(dx) + Math.abs(dy);
    updateSphereTransform();
};

window.onmouseup = window.ontouchend = () => {
    endH(); // Stop the hold button progress
    // If movement was very small, treat as a "tap" to explode the sphere
    if (isDragging && moveDist < 10) {
        explodeSphere();
    }
    isDragging = false;
};

window.addEventListener('wheel', (e) => {
    if (scene !== 1) return;
    // Allow scrolling if the grid is showing
    if (document.getElementById('sphere-grid').classList.contains('show')) return;

    if (e.cancelable) e.preventDefault();
    const delta = e.deltaY * -0.0008;
    sphereScale += delta;
    sphereScale = Math.max(0.6, Math.min(1.6, sphereScale));
    updateSphereTransform();
}, { passive: false });

function explodeSphere() {
    const grid = document.getElementById('sphere-grid');
    grid.classList.remove('show');
    void grid.offsetWidth; // Force reflow to reset animation
    document.getElementById('sphere-wrap').style.display = 'none';
    grid.classList.add('show');
    // Need a tiny delay for browser to apply "display: flex" before we can modify scroll
    setTimeout(() => { grid.scrollTop = 0; }, 10);
    document.getElementById('back-btn').style.display = 'block';
}

function collapse() {
    document.getElementById('sphere-wrap').style.display = 'block';
    document.getElementById('sphere-grid').classList.remove('show');
    document.getElementById('back-btn').style.display = 'none';
    updateSphereTransform();
}

let curI = 0;
function openLB(src) {
    curI = IMGS.indexOf(src);
    const lb = document.getElementById('lb');
    document.getElementById('lb-img').src = src;
    lb.style.display = 'flex';
    setTimeout(() => lb.classList.add('show'), 10);
}

function closeLB() {
    const lb = document.getElementById('lb');
    lb.classList.remove('show');
    setTimeout(() => lb.style.display = 'none', 400);
}
function changeImg(n) {
    curI = (curI + n + IMGS.length) % IMGS.length;
    document.getElementById('lb-img').src = IMGS[curI];
}

let reactInterval, reactCount = 0;
function spawnReaction(emoji, x, y) {
    const el = document.createElement('div');
    el.className = 'floating-react';
    el.innerText = emoji;
    el.style.left = `${x}px`;
    el.style.top = `${y}px`;
    el.style.setProperty('--dx', (Math.random() * 160 - 80) + 'px');
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 1500);

    reactCount++;
    if (reactCount === 10) spawnEmojiRain(emoji);
}

function spawnEmojiRain(emoji) {
    const rainInt = setInterval(() => {
        const el = document.createElement('div');
        el.className = 'falling-emoji';
        el.innerText = emoji;
        el.style.left = Math.random() * 100 + 'vw';
        el.style.fontSize = (Math.random() * 1 + 1.5) + 'rem';
        document.body.appendChild(el);
        setTimeout(() => el.remove(), 3000);
    }, 50);
    setTimeout(() => clearInterval(rainInt), 3000);
}

function startReact(emoji, e) {
    if (e) e.preventDefault();
    const rect = e.currentTarget.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top;

    reactCount = 0;
    spawnReaction(emoji, x, y);
    clearInterval(reactInterval);
    reactInterval = setInterval(() => spawnReaction(emoji, x, y), 100);
}

function stopReact() {
    clearInterval(reactInterval);
    reactCount = 0;
}


// Fireworks
let fwps = [];
function fireworks() {
    for (let i = 0; i < 5; i++) setTimeout(() => {
        const x = Math.random() * innerWidth, y = Math.random() * innerHeight * 0.5, c = COLORS[Math.floor(Math.random() * 4)];
        for (let j = 0; j < 40; j++) {
            const a = Math.random() * 6.28, s = Math.random() * 5 + 2;
            fwps.push({ x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s, l: 1, c });
        }
    }, i * 400);
}
function drawFW() {
    fwx.clearRect(0, 0, innerWidth, innerHeight);
    fwps = fwps.filter(p => p.l > 0);
    fwps.forEach(p => { p.x += p.vx; p.y += p.vy; p.vy += 0.1; p.l -= 0.015; fwx.globalAlpha = p.l; fwx.fillStyle = p.c; fwx.beginPath(); fwx.arc(p.x, p.y, 2, 0, 7); fwx.fill(); });
    requestAnimationFrame(drawFW);
}
drawFW();

// Interaction
let iparts = [];
window.onclick = (e) => {
    if (e.target.closest('button, .fp, .grid-photo')) return;
    for (let i = 0; i < 8; i++) {
        const a = Math.random() * 6.28, s = Math.random() * 4 + 1;
        iparts.push({ x: e.clientX, y: e.clientY, vx: Math.cos(a) * s, vy: Math.sin(a) * s, l: 1 });
    }
};
function drawIP() {
    px.clearRect(0, 0, innerWidth, innerHeight);
    iparts = iparts.filter(p => p.l > 0);
    iparts.forEach(p => { p.x += p.vx; p.y += p.vy; p.vy += 0.05; p.l -= 0.02; px.globalAlpha = p.l; px.fillStyle = '#06b6d4'; px.beginPath(); px.arc(p.x, p.y, 1.5, 0, 7); px.fill(); });
    requestAnimationFrame(drawIP);
}
drawIP();

// Music
let audio = document.getElementById('bgMusic');
if (audio) audio.loop = true;

function startMusic() { if (audio) audio.play().catch(() => { }); }

function startMusic() { audio.play().catch(() => { }); }