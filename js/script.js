document.addEventListener('DOMContentLoaded', () => {

    // Header shadow on scroll
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                navbar.style.boxShadow = "0 5px 20px rgba(0,0,0,0.1)";
            } else {
                navbar.style.boxShadow = "none";
            }
        });
    }

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            } else if (window.location.pathname.includes('labs.html')) {
                window.location.href = 'index.html' + this.getAttribute('href');
            }
        });
    });

    // --- ROCKSTAR HERO CAROUSEL LOGIC ---
    const slides = document.querySelectorAll('.slide');
    const indicators = document.querySelectorAll('.indicator');
    let currentSlide = 0;
    const slideIntervalTime = 5000; // 5 seconds

    function changeSlide(index) {
        // Remove active class from current
        slides[currentSlide].classList.remove('active');
        indicators[currentSlide].classList.remove('active');

        // Update index
        currentSlide = index % slides.length;

        // Add active class to new
        slides[currentSlide].classList.add('active');
        indicators[currentSlide].classList.add('active');
    }

    if (slides.length > 0) {
        // Auto-change slider
        setInterval(() => {
            changeSlide(currentSlide + 1);
        }, slideIntervalTime);

        // Click on indicators
        indicators.forEach(ind => {
            ind.addEventListener('click', () => {
                const index = parseInt(ind.getAttribute('data-index'));
                changeSlide(index);
                // Note: Timer continues, could technically rush a slide, but acceptable for simple implementation
            });
        });
    }

    // --- Quotes Carousel System ---
    const quotes = [
        {
            text: "Security is not a product, it’s a process.",
            author: "Kevin Mitnick - World-Famous Hacker"
        },
        {
            text: "Amateurs hack systems, professionals hack people.",
            author: "Bruce Schneier - Cryptographer"
        },
        {
            text: "The only truly secure system is one that is powered off.",
            author: "Gene Spafford - Computer Scientist"
        },
        {
            text: "There are two types of companies: those that have been hacked, and those who don't know it yet.",
            author: "John Chambers - Former Cisco CEO"
        },
        {
            text: "It takes 20 years to build a reputation and few minutes of cyber-incident to ruin it.",
            author: "Stéphane Nappo - CISO"
        },
        {
            text: "The best antivirus is the human brain.",
            author: "Security Principle"
        },
        {
            text: "Remote work is advanced, and so must be its security.",
            author: "Shainal Badusha - Consultant"
        }
    ];

    const quoteTextElem = document.getElementById('quote-display');
    const quoteAuthorElem = document.getElementById('quote-author');

    if (quoteTextElem && quoteAuthorElem) {
        let currentQuoteIndex = 0;

        function animateQuote(quoteObj) {
            // Fade out
            quoteTextElem.style.opacity = 0;
            quoteAuthorElem.style.opacity = 0;
            quoteTextElem.style.transition = 'opacity 0.5s ease';
            quoteAuthorElem.style.transition = 'opacity 0.5s ease';

            setTimeout(() => {
                quoteTextElem.textContent = `"${quoteObj.text}"`;
                quoteAuthorElem.textContent = `- ${quoteObj.author}`;

                // Fade in
                quoteTextElem.style.opacity = 1;
                quoteAuthorElem.style.opacity = 1;
            }, 500);
        }

        // Initialize first quote
        animateQuote(quotes[0]);

        // Rotate quotes
        setInterval(() => {
            currentQuoteIndex = (currentQuoteIndex + 1) % quotes.length;
            animateQuote(quotes[currentQuoteIndex]);
        }, 4000);
    }


    // --- TERMINAL TYPING ANIMATION (Labs Page) ---
    const terminalContent = document.getElementById('terminal-content');
    if (terminalContent) {
        const commandDelay = 800;
        const typingSpeed = 50;
        const sequence = [
            { type: 'input', text: 'whoami', prompt: 'user@box:~$ ' },
            { type: 'output', text: 'www-data' },
            { type: 'input', text: 'sudo -l', prompt: 'www-data@box:~$ ' },
            { type: 'output', text: 'Matching Defaults entries for www-data on box:\n    env_reset, mail_badpass, secure_path=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin\n\nUser www-data may run the following commands on box:\n    (ALL) NOPASSWD: /usr/bin/vim' },
            { type: 'input', text: 'sudo /usr/bin/vim -c ":!/bin/sh"', prompt: 'www-data@box:~$ ' },
            { type: 'output', text: 'Opening Vim editor...' },
            { type: 'output', text: 'Spawning shell...' },
            { type: 'input', text: 'whoami', prompt: '# ' },
            { type: 'output', text: 'root' },
            { type: 'input', text: 'cat /root/root.txt', prompt: '# ' },
            { type: 'output', text: 'HTB{Pr1v1l3g3_Esc4l4t10n_M4st3r_Succe55}\nCongratulations! You have pwned the machine.' }
        ];

        let seqIndex = 0;

        async function typeText(element, text) {
            return new Promise(resolve => {
                let i = 0;
                const interval = setInterval(() => {
                    element.textContent += text.charAt(i);
                    i++;
                    if (i >= text.length) {
                        clearInterval(interval);
                        resolve();
                    }
                }, typingSpeed);
            });
        }

        async function runTerminalSequence() {
            if (seqIndex >= sequence.length) return;

            const item = sequence[seqIndex];
            const div = document.createElement('div');

            if (item.type === 'input') {
                div.className = 'cmd-line';
                const promptSpan = document.createElement('span');
                promptSpan.className = 'prompt';
                promptSpan.textContent = item.prompt;
                const cmdSpan = document.createElement('span');
                cmdSpan.className = 'command';
                const cursor = document.createElement('span');
                cursor.className = 'cursor';

                div.appendChild(promptSpan);
                div.appendChild(cmdSpan);
                div.appendChild(cursor);
                terminalContent.appendChild(div);

                await new Promise(r => setTimeout(r, commandDelay));
                await typeText(cmdSpan, item.text);
                cursor.remove();
            } else {
                div.className = 'output';
                div.textContent = item.text;
                terminalContent.appendChild(div);
                await new Promise(r => setTimeout(r, 200));
            }

            terminalContent.scrollTop = terminalContent.scrollHeight;
            seqIndex++;
            runTerminalSequence();
        }

        runTerminalSequence();
    }

});
