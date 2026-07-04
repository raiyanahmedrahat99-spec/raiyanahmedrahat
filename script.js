document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. Loading Screen ---
    const loadingScreen = document.getElementById('loading-screen');
    window.addEventListener('load', () => {
        setTimeout(() => {
            loadingScreen.style.opacity = '0';
            loadingScreen.style.visibility = 'hidden';
            
            // Trigger initial scroll reveals after loading
            setTimeout(handleScrollAnimation, 300);
        }, 1500); // 1.5s delay to show loading animation
    });

    // --- 2. Custom Cursor & Spotlight (desktop/pointer only) ---
    const cursor = document.querySelector('.cursor-glow');
    const spotlight = document.querySelector('.mouse-spotlight');
    const isTouchDevice = window.matchMedia('(hover: none) and (pointer: coarse)').matches;

    if (!isTouchDevice) {
        document.addEventListener('mousemove', (e) => {
            const x = e.clientX;
            const y = e.clientY;

            // Custom Cursor
            cursor.style.left = x + 'px';
            cursor.style.top = y + 'px';

            // Spotlight
            spotlight.style.left = x + 'px';
            spotlight.style.top = y + 'px';

            if (spotlight.style.opacity === '0' || !spotlight.style.opacity) {
                spotlight.style.opacity = '1';
            }
        });

        document.addEventListener('mouseleave', () => {
            spotlight.style.opacity = '0';
            cursor.style.opacity = '0';
        });

        document.addEventListener('mouseenter', () => {
            spotlight.style.opacity = '1';
            cursor.style.opacity = '0.7';
        });

        // Cursor interaction on clickable elements
        const clickables = document.querySelectorAll('a, button, .glass-card, .skill-card');
        clickables.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursor.style.transform = 'translate(-50%, -50%) scale(2)';
                cursor.style.backgroundColor = 'var(--accent-indigo)';
            });
            el.addEventListener('mouseleave', () => {
                cursor.style.transform = 'translate(-50%, -50%) scale(1)';
                cursor.style.backgroundColor = 'var(--accent-cyan)';
            });
        });
    } else {
        // Hide decorative cursor elements on touch devices
        if (cursor) cursor.style.display = 'none';
        if (spotlight) spotlight.style.display = 'none';
    }

    // --- 3. Typing Animation ---
    const typingText = document.getElementById('typing-text');
    const words = ["Cybersecurity Enthusiast.", "AI Developer.", "Full Stack Web Developer."];
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;

    function type() {
        const currentWord = words[wordIndex];
        
        if (isDeleting) {
            typingText.textContent = currentWord.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 50;
        } else {
            typingText.textContent = currentWord.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 100;
        }

        if (!isDeleting && charIndex === currentWord.length) {
            isDeleting = true;
            typingSpeed = 2000; // Pause at end
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % words.length;
            typingSpeed = 500; // Pause before new word
        }

        setTimeout(type, typingSpeed);
    }
    
    // Start typing
    setTimeout(type, 2000);

    // --- 4. Scroll Reveal Animations (Intersection Observer) ---
    const revealElements = document.querySelectorAll('.reveal-up');
    
    const revealOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add('active');
            observer.unobserve(entry.target); // Only animate once
        });
    }, revealOptions);

    revealElements.forEach(el => revealObserver.observe(el));

    // Fallback for manual scroll checking if observer misses
    function handleScrollAnimation() {
        const triggerBottom = window.innerHeight * 0.85;
        revealElements.forEach(el => {
            const elTop = el.getBoundingClientRect().top;
            if(elTop < triggerBottom) {
                el.classList.add('active');
            }
        });
    }

    // --- 5. Navbar & Scroll Progress ---
    const navbar = document.getElementById('navbar');
    const scrollProgress = document.getElementById('scroll-progress');
    const backToTopBtn = document.getElementById('back-to-top');

    window.addEventListener('scroll', () => {
        // Navbar Scrolled State
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Scroll Progress Bar
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        scrollProgress.style.width = scrolled + "%";

        // Back to Top Button
        if (window.scrollY > 500) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    });

    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // --- 6. 3D Tilt Effect for Premium Cards (desktop/pointer only) ---
    if (!isTouchDevice) {
        const tiltElements = document.querySelectorAll('.tilt-effect');

        tiltElements.forEach(el => {
            el.addEventListener('mousemove', (e) => {
                const rect = el.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                const centerX = rect.width / 2;
                const centerY = rect.height / 2;

                const rotateX = ((y - centerY) / centerY) * -10; // Max rotation 10deg
                const rotateY = ((x - centerX) / centerX) * 10;

                el.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
            });

            el.addEventListener('mouseleave', () => {
                el.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
            });
        });
    }

    // --- 7. Ripple Effect for Buttons ---
    const rippleBtns = document.querySelectorAll('.ripple');
    
    rippleBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            const x = e.clientX - e.target.getBoundingClientRect().left;
            const y = e.clientY - e.target.getBoundingClientRect().top;
            
            const ripples = document.createElement('span');
            ripples.style.left = x + 'px';
            ripples.style.top = y + 'px';
            ripples.classList.add('ripple-circle');
            
            this.appendChild(ripples);
            
            setTimeout(() => {
                ripples.remove();
            }, 600);
        });
    });

    // --- 8. Hamburger Menu Logic ---
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const navLinksContainer = document.querySelector('.nav-links');
    const menuIcon = mobileMenuBtn ? mobileMenuBtn.querySelector('i') : null;

    function openMobileMenu() {
        navLinksContainer.classList.add('active');
        if (menuIcon) {
            menuIcon.classList.remove('fa-bars');
            menuIcon.classList.add('fa-times');
        }
    }

    function closeMobileMenu() {
        navLinksContainer.classList.remove('active');
        if (menuIcon) {
            menuIcon.classList.remove('fa-times');
            menuIcon.classList.add('fa-bars');
        }
    }

    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', () => {
            if (navLinksContainer.classList.contains('active')) {
                closeMobileMenu();
            } else {
                openMobileMenu();
            }
        });

        // Close menu when clicking a nav link
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', closeMobileMenu);
        });

        // Close menu when clicking outside the nav area
        document.addEventListener('click', (e) => {
            if (
                navLinksContainer.classList.contains('active') &&
                !navLinksContainer.contains(e.target) &&
                !mobileMenuBtn.contains(e.target)
            ) {
                closeMobileMenu();
            }
        });
    }

    // --- 9. Form Submission (Netlify) ---
    const contactForm = document.getElementById('contact-form');
    const formSuccessMsg = document.getElementById('form-success');
    
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const formData = new FormData(contactForm);
            
            fetch("/", {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: new URLSearchParams(formData).toString(),
            })
            .then(() => {
                formSuccessMsg.style.display = 'block';
                contactForm.reset();
                setTimeout(() => {
                    formSuccessMsg.style.display = 'none';
                }, 5000);
            })
            .catch((error) => alert(error));
        });
    }

    // --- 10. Floating Particles Background ---
    const particlesContainer = document.getElementById('particles');
    const particleCount = 30;

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        
        // Random styling
        const size = Math.random() * 3 + 1; // 1px to 4px
        const xPos = Math.random() * 100; // 0% to 100%
        const yPos = Math.random() * 100;
        const opacity = Math.random() * 0.5 + 0.1;
        const duration = Math.random() * 20 + 10; // 10s to 30s
        const delay = Math.random() * 10;

        particle.style.position = 'absolute';
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.background = 'rgba(255, 255, 255, ' + opacity + ')';
        particle.style.borderRadius = '50%';
        particle.style.left = `${xPos}%`;
        particle.style.top = `${yPos}%`;
        
        // Custom animation based on random values
        particle.animate([
            { transform: `translate(0, 0)`, opacity: opacity },
            { transform: `translate(${Math.random() * 100 - 50}px, ${Math.random() * -200 - 50}px)`, opacity: 0 }
        ], {
            duration: duration * 1000,
            delay: delay * 1000,
            iterations: Infinity,
            direction: 'alternate'
        });

        particlesContainer.appendChild(particle);
    }

    // --- 11. Certificates Data ---
    const certificatesData = [
        {
            title: "AI for Business Applications",
            issuer: "Saylor Academy",
            date: "June 20, 2026",
            file: "assets/certificates/AI for Business Applications.pdf"
        },
        {
            title: "Cyber Threat Management",
            issuer: "Cisco Networking Academy",
            date: "14 Jun 2026",
            file: "assets/certificates/Cyber_Threat_Management_certificate_raiyanahmedrahat99-gmail-com_12e6d247-ea6c-48e0-9a48-1e5e37946186.pdf"
        },
        {
            title: "Endpoint Security",
            issuer: "Cisco Networking Academy",
            date: "14 Jun 2026",
            file: "assets/certificates/Endpoint_Security_certificate_raiyanahmedrahat99-gmail-com_a600c760-7792-4348-956e-2b70d2f28401.pdf"
        },
        {
            title: "Vulnerability Management",
            issuer: "Qualys",
            date: "6/16/2026",
            file: "assets/certificates/Diplo Qualy.pdf"
        },
        {
            title: "Building with Artificial Intelligence",
            issuer: "Saylor Academy",
            date: "June 20, 2026",
            file: "assets/certificates/Building with Artificial Intelligence.pdf"
        },
        {
            title: "Junior Cybersecurity Analyst",
            issuer: "Cisco Networking Academy",
            date: "2026",
            file: "assets/certificates/Junior_Cybersecurity_Analyst_Career_Path_certificate_raiyanahmedrahat99-gmail-com_e96213fc-1300-47b1-912c-512c3e1e626e.pdf"
        },
        {
            title: "Network Defense",
            issuer: "Cisco Networking Academy",
            date: "2026",
            file: "assets/certificates/Network_Defense_certificate_raiyanahmedrahat99-gmail-com_fd1877a6-92b0-42d2-947f-a5c88b201f8d.pdf"
        },
        {
            title: "Introduction to Cybersecurity",
            issuer: "Cisco Networking Academy",
            date: "13 Jun 2026",
            file: "assets/certificates/Introduction_to_Cybersecurity_certificate_raiyanahmedrahat99-gmail-com_d87cc8b9-2114-48fc-b20e-0c8ac5d8e2c4.pdf"
        },
        {
            title: "Cyber Hygiene",
            issuer: "Cisco Networking Academy",
            date: "2026",
            file: "assets/certificates/raiyan_ahmed_rahat_cyber_hygiene_123591_copy.pdf"
        },
        {
            title: "Networking Basics",
            issuer: "Cisco Networking Academy",
            date: "14 Jun 2026",
            file: "assets/certificates/Networking_Basics_certificate_raiyanahmedrahat99-gmail-com_a7fb9e4e-79fc-4994-a829-cefb8ec9525b.pdf"
        },
        {
            title: "Python Essentials 1",
            issuer: "Cisco Networking Academy",
            date: "14 Jun 2026",
            file: "assets/certificates/Python_Essentials_1_certificate_raiyanahmedrahat99-gmail-com_83f9e072-75b2-491b-96a8-502eb938b08c.pdf"
        },
        {
            title: "Software Engineering",
            issuer: "Saylor Academy",
            date: "June 14, 2026",
            file: "assets/certificates/Software engineer certificate.pdf"
        },
        {
            title: "Data Science Essentials with Python",
            issuer: "Cisco Networking Academy",
            date: "14 Jun 2026",
            file: "assets/certificates/Data_Science_Essentials_with_Python_certificate_raiyanahmedrahat99-gmail-com_81619de1-ae70-4012-b93b-cdb7e49699c1.pdf"
        },
        {
            title: "Historical & Globalization Influences",
            issuer: "Saylor Academy",
            date: "June 20, 2026",
            file: "assets/certificates/Historical Development and Globalization.pdf"
        }
    ];

    const certContainer = document.getElementById('cert-container');
    if (certContainer) {
        certificatesData.forEach((cert, index) => {
            const delayClass = index % 3 === 0 ? '' : (index % 3 === 1 ? 'delay-1' : 'delay-2');
            
            const cardHTML = `
                <div class="cert-card glass-card reveal-up ${delayClass}">
                    <div class="cert-icon"><i class="fas fa-certificate"></i></div>
                    <div class="cert-info">
                        <h3>${cert.title}</h3>
                        <p>${cert.issuer}</p>
                        <p class="cert-date">${cert.date}</p>
                    </div>
                    <button class="btn btn-secondary btn-sm ripple view-cert-btn" data-pdf="${cert.file}" data-title="${cert.title}">
                        View Certificate <i class="fas fa-eye"></i>
                    </button>
                </div>
            `;
            certContainer.innerHTML += cardHTML;
        });
        
        // Make sure newly added cards are observed so they become visible
        const newRevealElements = certContainer.querySelectorAll('.reveal-up');
        newRevealElements.forEach(el => {
            if (typeof revealObserver !== 'undefined') {
                revealObserver.observe(el);
            } else {
                el.classList.add('active'); // fallback if observer isn't ready
            }
        });
    }

    // --- 12. PDF Viewer Logic ---
    const pdfModal = document.getElementById('pdf-modal');
    const pdfCloseBtn = document.getElementById('pdf-close');
    const pdfTitle = document.getElementById('pdf-title');
    const canvas = document.getElementById('pdf-render');
    const ctx = canvas ? canvas.getContext('2d') : null;
    
    // Set PDF.js worker
    if (typeof pdfjsLib !== 'undefined') {
        pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js';
    }
    
    let pdfDoc = null,
        pageNum = 1,
        pageIsRendering = false,
        pageNumIsPending = null,
        scale = 1.0;
        
    // Render the page
    const renderPage = num => {
        pageIsRendering = true;

        pdfDoc.getPage(num).then(page => {
            const viewport = page.getViewport({ scale });
            canvas.height = viewport.height;
            canvas.width = viewport.width;

            const renderCtx = {
                canvasContext: ctx,
                viewport
            };

            page.render(renderCtx).promise.then(() => {
                pageIsRendering = false;
                if (pageNumIsPending !== null) {
                    renderPage(pageNumIsPending);
                    pageNumIsPending = null;
                }
            });

            document.getElementById('pdf-page-num').textContent = num;
        });
    };

    // Queue render page
    const queueRenderPage = num => {
        if (pageIsRendering) {
            pageNumIsPending = num;
        } else {
            renderPage(num);
        }
    };

    // Show Prev Page
    const showPrevPage = () => {
        if (pageNum <= 1) return;
        pageNum--;
        queueRenderPage(pageNum);
    };

    // Show Next Page
    const showNextPage = () => {
        if (pageNum >= pdfDoc.numPages) return;
        pageNum++;
        queueRenderPage(pageNum);
    };

    // Zoom Functions
    const zoomIn = () => {
        if (scale >= 3.0) return;
        scale += 0.25;
        document.getElementById('pdf-zoom-level').textContent = `${Math.round(scale * 100)}%`;
        queueRenderPage(pageNum);
    };

    const zoomOut = () => {
        if (scale <= 0.5) return;
        scale -= 0.25;
        document.getElementById('pdf-zoom-level').textContent = `${Math.round(scale * 100)}%`;
        queueRenderPage(pageNum);
    };

    // Attach PDF Viewer Events
    if (document.getElementById('pdf-prev')) {
        document.getElementById('pdf-prev').addEventListener('click', showPrevPage);
        document.getElementById('pdf-next').addEventListener('click', showNextPage);
        document.getElementById('pdf-zoom-in').addEventListener('click', zoomIn);
        document.getElementById('pdf-zoom-out').addEventListener('click', zoomOut);
        
        pdfCloseBtn.addEventListener('click', () => {
            pdfModal.classList.remove('open');
            pdfDoc = null;
        });
    }

    // Open PDF logic
    document.addEventListener('click', (e) => {
        const btn = e.target.closest('.view-cert-btn');
        
        if (btn) {
            let rawUrl = btn.getAttribute('data-pdf');
            // Build an absolute URL to ensure PDF.js can locate the file
            const absoluteUrl = new URL(rawUrl, window.location.href).href;
            const title = btn.getAttribute('data-title');
            console.log('Opening PDF (absolute URL):', absoluteUrl); // Debugging
            pdfTitle.textContent = title || "Document";
            pdfModal.classList.add('open');
            
            // Reset viewer
            scale = 1.0;
            if(document.getElementById('pdf-zoom-level')) document.getElementById('pdf-zoom-level').textContent = "100%";
            pageNum = 1;
            // Clear canvas while loading
            if (ctx) {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
            }
            // Load PDF document using absolute URL
            pdfjsLib.getDocument(absoluteUrl).promise.then(pdfDoc_ => {
                pdfDoc = pdfDoc_;
                document.getElementById('pdf-page-count').textContent = pdfDoc.numPages;
                renderPage(pageNum);
            }).catch(err => {
                console.error('PDF Load Error:', err);
                if (ctx) {
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    canvas.width = 600;
                    canvas.height = 400;
                    ctx.font = '24px Inter';
                    ctx.fillStyle = '#ff4444';
                    ctx.textAlign = 'center';
                    ctx.fillText('Certificate file not found.', canvas.width / 2, canvas.height / 2);
                }
            });
        }
    });

    // --- 11. Security Restrictions for PDF Modal ---
    
    // Prevent Right Click globally when modal is open, or specifically on the modal
    if(pdfModal) {
        pdfModal.addEventListener('contextmenu', (e) => {
            e.preventDefault();
        });
    }

    // Prevent Keyboard Shortcuts (Ctrl+P, Ctrl+S, etc.)
    document.addEventListener('keydown', (e) => {
        if (pdfModal && pdfModal.classList.contains('open')) {
            // Check for Ctrl / Cmd
            if (e.ctrlKey || e.metaKey) {
                const key = e.key.toLowerCase();
                // Block Print (p) and Save (s)
                if (key === 'p' || key === 's') {
                    e.preventDefault();
                    console.log(`Action ${key} is disabled for security reasons.`);
                }
            }
        }
    });

});
