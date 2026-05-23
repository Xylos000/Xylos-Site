// ═══════════════════════════════════════════════════════════════
//  SCRIPT.JS — XYLOS.SITE
//  Handles all effects, animations, and config loading
// ═══════════════════════════════════════════════════════════════

(function() {
    'use strict';

    // ─── DOM Elements ───
    const loader = document.getElementById('loader');
    const loaderText = document.getElementById('loaderText');
    const loaderBar = document.getElementById('loaderBar');
    const loaderPercent = document.getElementById('loaderPercent');
    const loaderStatus = document.getElementById('loaderStatus');
    const loaderParticles = document.getElementById('loaderParticles');
    const bgVideo = document.getElementById('bgVideo');
    const bgMusic = document.getElementById('bgMusic');
    const musicToggle = document.getElementById('musicToggle');
    const musicIcon = document.getElementById('musicIcon');
    const musicVisualizer = document.getElementById('musicVisualizer');
    const scanlines = document.getElementById('scanlines');
    const navbar = document.getElementById('navbar');
    const navHamburger = document.getElementById('navHamburger');
    const navLinks = document.querySelector('.nav-links');
    const pfp = document.getElementById('pfp');
    const heroName = document.getElementById('heroName');
    const heroTagline = document.getElementById('heroTagline');
    const aboutText = document.getElementById('aboutText');
    const aboutCursor = document.getElementById('aboutCursor');
    const footerName = document.getElementById('footerName');
    const particlesCanvas = document.getElementById('particlesCanvas');
    const floatingOrbs = document.getElementById('floatingOrbs');

    // ─── Apply Config ───
    function applyConfig() {
        if (typeof CONFIG === 'undefined') {
            console.warn('config.js not loaded!');
            return;
        }

        // CSS Variables
        const root = document.documentElement;
        root.style.setProperty('--primary', CONFIG.colors.primary);
        root.style.setProperty('--primary-glow', CONFIG.colors.primaryGlow);
        root.style.setProperty('--secondary', CONFIG.colors.secondary);
        root.style.setProperty('--accent', CONFIG.colors.accent);
        root.style.setProperty('--text', CONFIG.colors.text);
        root.style.setProperty('--text-muted', CONFIG.colors.textMuted);
        root.style.setProperty('--bg-dark', CONFIG.colors.bgDark);
        root.style.setProperty('--card-bg', CONFIG.colors.cardBg);
        root.style.setProperty('--card-border', CONFIG.colors.cardBorder);
        root.style.setProperty('--nav-bg', CONFIG.colors.navBg);

        // Profile
        if (CONFIG.pfp) pfp.src = CONFIG.pfp;
        document.title = CONFIG.name;
        heroName.querySelector('.glitch').textContent = CONFIG.name;
        heroName.querySelector('.glitch').setAttribute('data-text', CONFIG.name);
        heroTagline.textContent = CONFIG.tagline;
        footerName.textContent = CONFIG.name;

        // Background Video
        if (CONFIG.bgVideo) {
            bgVideo.querySelector('source').src = CONFIG.bgVideo;
            bgVideo.load();
        }
        if (CONFIG.bgVideoPoster) {
            bgVideo.poster = CONFIG.bgVideoPoster;
        }

        // Music
        if (CONFIG.bgMusic) {
            bgMusic.src = CONFIG.bgMusic;
            bgMusic.volume = CONFIG.musicVolume || 0.3;
        }

        // Loading Screen
        if (CONFIG.loadingText) {
            loaderText.textContent = CONFIG.loadingText;
            loaderText.setAttribute('data-text', CONFIG.loadingText);
        }
        if (CONFIG.loadingSubtext) {
            loaderStatus.textContent = CONFIG.loadingSubtext;
        }

        // Socials
        if (CONFIG.discord) {
            document.getElementById('discordName').textContent = CONFIG.discord;
            const discordCard = document.getElementById('discordCard');
            if (CONFIG.discordId) {
                discordCard.href = `https://discord.com/users/${CONFIG.discordId}`;
            } else {
                discordCard.href = `https://discord.com/users/@me`;
            }
        }

        if (CONFIG.roblox) {
            document.getElementById('robloxName').textContent = CONFIG.roblox;
            const robloxCard = document.getElementById('robloxCard');
            if (CONFIG.robloxId) {
                robloxCard.href = `https://www.roblox.com/users/${CONFIG.robloxId}/profile`;
            } else {
                robloxCard.href = `https://www.roblox.com/users/profile?username=${CONFIG.roblox}`;
            }
        }

        // Extra socials
        const socialMap = {
            github: { card: 'githubCard', name: 'githubName', url: u => `https://github.com/${u}` },
            youtube: { card: 'youtubeCard', name: 'youtubeName', url: u => `https://youtube.com/@${u}` },
            twitter: { card: 'twitterCard', name: 'twitterName', url: u => `https://twitter.com/${u}` },
            twitch: { card: 'twitchCard', name: 'twitchName', url: u => `https://twitch.tv/${u}` },
        };

        for (const [key, info] of Object.entries(socialMap)) {
            const val = CONFIG.socials?.[key];
            if (val) {
                const card = document.getElementById(info.card);
                const nameEl = document.getElementById(info.name);
                if (card) {
                    card.classList.remove('hidden');
                    card.href = info.url(val);
                }
                if (nameEl) nameEl.textContent = val;
            }
        }

        // Effects
        if (CONFIG.effects?.scanlines) {
            scanlines.classList.add('active');
        }
    }

    // ─── Loading Screen ───
    function initLoader() {
        // Create loader particles
        for (let i = 0; i < 20; i++) {
            const p = document.createElement('div');
            p.className = 'loader-particle';
            p.style.left = Math.random() * 100 + '%';
            p.style.animationDelay = Math.random() * 3 + 's';
            p.style.animationDuration = (2 + Math.random() * 3) + 's';
            loaderParticles.appendChild(p);
        }

        let progress = 0;
        const steps = [
            { pct: 15, text: 'Loading assets...', delay: 300 },
            { pct: 35, text: 'Initializing effects...', delay: 400 },
            { pct: 55, text: 'Loading profile data...', delay: 300 },
            { pct: 75, text: 'Preparing particles...', delay: 400 },
            { pct: 90, text: 'Finalizing...', delay: 500 },
            { pct: 100, text: 'Welcome!', delay: 600 },
        ];

        let stepIndex = 0;
        function nextStep() {
            if (stepIndex >= steps.length) {
                setTimeout(() => {
                    loader.classList.add('hidden');
                    initTypingEffect();
                    if (CONFIG.effects?.particles) initParticles();
                    if (CONFIG.effects?.floatingElements) initFloatingOrbs();
                    if (CONFIG.musicAutoplay && CONFIG.bgMusic) {
                        toggleMusic(true);
                    }
                }, 400);
                return;
            }

            const step = steps[stepIndex];
            progress = step.pct;
            loaderBar.style.width = progress + '%';
            loaderPercent.textContent = progress + '%';
            loaderStatus.textContent = step.text;

            stepIndex++;
            setTimeout(nextStep, step.delay);
        }

        setTimeout(nextStep, 500);
    }

    // ─── Typing Effect ───
    function initTypingEffect() {
        if (!CONFIG.effects?.typingEffect || !CONFIG.aboutMe) return;

        const text = CONFIG.aboutMe;
        let index = 0;
        aboutCursor.style.display = 'inline';

        function type() {
            if (index < text.length) {
                aboutText.textContent += text.charAt(index);
                index++;
                setTimeout(type, 30 + Math.random() * 40);
            } else {
                setTimeout(() => {
                    aboutCursor.style.display = 'none';
                }, 2000);
            }
        }

        type();
    }

    // ─── Particles ───
    function initParticles() {
        const ctx = particlesCanvas.getContext('2d');
        let particles = [];
        let mouseX = 0, mouseY = 0;
        let animationId;

        function resize() {
            particlesCanvas.width = window.innerWidth;
            particlesCanvas.height = window.innerHeight;
        }
        resize();
        window.addEventListener('resize', resize);

        class Particle {
            constructor() {
                this.reset();
            }
            reset() {
                this.x = Math.random() * particlesCanvas.width;
                this.y = Math.random() * particlesCanvas.height;
                this.size = Math.random() * 3 + 1;
                this.speedX = (Math.random() - 0.5) * 0.5;
                this.speedY = (Math.random() - 0.5) * 0.5;
                this.opacity = Math.random() * 0.5 + 0.2;
                this.color = Math.random() > 0.5 ? CONFIG.colors.primary : CONFIG.colors.accent;
            }
            update() {
                this.x += this.speedX;
                this.y += this.speedY;

                // Mouse interaction
                const dx = mouseX - this.x;
                const dy = mouseY - this.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 150) {
                    this.x -= dx * 0.01;
                    this.y -= dy * 0.01;
                }

                if (this.x < 0 || this.x > particlesCanvas.width) this.speedX *= -1;
                if (this.y < 0 || this.y > particlesCanvas.height) this.speedY *= -1;
            }
            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = this.color;
                ctx.globalAlpha = this.opacity;
                ctx.fill();
                ctx.globalAlpha = 1;
            }
        }

        for (let i = 0; i < 80; i++) {
            particles.push(new Particle());
        }

        function animate() {
            ctx.clearRect(0, 0, particlesCanvas.width, particlesCanvas.height);

            particles.forEach(p => {
                p.update();
                p.draw();
            });

            // Draw connections
            particles.forEach((p1, i) => {
                particles.slice(i + 1).forEach(p2 => {
                    const dx = p1.x - p2.x;
                    const dy = p1.y - p2.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 120) {
                        ctx.beginPath();
                        ctx.moveTo(p1.x, p1.y);
                        ctx.lineTo(p2.x, p2.y);
                        ctx.strokeStyle = CONFIG.colors.primary;
                        ctx.globalAlpha = (1 - dist / 120) * 0.15;
                        ctx.lineWidth = 0.5;
                        ctx.stroke();
                        ctx.globalAlpha = 1;
                    }
                });
            });

            animationId = requestAnimationFrame(animate);
        }

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        animate();
    }

    // ─── Floating Orbs ───
    function initFloatingOrbs() {
        const colors = [CONFIG.colors.primary, CONFIG.colors.accent, CONFIG.colors.secondary];
        for (let i = 0; i < 5; i++) {
            const orb = document.createElement('div');
            orb.className = 'orb';
            orb.style.width = (150 + Math.random() * 200) + 'px';
            orb.style.height = orb.style.width;
            orb.style.background = colors[i % colors.length];
            orb.style.left = Math.random() * 100 + '%';
            orb.style.top = Math.random() * 100 + '%';
            orb.style.animationDelay = (Math.random() * 10) + 's';
            orb.style.animationDuration = (15 + Math.random() * 15) + 's';
            floatingOrbs.appendChild(orb);
        }
    }

    // ─── Music Toggle ───
    let musicPlaying = false;

    function toggleMusic(forceState) {
        if (typeof forceState !== 'undefined') {
            musicPlaying = forceState;
        } else {
            musicPlaying = !musicPlaying;
        }

        if (musicPlaying) {
            bgMusic.play().catch(() => {
                // Autoplay blocked — user must click
                musicPlaying = false;
            });
            musicIcon.textContent = '';
            musicVisualizer.classList.add('active');
            musicToggle.style.boxShadow = `0 0 30px ${CONFIG.colors.primary}`;
        } else {
            bgMusic.pause();
            musicIcon.textContent = '🔇';
            musicVisualizer.classList.remove('active');
            musicToggle.style.boxShadow = '';
        }
    }

    musicToggle.addEventListener('click', () => toggleMusic());

    // ─── Navbar Scroll ───
    function handleScroll() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Active nav link
        const sections = document.querySelectorAll('section[id]');
        const scrollPos = window.scrollY + 100;

        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');

            if (scrollPos >= top && scrollPos < top + height) {
                document.querySelectorAll('.nav-link').forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === '#' + id) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', handleScroll);

    // ─── Mobile Nav ───
    navHamburger.addEventListener('click', () => {
        navHamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
    });

    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navHamburger.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });

    // ─── Glitch Text Randomizer ───
    function randomGlitch() {
        if (!CONFIG.effects?.glitchText) return;
        const glitch = document.querySelector('.glitch');
        if (!glitch) return;

        const original = CONFIG.name || 'XYLOS';
        const chars = '!@#$%^&*()_+-=[]{}|;:,.<>?';

        setInterval(() => {
            if (Math.random() > 0.7) {
                const pos = Math.floor(Math.random() * original.length);
                const char = chars[Math.floor(Math.random() * chars.length)];
                glitch.textContent = original.substring(0, pos) + char + original.substring(pos + 1);
                glitch.setAttribute('data-text', glitch.textContent);
                setTimeout(() => {
                    glitch.textContent = original;
                    glitch.setAttribute('data-text', original);
                }, 100);
            }
        }, 2000);
    }

    // ─── Card Hover Glow Follow ───
    function initCardGlow() {
        document.querySelectorAll('.social-card, .media-card, .about-card').forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                card.style.setProperty('--mouse-x', x + 'px');
                card.style.setProperty('--mouse-y', y + 'px');
            });
        });
    }

    // ─── Parallax on Scroll ───
    function initParallax() {
        window.addEventListener('scroll', () => {
            const scrolled = window.scrollY;
            const orbs = document.querySelectorAll('.orb');
            orbs.forEach((orb, i) => {
                const speed = 0.1 + (i * 0.05);
                orb.style.transform = `translateY(${scrolled * speed}px)`;
            });
        });
    }

    // ─── Intersection Observer for Animations ───
    function initScrollAnimations() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, { threshold: 0.1 });

        document.querySelectorAll('.social-card, .media-card, .section-header').forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'all 0.6s ease';
            observer.observe(el);
        });
    }

    // ─── Initialize ───
    document.addEventListener('DOMContentLoaded', () => {
        applyConfig();
        initLoader();
        randomGlitch();
        initCardGlow();
        initParallax();
        initScrollAnimations();
    });

})();
