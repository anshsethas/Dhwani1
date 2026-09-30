/* ==========================================
   MY GIRL - DHWANI (DARK ROMANTIC THEME)
   Cinematic Typewriter, Scroll Reveals, Live Counter & Particle System
   Final Polish Pass
   ========================================== */

document.addEventListener('DOMContentLoaded', () => {

    // ------------------------------------------
    // 1. SCROLL PROGRESS BAR
    // ------------------------------------------
    const scrollProgress = document.getElementById('scroll-progress');
    window.addEventListener('scroll', () => {
        if (!scrollProgress) return;
        const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
        if (totalHeight > 0) {
            const progress = (window.scrollY / totalHeight) * 100;
            scrollProgress.style.width = progress + '%';
        }
    }, { passive: true });

    // ------------------------------------------
    // 2. HERO DAYS COUNTER (FROM 9 APRIL 2026)
    // ------------------------------------------
    function initDaysCounter() {
        const startDate = new Date(2026, 3, 9); // April 9, 2026
        const today = new Date();

        const startMidnight = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
        const todayMidnight = new Date(today.getFullYear(), today.getMonth(), today.getDate());

        const timeDiff = todayMidnight.getTime() - startMidnight.getTime();
        const daysDiff = Math.max(0, Math.floor(timeDiff / (1000 * 60 * 60 * 24)));

        const daysCountEl = document.getElementById('days-count');
        if (daysCountEl) {
            let current = 0;
            const step = Math.max(1, Math.ceil(daysDiff / 35));
            const timer = setInterval(() => {
                current += step;
                if (current >= daysDiff) {
                    current = daysDiff;
                    clearInterval(timer);
                }
                daysCountEl.textContent = current;
            }, 35);
        }
    }

    // ------------------------------------------
    // 3. LIVE RELATIONSHIP COUNTER (FROM 9 APR 2026 09:12 PM IST)
    // ------------------------------------------
    function startLiveRelationshipCounter() {
        // Exact start timestamp: 9 April 2026, 9:12 PM IST (Asia/Kolkata)
        const startDate = new Date('2026-04-09T21:12:00+05:30').getTime();

        const daysEl = document.getElementById('live-days');
        const hoursEl = document.getElementById('live-hours');
        const minutesEl = document.getElementById('live-minutes');
        const secondsEl = document.getElementById('live-seconds');

        function updateLiveCounter() {
            const now = new Date().getTime();
            const diff = Math.max(0, now - startDate);

            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
            const minutes = Math.floor((diff / (1000 * 60)) % 60);
            const seconds = Math.floor((diff / 1000) % 60);

            if (daysEl && daysEl.textContent !== String(days)) {
                daysEl.textContent = days;
            }
            if (hoursEl) hoursEl.textContent = String(hours).padStart(2, '0');
            if (minutesEl) minutesEl.textContent = String(minutes).padStart(2, '0');

            if (secondsEl) {
                const formattedSec = String(seconds).padStart(2, '0');
                if (formattedSec !== secondsEl.textContent) {
                    secondsEl.textContent = formattedSec;
                    secondsEl.classList.remove('tick-pulse');
                    void secondsEl.offsetWidth; // Trigger reflow for tick pulse
                    secondsEl.classList.add('tick-pulse');
                }
            }
        }

        updateLiveCounter();
        setInterval(updateLiveCounter, 1000);
    }

    startLiveRelationshipCounter();

    // ------------------------------------------
    // 4. TYPEWRITER EFFECT HELPER
    // ------------------------------------------
    function typeSentence(element, text, options = {}) {
        return new Promise((resolve) => {
            const speed = options.speed || 55;
            let index = 0;
            element.textContent = '';

            function typeNextChar() {
                if (index < text.length) {
                    element.textContent += text.charAt(index);
                    
                    if (options.onChar && (text.charAt(index) === ' ' || index === text.length - 1)) {
                        options.onChar(text.substring(0, index + 1), index);
                    }

                    index++;
                    const randomDelay = speed + (Math.random() * 30 - 15);
                    setTimeout(typeNextChar, randomDelay);
                } else {
                    if (options.onComplete) options.onComplete();
                    resolve();
                }
            }
            typeNextChar();
        });
    }

    // ------------------------------------------
    // 5. OPENING SCREEN TYPEWRITER SEQUENCE
    // ------------------------------------------
    const openingTypewriterEl = document.getElementById('opening-typewriter');
    const openingCursorEl = document.querySelector('#opening-screen .type-cursor');
    const openingScreen = document.getElementById('opening-screen');
    const openBtn = document.getElementById('open-btn');
    const mainContent = document.getElementById('main-content');
    const openingGlow = document.getElementById('opening-glow');

    const openingSentences = [
        "For my girl, Dhwani...",
        "I never thought we'd become this close.",
        "But somehow... here we are. ❤️"
    ];

    async function startOpeningTypewriterSequence() {
        if (!openingTypewriterEl) return;

        for (let i = 0; i < openingSentences.length; i++) {
            await typeSentence(openingTypewriterEl, openingSentences[i], {
                speed: 60,
                onChar: (substring) => {
                    if (substring.endsWith("girl") || substring.endsWith("close") || substring.endsWith("are.")) {
                        spawnFloatingHeartAtElement(openingTypewriterEl);
                    }
                }
            });

            if (i < openingSentences.length - 1) {
                await new Promise(res => setTimeout(res, 1300));
            }
        }
        
        if (openingCursorEl) {
            openingCursorEl.classList.add('fade-out');
        }
    }

    startOpeningTypewriterSequence();

    // ------------------------------------------
    // 6. MINI MUSIC PLAYER & USER-GESTURE AUTOPLAY
    // ------------------------------------------
    const musicBtn = document.getElementById('music-toggle');
    const bgMusic = document.getElementById('bg-music');
    let isPlaying = false;
    let audioCtx = null;
    let fallbackOscillators = [];

    function updateMusicPlayerUI(playing) {
        isPlaying = playing;
        if (musicBtn) {
            if (playing) {
                musicBtn.classList.add('playing');
                musicBtn.setAttribute('aria-label', 'Pause My Girl');
                musicBtn.setAttribute('title', 'My Girl · Playing ♡');
            } else {
                musicBtn.classList.remove('playing');
                musicBtn.setAttribute('aria-label', 'Play My Girl');
                musicBtn.setAttribute('title', 'My Girl · Paused ♡');
            }
        }
    }

    function playMusic() {
        if (bgMusic) {
            bgMusic.play()
                .then(() => {
                    updateMusicPlayerUI(true);
                })
                .catch(err => {
                    console.log('Audio file play prevented, using ambient synth fallback:', err);
                    playAmbientChords();
                });
        } else {
            playAmbientChords();
        }
    }

    function pauseMusic() {
        updateMusicPlayerUI(false);
        if (bgMusic) bgMusic.pause();
        stopAmbientChords();
    }

    if (musicBtn) {
        musicBtn.addEventListener('click', (e) => {
            spawnHeartBurst(e.clientX, e.clientY, 3);
            if (!isPlaying) {
                playMusic();
            } else {
                pauseMusic();
            }
        });
    }

    // Web Audio Fallback Synthesizer
    function playAmbientChords() {
        try {
            if (!audioCtx) {
                const AudioContext = window.AudioContext || window.webkitAudioContext;
                audioCtx = new AudioContext();
            }
            if (audioCtx.state === 'suspended') {
                audioCtx.resume();
            }

            stopAmbientChords();

            const frequencies = [220.00, 277.18, 329.63, 440.00];
            const now = audioCtx.currentTime;

            frequencies.forEach(freq => {
                const osc = audioCtx.createOscillator();
                const gain = audioCtx.createGain();

                osc.type = 'sine';
                osc.frequency.setValueAtTime(freq, now);

                gain.gain.setValueAtTime(0.001, now);
                gain.gain.exponentialRampToValueAtTime(0.035, now + 2);

                osc.connect(gain);
                gain.connect(audioCtx.destination);

                osc.start(now);
                fallbackOscillators.push({ osc, gain });
            });

            updateMusicPlayerUI(true);
        } catch (e) {}
    }

    function stopAmbientChords() {
        if (fallbackOscillators.length > 0 && audioCtx) {
            const now = audioCtx.currentTime;
            fallbackOscillators.forEach(item => {
                item.gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.8);
                setTimeout(() => {
                    try { item.osc.stop(); } catch(e) {}
                }, 800);
            });
            fallbackOscillators = [];
        }
    }

    // Opening Button Click Handler (Triggers Music & Reveals Website)
    if (openBtn && openingScreen && mainContent) {
        openBtn.addEventListener('click', (e) => {
            playMusic();

            const rect = openBtn.getBoundingClientRect();
            if (openingGlow) {
                openingGlow.style.left = (rect.left + rect.width / 2) + 'px';
                openingGlow.style.top = (rect.top + rect.height / 2) + 'px';
                openingGlow.classList.add('expanded');
            }

            spawnHeartBurst(e.clientX || rect.left, e.clientY || rect.top, 5);

            setTimeout(() => {
                openingScreen.classList.add('dismissed');
                mainContent.classList.remove('hidden');
                window.scrollTo({ top: 0, behavior: 'smooth' });

                setTimeout(() => {
                    initDaysCounter();
                    initScrollObserver();
                }, 300);
            }, 650);
        });
    }

    // ------------------------------------------
    // 7. CINEMATIC SCROLL REVEALS
    // ------------------------------------------
    function initScrollObserver() {
        const sections = document.querySelectorAll('.reveal-section');
        const sectionObserver = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    
                    if (entry.target.id === 'message-section') {
                        triggerProgressiveLines();
                    }

                    if (entry.target.id === 'final-section') {
                        triggerFinalSpecialReveal();
                    }

                    obs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        sections.forEach(sec => sectionObserver.observe(sec));

        const staggerItems = document.querySelectorAll('.reveal-card-slide, .reveal-memory-card, .reveal-photo');
        const staggerObserver = new IntersectionObserver((entries, obs) => {
            entries.forEach((entry, idx) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.classList.add('visible');
                    }, (idx % 3) * 110);
                    obs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.08 });

        staggerItems.forEach(item => staggerObserver.observe(item));
    }

    // Progressive Lines for Message Section
    let progressiveTriggered = false;
    function triggerProgressiveLines() {
        if (progressiveTriggered) return;
        progressiveTriggered = true;

        const lines = document.querySelectorAll('#progressive-message .msg-line');
        lines.forEach((line, index) => {
            setTimeout(() => {
                line.classList.add('line-visible');
            }, index * 420);
        });
    }

    // Special Final Typewriter Reveal
    let finalTriggered = false;
    function triggerFinalSpecialReveal() {
        if (finalTriggered) return;
        finalTriggered = true;

        const typedTarget = document.getElementById('special-typed-text');
        const cursorEl = document.getElementById('special-cursor');
        const auraEl = document.getElementById('pink-heart-aura');
        const sublinesEl = document.getElementById('final-sublines');
        const finalSentence = "And somehow, out of everyone, I found my person. ❤️";

        if (!typedTarget) return;

        setTimeout(() => {
            typeSentence(typedTarget, finalSentence, {
                speed: 65,
                onChar: (sub) => {
                    if (sub.endsWith("person.")) {
                        if (auraEl) auraEl.classList.add('expanded');
                    }
                },
                onComplete: () => {
                    if (cursorEl) cursorEl.classList.add('fade-out');
                    if (auraEl) auraEl.classList.add('expanded');
                    
                    setTimeout(() => {
                        if (sublinesEl) sublinesEl.classList.add('visible');
                    }, 600);
                }
            });
        }, 400);
    }

    // ------------------------------------------
    // 8. FINAL INTERACTION ("One more thing... ♡")
    // ------------------------------------------
    const oneMoreBtn = document.getElementById('one-more-thing-btn');
    const oneMoreContent = document.getElementById('one-more-thing-content');

    if (oneMoreBtn && oneMoreContent) {
        oneMoreBtn.addEventListener('click', (e) => {
            spawnHeartBurst(e.clientX, e.clientY, 4);
            oneMoreContent.classList.toggle('revealed');
            if (oneMoreContent.classList.contains('revealed')) {
                oneMoreBtn.textContent = 'One more thing... ♡';
            }
        });
    }

    // ------------------------------------------
    // 9. PHOTO GALLERY LIGHTBOX (9 PHOTOS)
    // ------------------------------------------
    const galleryCards = document.querySelectorAll('.photo-card');
    const lightboxModal = document.getElementById('lightbox-modal');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxClose = document.getElementById('lightbox-close');
    const lightboxPrev = document.getElementById('lightbox-prev');
    const lightboxNext = document.getElementById('lightbox-next');

    let currentPhotoIndex = 0;
    const totalPhotos = galleryCards.length;

    galleryCards.forEach((card) => {
        card.addEventListener('click', (e) => {
            const idx = parseInt(card.getAttribute('data-index') || 0, 10);
            openLightbox(idx);
            spawnHeartBurst(e.clientX, e.clientY, 3);
        });
    });

    function openLightbox(index) {
        currentPhotoIndex = index;
        const imgEl = galleryCards[index].querySelector('.photo-fg-main') || galleryCards[index].querySelector('img');
        if (imgEl && lightboxModal && lightboxImg) {
            lightboxImg.src = imgEl.src;
            lightboxModal.classList.add('active');
            lightboxModal.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden';
        }
    }

    function closeLightbox() {
        if (lightboxModal) {
            lightboxModal.classList.remove('active');
            lightboxModal.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
        }
    }

    function showNextPhoto() {
        currentPhotoIndex = (currentPhotoIndex + 1) % totalPhotos;
        openLightbox(currentPhotoIndex);
    }

    function showPrevPhoto() {
        currentPhotoIndex = (currentPhotoIndex - 1 + totalPhotos) % totalPhotos;
        openLightbox(currentPhotoIndex);
    }

    if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
    if (lightboxNext) lightboxNext.addEventListener('click', showNextPhoto);
    if (lightboxPrev) lightboxPrev.addEventListener('click', showPrevPhoto);

    if (lightboxModal) {
        lightboxModal.addEventListener('click', (e) => {
            if (e.target === lightboxModal) closeLightbox();
        });

        let touchStartX = 0;
        let touchEndX = 0;

        lightboxModal.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        lightboxModal.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            if (touchStartX - touchEndX > 45) showNextPhoto();
            if (touchEndX - touchStartX > 45) showPrevPhoto();
        }, { passive: true });
    }

    document.addEventListener('keydown', (e) => {
        if (lightboxModal && lightboxModal.classList.contains('active')) {
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowRight') showNextPhoto();
            if (e.key === 'ArrowLeft') showPrevPhoto();
        }
    });

    // ------------------------------------------
    // 10. MICRO-INTERACTIONS & FLOATING HEARTS
    // ------------------------------------------
    function spawnFloatingHeartAtElement(el) {
        if (!el) return;
        const rect = el.getBoundingClientRect();
        spawnHeartBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, 1);
    }

    function spawnHeartBurst(x, y, count = 1) {
        for (let i = 0; i < count; i++) {
            const heart = document.createElement('div');
            heart.className = 'floating-heart-particle';
            heart.textContent = Math.random() > 0.4 ? '🌸' : '💗';
            heart.style.left = (x + (Math.random() * 30 - 15)) + 'px';
            heart.style.top = (y + (Math.random() * 20 - 10)) + 'px';
            document.body.appendChild(heart);

            setTimeout(() => {
                if (heart.parentNode) heart.parentNode.removeChild(heart);
            }, 1200);
        }
    }

    const heroHeart = document.getElementById('hero-heart');
    const centerpieceHeart = document.getElementById('centerpiece-heart');
    const specialGlowHeart = document.getElementById('special-glow-heart');

    [heroHeart, centerpieceHeart, specialGlowHeart].forEach(h => {
        if (h) {
            h.addEventListener('click', (e) => {
                spawnHeartBurst(e.clientX, e.clientY, 4);
            });
        }
    });

    // ------------------------------------------
    // 11. AMBIENT CANVAS DRIFTING STARS & PETALS
    // ------------------------------------------
    const canvas = document.getElementById('ambient-canvas');
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (canvas && !prefersReducedMotion) {
        const ctx = canvas.getContext('2d');
        let width = canvas.width = window.innerWidth;
        let height = canvas.height = window.innerHeight;

        window.addEventListener('resize', () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        }, { passive: true });

        const particleCount = 26;
        const particles = [];

        for (let i = 0; i < particleCount; i++) {
            particles.push({
                x: Math.random() * width,
                y: Math.random() * height,
                size: Math.random() * 2.2 + 0.8,
                speedY: Math.random() * 0.22 + 0.08,
                speedX: Math.sin(Math.random() * Math.PI) * 0.12,
                opacity: Math.random() * 0.45 + 0.15,
                opacityDelta: (Math.random() * 0.008 + 0.003) * (Math.random() > 0.5 ? 1 : -1),
                isBrightStar: Math.random() > 0.75,
                type: Math.random() > 0.6 ? 'star' : 'petal'
            });
        }

        function drawParticles() {
            ctx.clearRect(0, 0, width, height);

            // Determine density multiplier based on scroll position
            const isOpeningVisible = !openingScreen || !openingScreen.classList.contains('dismissed');
            const densityRatio = isOpeningVisible ? 1.0 : 0.35;
            const activeLimit = Math.ceil(particleCount * densityRatio);

            for (let i = 0; i < activeLimit; i++) {
                const p = particles[i];
                p.y += p.speedY;
                p.x += Math.sin(p.y * 0.015) * 0.12;

                // Opacity pulse
                p.opacity += p.opacityDelta;
                if (p.opacity >= 0.65 || p.opacity <= 0.1) {
                    p.opacityDelta = -p.opacityDelta;
                }

                if (p.y > height) {
                    p.y = -10;
                    p.x = Math.random() * width;
                }

                ctx.save();
                ctx.globalAlpha = p.opacity;

                if (p.isBrightStar) {
                    ctx.fillStyle = '#F4A6B7';
                    ctx.shadowBlur = 8;
                    ctx.shadowColor = '#D96B82';
                    ctx.beginPath();
                    ctx.arc(p.x, p.y, p.size * 1.1, 0, Math.PI * 2);
                    ctx.fill();
                } else if (p.type === 'petal') {
                    ctx.fillStyle = '#D96B82';
                    ctx.beginPath();
                    ctx.ellipse(p.x, p.y, p.size * 1.3, p.size * 0.8, Math.PI / 4, 0, Math.PI * 2);
                    ctx.fill();
                } else {
                    ctx.fillStyle = '#F4A6B7';
                    ctx.beginPath();
                    ctx.arc(p.x, p.y, p.size * 0.7, 0, Math.PI * 2);
                    ctx.fill();
                }

                ctx.restore();
            }

            requestAnimationFrame(drawParticles);
        }

        drawParticles();
    }
});
