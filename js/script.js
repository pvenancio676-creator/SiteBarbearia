/* =========================================================
   BARBEARIA 7 DE SETEMBRO
   JAVASCRIPT PRINCIPAL
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =========================
       HEADER + MENU MOBILE
       ========================= */

    const header = document.getElementById("header");
    const menuToggle = document.getElementById("menuToggle");
    const nav = document.getElementById("nav");

    function updateHeader() {
        header.classList.toggle("scrolled", window.scrollY > 40);
    }

    window.addEventListener("scroll", updateHeader, { passive: true });
    updateHeader();

    menuToggle.addEventListener("click", () => {
        const opened = nav.classList.toggle("open");
        menuToggle.classList.toggle("active", opened);
        menuToggle.setAttribute("aria-expanded", opened);
        document.body.classList.toggle("menu-open", opened);
    });

    nav.querySelectorAll("a").forEach(link => {
        link.addEventListener("click", () => {
            nav.classList.remove("open");
            menuToggle.classList.remove("active");
            menuToggle.setAttribute("aria-expanded", "false");
            document.body.classList.remove("menu-open");
        });
    });

    /* =========================
       BARRA DE PROGRESSO
       ========================= */

    const progress = document.getElementById("scrollProgress");

    function updateProgress() {
        const scrollTop = window.scrollY;
        const pageHeight = document.documentElement.scrollHeight - window.innerHeight;
        const percent = pageHeight > 0 ? (scrollTop / pageHeight) * 100 : 0;
        progress.style.width = `${percent}%`;
    }

    window.addEventListener("scroll", updateProgress, { passive: true });

    /* =========================
       ANIMAÇÕES AO ENTRAR NA TELA
       ========================= */

    const revealElements = document.querySelectorAll(".reveal, .reveal-left, .reveal-right");

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;

            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
        });
    }, {
        threshold: 0.12,
        rootMargin: "0px 0px -50px 0px"
    });

    revealElements.forEach(element => revealObserver.observe(element));

    /* =========================
       CONTADORES
       ========================= */

    const counters = document.querySelectorAll(".counter");
    let countersStarted = false;

    function animateCounters() {
        if (countersStarted) return;
        countersStarted = true;

        counters.forEach(counter => {
            const target = Number(counter.dataset.target);
            const duration = 1400;
            const start = performance.now();

            function update(now) {
                const elapsed = now - start;
                const progress = Math.min(elapsed / duration, 1);
                const eased = 1 - Math.pow(1 - progress, 3);
                const value = Math.floor(target * eased);

                counter.textContent = value.toLocaleString("pt-BR");

                if (progress < 1) {
                    requestAnimationFrame(update);
                }
            }

            requestAnimationFrame(update);
        });
    }

    const stats = document.querySelector(".about-stats");

    if (stats) {
        const statsObserver = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting) {
                animateCounters();
                statsObserver.disconnect();
            }
        }, { threshold: 0.5 });

        statsObserver.observe(stats);
    }

    /* =========================
       CARROSSEL DE CORTES
       ========================= */

    const track = document.getElementById("carouselTrack");
    const slides = Array.from(document.querySelectorAll(".cut-slide"));
    const dots = Array.from(document.querySelectorAll("#carouselDots button"));
    const prevButton = document.getElementById("prevCut");
    const nextButton = document.getElementById("nextCut");
    const currentNumber = document.getElementById("slideCurrent");
    const totalNumber = document.getElementById("slideTotal");

    let currentSlide = 0;
    let autoPlay;

    totalNumber.textContent = String(slides.length).padStart(2, "0");

    function showSlide(index) {
        currentSlide = (index + slides.length) % slides.length;

        track.style.transform = `translateX(-${currentSlide * 100}%)`;

        slides.forEach((slide, i) => {
            slide.classList.toggle("active", i === currentSlide);
        });

        dots.forEach((dot, i) => {
            dot.classList.toggle("active", i === currentSlide);
        });

        currentNumber.textContent = String(currentSlide + 1).padStart(2, "0");
    }

    function nextSlide() {
        showSlide(currentSlide + 1);
    }

    function previousSlide() {
        showSlide(currentSlide - 1);
    }

    function startAutoPlay() {
        clearInterval(autoPlay);
        autoPlay = setInterval(nextSlide, 6000);
    }

    nextButton.addEventListener("click", () => {
        nextSlide();
        startAutoPlay();
    });

    prevButton.addEventListener("click", () => {
        previousSlide();
        startAutoPlay();
    });

    dots.forEach(dot => {
        dot.addEventListener("click", () => {
            showSlide(Number(dot.dataset.slide));
            startAutoPlay();
        });
    });

    /* Swipe no celular */
    let touchStartX = 0;

    track.addEventListener("touchstart", event => {
        touchStartX = event.changedTouches[0].screenX;
    }, { passive: true });

    track.addEventListener("touchend", event => {
        const touchEndX = event.changedTouches[0].screenX;
        const distance = touchEndX - touchStartX;

        if (Math.abs(distance) > 50) {
            distance < 0 ? nextSlide() : previousSlide();
            startAutoPlay();
        }
    }, { passive: true });

    showSlide(0);
    startAutoPlay();

    /* =========================
       EFEITO DE PARALLAX LEVE
       ========================= */

    const hero = document.querySelector(".hero-bg");

    window.addEventListener("scroll", () => {
        if (!hero) return;

        const y = Math.min(window.scrollY * 0.12, 120);
        hero.style.transform = `scale(1.13) translateY(${y}px)`;
    }, { passive: true });

    /* =========================
       CURSOR GLOW
       ========================= */

    const cursorGlow = document.querySelector(".cursor-glow");

    if (cursorGlow && window.matchMedia("(pointer: fine)").matches) {
        window.addEventListener("mousemove", event => {
            cursorGlow.style.left = `${event.clientX}px`;
            cursorGlow.style.top = `${event.clientY}px`;
        }, { passive: true });
    }

    /* =========================
       PAUSA O CARROSSEL AO SAIR
       ========================= */

    document.addEventListener("visibilitychange", () => {
        if (document.hidden) {
            clearInterval(autoPlay);
        } else {
            startAutoPlay();
        }
    });

});
