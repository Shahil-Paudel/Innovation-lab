/**
 * SAGARMATHA TREKS — Blog Detail Logic
 * Features: Slider, TOC, Lightbox, Progress Bar, Read Time
 */

document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. READING PROGRESS BAR ---
    const progressBar = document.getElementById('readingProgress');
    window.addEventListener('scroll', () => {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        progressBar.style.width = scrolled + "%";
    });

    // --- 2. ESTIMATED READ TIME ---
    const content = document.getElementById('blogContent');
    const readTimeDisplay = document.getElementById('readTimeDisplay');
    if (content && readTimeDisplay) {
        const text = content.innerText;
        const wpm = 225;
        const words = text.trim().split(/\s+/).length;
        const time = Math.ceil(words / wpm);
        readTimeDisplay.textContent = `${time} min read`;
    }

    // --- 3. AUTO-GENERATE TOC ---
    const tocList = document.getElementById('tocList');
    const headings = content.querySelectorAll('h2, h3');
    
    headings.forEach((heading, index) => {
        // Ensure ID exists
        if (!heading.id) heading.id = `heading-${index}`;
        
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.href = `#${heading.id}`;
        a.textContent = heading.textContent;
        
        // Indent h3
        if (heading.tagName === 'H3') a.style.paddingLeft = '24px';
        
        li.appendChild(a);
        tocList.appendChild(li);
    });

    // Scroll Spy for TOC
    const tocLinks = tocList.querySelectorAll('a');
    const observerOptions = { rootMargin: "-100px 0px -80% 0px" };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                tocLinks.forEach(link => link.classList.remove('active'));
                const activeLink = tocList.querySelector(`a[href="#${entry.target.id}"]`);
                if (activeLink) activeLink.classList.add('active');
            }
        });
    }, observerOptions);

    headings.forEach(heading => observer.observe(heading));

    // --- 4. HERO SLIDER ---
    const slides = document.querySelectorAll('.slide');
    let currentSlide = 0;
    
    function goToSlide(n) {
        slides[currentSlide].classList.remove('active');
        currentSlide = (n + slides.length) % slides.length;
        slides[currentSlide].classList.add('active');
    }

    document.getElementById('slideNext').addEventListener('click', () => goToSlide(currentSlide + 1));
    document.getElementById('slidePrev').addEventListener('click', () => goToSlide(currentSlide - 1));
    
    // Auto advance
    setInterval(() => goToSlide(currentSlide + 1), 6000);

    // --- 5. INLINE SLIDER ---
    const inlineSlides = document.querySelectorAll('.inline-slide');
    let currentInline = 0;
    const inlineNext = document.querySelector('.inline-nav.next');
    
    if (inlineNext) {
        inlineNext.addEventListener('click', () => {
            inlineSlides[currentInline].classList.remove('active');
            currentInline = (currentInline + 1) % inlineSlides.length;
            inlineSlides[currentInline].classList.add('active');
        });
    }

    // --- 6. LIGHTBOX (Images & Videos) ---
    const lightbox = document.getElementById('lightbox');
    const lbImg = document.getElementById('lbImg');
    const lbVideo = document.getElementById('lbVideo');
    const lbCaption = document.getElementById('lbCaption');
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    let currentLbIndex = 0;
    let lbItemsArray = Array.from(galleryItems);

    function openLightbox(index) {
        currentLbIndex = index;
        const item = lbItemsArray[index];
        const type = item.dataset.type;
        const src = item.dataset.src;
        const caption = item.dataset.caption;

        lbCaption.textContent = caption;

        if (type === 'video') {
            lbImg.classList.add('hidden');
            lbVideo.classList.remove('hidden');
            lbVideo.src = src;
        } else {
            lbVideo.classList.add('hidden');
            lbVideo.src = ""; // Stop video
            lbImg.classList.remove('hidden');
            lbImg.src = src;
        }

        lightbox.classList.remove('hidden');
        document.body.classList.add('no-scroll');
    }

    function closeLightbox() {
        lightbox.classList.add('hidden');
        document.body.classList.remove('no-scroll');
        lbVideo.src = ""; // Stop video
    }

    function navigateLightbox(dir) {
        // Only navigate images for now, or handle mixed logic
        // Simple logic: just go next/prev in array
        let newIndex = currentLbIndex + dir;
        if (newIndex < 0) newIndex = lbItemsArray.length - 1;
        if (newIndex >= lbItemsArray.length) newIndex = 0;
        openLightbox(newIndex);
    }

    galleryItems.forEach((item, index) => {
        item.addEventListener('click', () => openLightbox(index));
    });

    document.querySelector('.lb-close').addEventListener('click', closeLightbox);
    document.querySelector('.lb-next').addEventListener('click', () => navigateLightbox(1));
    document.querySelector('.lb-prev').addEventListener('click', () => navigateLightbox(-1));

    // Keyboard Nav
    document.addEventListener('keydown', (e) => {
        if (lightbox.classList.contains('hidden')) return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowRight') navigateLightbox(1);
        if (e.key === 'ArrowLeft') navigateLightbox(-1);
    });

    // --- 7. SAVE BOOKMARK ---
    const saveBtn = document.getElementById('saveBlogBtn');
    const blogId = window.location.pathname; // Use URL as ID
    
    // Check local storage
    let savedBlogs = JSON.parse(localStorage.getItem('savedBlogs') || '[]');
    if (savedBlogs.includes(blogId)) saveBtn.classList.add('saved');

    saveBtn.addEventListener('click', () => {
        if (saveBtn.classList.contains('saved')) {
            savedBlogs = savedBlogs.filter(id => id !== blogId);
            saveBtn.classList.remove('saved');
            // showToast("Removed from saved"); // Assuming showToast exists in index.js
        } else {
            savedBlogs.push(blogId);
            saveBtn.classList.add('saved');
            // showToast("Saved for later");
        }
        localStorage.setItem('savedBlogs', JSON.stringify(savedBlogs));
    });

});