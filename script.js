/**
 * RPM Automotive Repair Ltd - script.js
 * Production-ready JavaScript
 * Updated June 2026 - aligned with current static site structure and hours
 * Features: Mobile menu, live Newfoundland hours, typewriter, smooth scroll,
 * active nav state, email-form formatting, FAQ accordion, scroll progress,
 * header shrink, map toggles, and accessibility improvements
 */

document.addEventListener('DOMContentLoaded', function () {
    // ====================== LUCIDE ICONS ======================
    if (typeof lucide !== 'undefined' && typeof lucide.createIcons === 'function') {
        lucide.createIcons();
    }

    // ====================== HEADER & MOBILE MENU ======================
    const header = document.querySelector('.site-header');
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobile-menu');
    const pageRegions = document.querySelectorAll('main, footer');

    function closeMobileMenu() {
        if (!hamburger || !mobileMenu) return;
        hamburger.setAttribute('aria-expanded', 'false');
        hamburger.setAttribute('aria-label', 'Open mobile menu');
        mobileMenu.classList.remove('open');
        pageRegions.forEach((region) => { region.inert = false; });
        document.body.style.overflow = '';
    }

    if (hamburger && mobileMenu) {
        hamburger.addEventListener('click', () => {
            const isOpen = mobileMenu.classList.contains('open');
            hamburger.setAttribute('aria-expanded', String(!isOpen));
            hamburger.setAttribute('aria-label', isOpen ? 'Open mobile menu' : 'Close mobile menu');
            mobileMenu.classList.toggle('open');
            pageRegions.forEach((region) => { region.inert = !isOpen; });
            document.body.style.overflow = isOpen ? '' : 'hidden';

            if (!isOpen) {
                mobileMenu.querySelector('a')?.focus();
            }
        });

        const desktopViewport = window.matchMedia('(min-width: 1450px)');
        desktopViewport.addEventListener('change', (event) => {
            if (event.matches) closeMobileMenu();
        });
    }

    document.querySelectorAll('.mobile-nav-link').forEach((link) => {
        link.addEventListener('click', closeMobileMenu);
    });

    document.addEventListener('click', (event) => {
        if (!mobileMenu || !hamburger || !mobileMenu.classList.contains('open')) return;
        if (!mobileMenu.contains(event.target) && !hamburger.contains(event.target)) {
            closeMobileMenu();
        }
    });

    document.addEventListener('keydown', (event) => {
        if (!mobileMenu?.classList.contains('open') || !hamburger) return;

        if (event.key === 'Escape') {
            closeMobileMenu();
            hamburger.focus();
            return;
        }

        if (event.key === 'Tab') {
            const focusable = [hamburger, ...mobileMenu.querySelectorAll('a[href]')];
            const first = focusable[0];
            const last = focusable[focusable.length - 1];

            if (event.shiftKey && document.activeElement === first) {
                event.preventDefault();
                last.focus();
            } else if (!event.shiftKey && document.activeElement === last) {
                event.preventDefault();
                first.focus();
            }
        }
    });

    // ====================== SCROLL PROGRESS BAR ======================
    const progressBar = document.querySelector('.scroll-progress-bar');
    if (progressBar) {
        window.addEventListener('scroll', () => {
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrollPercent = docHeight > 0 ? Math.min((scrollTop / docHeight) * 100, 100) : 0;
            progressBar.style.width = `${scrollPercent}%`;
        }, { passive: true });
    }

    // ====================== HEADER SHRINK ON SCROLL ======================
    if (header) {
        window.addEventListener('scroll', () => {
            header.classList.toggle('header--shrink', window.scrollY > 60);
        }, { passive: true });
    }

// ====================== HERO TYPEWRITER ======================
const typewriterEl = document.getElementById('typewriter');

if (typewriterEl) {
    const phrases = [
        'Tires, undercoating, & full repairs',
        'Sailun & Haida tires in stock',
        'Premium undercoating',
        '24/7 towing with our own fleet',
        'Two convenient shop locations',
        'Families keep coming back to RPM',
        'Expert brake repairs & service',
        'Wheel alignment & balancing',
        'Fast oil changes & filters',
        'Rust protection specialists',
        'Convenient tire installation',
        'Winter tire experts',
        '24/7 roadside assistance',
        'Trusted local auto repair',
        'Quality car maintenance',
        'Complete vehicle diagnostics',
        'Affordable tire repairs',
        'Suspension & steering service',
        'Fast, friendly local service'
    ];

    function initializeTypewriter() {
        let phraseIndex = 0;
        let charIndex = 0;
        let isDeleting = false;

        function type() {
            const currentPhrase = phrases[phraseIndex];

            if (!isDeleting) {
                // === TYPING ===
                typewriterEl.textContent = currentPhrase.substring(0, charIndex + 1);
                charIndex++;

                if (charIndex === currentPhrase.length) {
                    setTimeout(() => {
                        isDeleting = true;
                        type();
                    }, 2200);
                    return;
                }
                setTimeout(type, 55);
            } else {
                // === DELETING ===
                charIndex--;
                typewriterEl.textContent = currentPhrase.substring(0, charIndex);

                // CRITICAL FIX: Never let it go fully empty
                if (charIndex <= 0) {
                    // Switch phrase immediately and start typing the new one
                    isDeleting = false;
                    phraseIndex = (phraseIndex + 1) % phrases.length;
                    charIndex = 0;

                    // Instantly put the first character of the new phrase
                    // (this prevents any visible empty state)
                    typewriterEl.textContent = phrases[phraseIndex].substring(0, 1);
                    charIndex = 1;

                    setTimeout(type, 55);
                    return;
                }
                setTimeout(type, 30);
            }
        }

        setTimeout(type, 1200);
    }

    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        initializeTypewriter();
    }
}
    // ====================== LIVE BUSINESS HOURS ======================
    const statusBadge = document.getElementById('open-status');
    const hoursTodayEl = document.getElementById('hours-today');

    function updateLiveStatus() {
        const now = new Date();
        const formatter = new Intl.DateTimeFormat('en-CA', {
            timeZone: 'America/St_Johns',
            weekday: 'short',
            hour: 'numeric',
            minute: 'numeric',
            hour12: false
        });

        const parts = formatter.formatToParts(now);
        const data = {};
        parts.forEach((part) => {
            if (part.type !== 'literal') data[part.type] = part.value;
        });

        const dayMap = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
        const currentDay = dayMap[data.weekday];
        const currentMinutes = parseInt(data.hour, 10) * 60 + parseInt(data.minute, 10);

        let isOpen = false;
        let hoursText = 'Closed Today';

        if (currentDay >= 1 && currentDay <= 5) {
            isOpen = currentMinutes >= 480 && currentMinutes < 990;
            hoursText = '8:00 AM - 4:30 PM';
        } else if (currentDay === 6) {
            isOpen = currentMinutes >= 540 && currentMinutes < 840;
            hoursText = '9:00 AM - 2:00 PM';
        }

        if (statusBadge) {
            statusBadge.textContent = isOpen ? 'Open Now' : 'Closed';
            statusBadge.classList.toggle('status-badge--open', isOpen);
        }

        if (hoursTodayEl) {
            if (isOpen) {
                hoursTodayEl.innerHTML = `<span style="color:#10b981;font-weight:700;">Open Now</span> - ${hoursText}`;
            } else {
                hoursTodayEl.textContent = hoursText;
            }
        }
    }

    if (statusBadge || hoursTodayEl) {
        updateLiveStatus();
        setInterval(updateLiveStatus, 60000);
    }

    // ====================== SMOOTH SCROLL FOR ANCHOR LINKS ======================
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener('click', function (event) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const target = document.querySelector(targetId);
            if (!target) return;

            event.preventDefault();

            const headerOffset = header ? header.offsetHeight : 70;
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.scrollY - headerOffset - 20;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });

            if (mobileMenu && mobileMenu.classList.contains('open')) {
                closeMobileMenu();
            }
        });
    });

    // ====================== ACTIVE NAV LINK ON SCROLL ======================
    const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');
    const sectionObservers = [];

    navLinks.forEach((link) => {
        const href = link.getAttribute('href');
        if (href && href.startsWith('#')) {
            const section = document.querySelector(href);
            if (section) sectionObservers.push({ link, section });
        }
    });

    if (sectionObservers.length) {
        window.addEventListener('scroll', () => {
            const scrollY = window.scrollY + (header ? header.offsetHeight + 100 : 120);
            let activeSet = false;

            sectionObservers.forEach((item) => {
                const sectionTop = item.section.offsetTop;
                const sectionHeight = item.section.offsetHeight;

                if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                    navLinks.forEach((link) => link.classList.remove('active'));
                    item.link.classList.add('active');
                    activeSet = true;
                }
            });

            if (!activeSet) {
                navLinks.forEach((link) => link.classList.remove('active'));
            }
        }, { passive: true });
    }

    // ====================== CONTACT FORM ======================
    const form = document.getElementById('contactForm');
    if (form) {
        form.addEventListener('submit', function (event) {
            event.preventDefault();

            const statusEl = document.getElementById('formStatus');

            function setFormStatus(message, tone) {
                if (!statusEl) return;

                statusEl.textContent = message;
                statusEl.classList.remove('form-status--success', 'form-status--error', 'form-status--pending');

                if (tone) {
                    statusEl.classList.add(`form-status--${tone}`);
                }
            }

            if (!form.checkValidity()) {
                form.reportValidity();
                setFormStatus('Please fill in all required fields.', 'error');
                return;
            }

            const data = new FormData(form);
            const name = String(data.get('name') || '').trim();
            const email = String(data.get('email') || '').trim();
            const phone = String(data.get('phone') || '').trim();
            const service = String(data.get('service') || '').trim();
            const message = String(data.get('message') || '').trim();
            const subject = `RPM Automotive ${service} inquiry from ${name}`;
            const body = [
                `Name: ${name}`,
                `Email: ${email}`,
                `Phone: ${phone}`,
                `Service: ${service}`,
                '',
                message
            ].join('\n');

            setFormStatus('Opening your email app. Review the message there and choose Send.', 'success');
            window.location.href = `mailto:sales@rpm.repair?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        });
    }

    // ====================== FAQ ACCORDION ======================
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach((item) => {
        item.addEventListener('toggle', function () {
            if (this.open) {
                faqItems.forEach((other) => {
                    if (other !== this) other.open = false;
                });
            }
        });
    });

    // ====================== LOCATION MAP TOGGLE ======================
    document.querySelectorAll('.view-map-btn').forEach((btn) => {
        btn.addEventListener('click', () => {
            const mapId = btn.getAttribute('data-map');
            const mapEl = document.getElementById(`${mapId}-map`);
            if (!mapEl) return;

            const iframe = mapEl.querySelector('iframe[data-src]');
            if (iframe && !iframe.hasAttribute('src')) {
                iframe.src = iframe.dataset.src;
            }

            mapEl.classList.toggle('hidden');
            const isExpanded = !mapEl.classList.contains('hidden');
            btn.textContent = isExpanded ? 'Hide Map' : 'View Map';
            btn.setAttribute('aria-expanded', String(isExpanded));
        });
    });

});
