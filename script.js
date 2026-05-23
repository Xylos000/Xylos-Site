// ═══════════════════════════════════════════════════════════════
//  SCRIPT.JS — XYLOS.SITE V2
//  Single page, no scroll, terminal aesthetic
// ═══════════════════════════════════════════════════════════════

(function() {
    'use strict';

    const $ = id => document.getElementById(id);

    // ─── Elements ───
    const boot = $('boot');
    const bootOutput = $('bootOutput');
    const bootBar = $('bootBar');
    const bootPct = $('bootPct');
    const mainWrap = $('mainWrap');
    const bgVideo = $('bgVideo');
    const bgMusic = $('bgMusic');
    const audioBtn = $('audioBtn');
    const audioWaves = $('audioWaves');
    const pfp = $('pfp');
    const nameMain = document.querySelector('.name-main');
    const nameShadow = document.querySelector('.name-shadow');
    const nameTag = document.querySelector('.name-tag');
    const tagline = $('tagline');
    const termType = $('termType');
    const termCaret = $('termCaret');
    const discordBtn = $('discordBtn');
    const robloxBtn = $('robloxBtn');
    const discordVal = $('discordVal');
    const robloxVal = $('robloxVal');
    const clock = $('clock');
    const canvas = $('particleCanvas');
    const ctx = canvas.getContext('2d');

    // ─── Config ───
    function loadConfig() {
        if (typeof CONFIG === 'undefined') return;

        document.documentElement.style.setProperty('--violet', CONFIG.colors.violet);
        document.documentElement.style.setProperty('--magenta', CONFIG.colors.magenta);
        document.documentElement.style.setProperty('--cyan', CONFIG.colors.cyan);
        document.documentElement.style.setProperty('--rose', CONFIG.colors.rose);
        document.documentElement.style.setProperty('--amber', CONFIG.colors.amber);
        document.documentElement.style.setProperty('--text', CONFIG.colors.text);
        document.documentElement.style.setProperty('--muted', CONFIG.colors.muted);
        document.documentElement.style.setProperty('--dark', CONFIG.colors.dark);
        document.documentElement.style.setProperty('--panel', CONFIG.colors.panel);

        if (CONFIG.pfp) pfp.src = CONFIG.pfp;
        if (CONFIG.bgVideo) {
            bgVideo.querySelector('source').src = CONFIG.bgVideo;
            bgVideo.load();
        }
        if (CONFIG.bgMusic) {
            bgMusic.src = CONFIG.bgMusic;
            bgMusic.volume = CONFIG.musicVolume || 0.25;
        }

        document.title = CONFIG.name;
        nameMain.textContent = CONFIG.name;
        nameShadow.textContent = CONFIG.name;
        nameTag.textContent = CONFIG.name;
        tagline.textContent = CONFIG.tagline;

        if (CONFIG.discord) {
            discordVal.textContent = CONFIG.discord;
            discordBtn.href = CONFIG.discordId 
                ? `https://discord.com/users/${CONFIG.discordId}`
                : '#';
        }
        if (CONFIG.roblox) {
            robloxVal.textContent = CONFIG.roblox;
            robloxBtn.href = CONFIG.robloxId
                ? `https://www.roblox.com/users/${CONFIG.robloxId}/profile`
                : `https://www.roblox.com/users/profile?username=${CONFIG.roblox}`;
        }
    }

    // ─── Boot Sequence ───
    const bootLines = [
        '[ OK ] Kernel loaded',
        '[ OK ] Mounting filesystems',
        '[ OK ] Starting network services',
        '[ OK ] Loading user profile: xylos',
        '[ OK ] Initializing graphics engine',
        '[ OK ] Particle system ready',
        '[ OK ] Audio subsystem online',
        '[ OK ] All systems operational',
    ];

    function runBoot() {
        let i = 0;
        let progress = 0;

        function addLine() {
            if (i < bootLines.length) {
                const div = document.createElement('div');
                div.textContent = bootLines[i];
                div.style.opacity = '0';
                div.style.transform = 'translateX(-10px)';
                div.style.transition = 'all 0.3s ease';
                bootOutput.appendChild(div);

                requestAnimationFrame(() => {
                    div.style.opacity = '1';
                    div.style.transform = 'translateX(0)';
                });

                progress = Math.round(((i + 1) / bootLines.length) * 100);
                bootBar.style.width = progress + '%';
                bootPct.textContent = progress + '%';

                i++;
                setTimeout(addLine, 180 + Math.random() * 120);
            } else {
                setTimeout(finishBoot, 400);
            }
        }

        setTimeout(addLine, 300);
    }

    function finishBoot() {
        boot.classList.add('done');
        mainWrap.classList.add('loaded');
        setTimeout(() => {
            initTyping();
            initStats();
        }, 600);
    }

    // ─── Terminal Typing ───
    function initTyping() {
        if (!CONFIG?.aboutMe) return;
        const text = CONFIG.aboutMe;
        let idx = 0;
        termCaret.style.display = 'inline';

        function type() {
            if (idx < text.length) {
                termType.textContent += text.charAt(idx);
                idx++;
                setTimeout(type, 25 + Math.random() * 35);
            } else {
                setTimeout(() => { termCaret.style.display = 'none'; }, 1500);
            }
        }
        type();
    }

    // ─── Stats Counter ───
    function initStats() {
        const targets = [12, 2847, 45231, 892];
        const elements = [$('stat1'), $('stat2'), $('stat3'), $('stat4')];
        const durations = [1500, 2000, 2500, 1800];

        elements.forEach((el, i) => {
            const target = targets[i];
            const duration = durations[i];
            const start = Date.now();

            function update() {
                const elapsed = Date.now() - start;
                const progress = Math.min(elapsed / duration, 1);
                const eased = 1 - Math.pow(1 - progress, 3);
                el.textContent = Math.floor(eased * target).toLocaleString();

                if (progress < 1) requestAnimationFrame(update);
            }

            setTimeout(() => requestAnimationFrame(update), 400 + i * 150);
        });
    }

    // ─── Clock ───
    function updateClock() {
        const now = new Date();
        const h = String(now.getHours()).padStart(2, '0');
        const m = String(now.getMinutes()).padStart(2, '0');
        const s = String(now.getSeconds()).padStart(2, '0');
        clock.textContent = `${h}:${m}:${s}`;
    }
    setInterval(updateClock, 1000);
    updateClock();

    // ─── Audio Toggle ───
    let musicPlaying = false;
    audioBtn.addEventListener('click', () => {
        if (!CONFIG?.bgMusic) return;
        musicPlaying = !musicPlaying;

        if (musicPlaying) {
            bgMusic.play().catch(() => { musicPlaying = false; });
            audioBtn.classList.add('playing');
        } else {
            bgMusic.pause();
            audioBtn.classList.remove('playing');
        }
    });

    // ─── Particles ───
    let particles = [];
    let mouseX = 0, mouseY = 0;
    let w, h;

    function resizeCanvas() {
        w = canvas.width = window.innerWidth;
        h = canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    class Particle {
        constructor() { this.reset(); }
        reset() {
            this.x = Math.random() * w;
            this.y = Math.random() * h;
            this.vx = (Math.random() - 0.5) * 0.4;
            this.vy = (Math.random() - 0.5) * 0.4;
            this.size = Math.random() * 2 + 0.5;
            this.alpha = Math.random() * 0.5 + 0.1;
            this.hue = Math.random() > 0.5 ? 260 : 300;
        }
        update() {
            this.x += this.vx;
            this.y += this.vy;

            const dx = mouseX - this.x;
            const dy = mouseY - this.y;
            const dist = Math.sqrt(dx*dx + dy*dy);
            if (dist < 120) {
                this.x -= dx * 0.008;
                this.y -= dy * 0.008;
            }

            if (this.x < 0 || this.x > w) this.vx *= -1;
            if (this.y < 0 || this.y > h) this.vy *= -1;
        }
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `hsla(${this.hue}, 70%, 60%, ${this.alpha})`;
            ctx.fill();
        }
    }

    for (let i = 0; i < 60; i++) particles.push(new Particle());

    function animateParticles() {
        ctx.clearRect(0, 0, w, h);

        particles.forEach(p => {
            p.update();
            p.draw();
        });

        // Connections
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx*dx + dy*dy);
                if (dist < 100) {
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `hsla(260, 50%, 50%, ${(1 - dist/100) * 0.08})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
        }

        requestAnimationFrame(animateParticles);
    }

    document.addEventListener('mousemove', e => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    // ─── Name Glitch (random) ───
    function nameGlitch() {
        if (!CONFIG?.name) return;
        const original = CONFIG.name;
        const chars = '!<>-_\/[]{}—=+*^?#________';

        setInterval(() => {
            if (Math.random() > 0.7) {
                const pos = Math.floor(Math.random() * original.length);
                const char = chars[Math.floor(Math.random() * chars.length)];
                const glitched = original.substring(0, pos) + char + original.substring(pos + 1);

                nameMain.textContent = glitched;
                nameShadow.textContent = glitched;
                nameTag.textContent = glitched;

                setTimeout(() => {
                    nameMain.textContent = original;
                    nameShadow.textContent = original;
                    nameTag.textContent = original;
                }, 80);
            }
        }, 3000);
    }

    // ─── PFP Scan Effect ───
    function pfpScan() {
        setInterval(() => {
            pfp.style.filter = 'hue-rotate(90deg) saturate(2)';
            setTimeout(() => {
                pfp.style.filter = 'grayscale(0.3)';
            }, 100);
        }, 8000);
    }

    // ─── Init ───
    document.addEventListener('DOMContentLoaded', () => {
        loadConfig();
        runBoot();
        animateParticles();
        nameGlitch();
        pfpScan();
    });

})();
