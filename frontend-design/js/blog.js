/**
 * SAGARMATHA TREKS — Blog Listing Logic
 * Features: Smart Suggestions, Sticky Tabs, Pagination, Animations
 */

document.addEventListener('DOMContentLoaded', () => {
    const ITEMS_PER_PAGE = 20;
    
    // --- MOCK DATA ---
    const CATEGORIES = ['planning', 'gear', 'guides', 'culture', 'news'];
    const TITLES = [
        "Best Time to Trek in Nepal", "Essential Gear for EBC", "Understanding Altitude Sickness",
        "Tea House Etiquette 101", "Monsoon Trekking Guide", "Packing List for Annapurna Circuit",
        "Nepali Cuisine You Must Try", "Permits Explained", "Training for High Altitude",
        "Solo vs Group Trekking", "Responsible Tourism Practices", "Langtang Valley Recovery",
        "Photography Tips for Mountains", "Budgeting Your Nepal Trip", "Safety Protocols Post-2024",
        "Sherpa Culture Deep Dive", "Water Purification Methods", "Insurance Requirements",
        "Kathmandu Day Trips", "Chitwan National Park Guide"
    ];

    // Generate 65 mock blogs
    const allBlogs = Array.from({ length: 65 }, (_, i) => {
        const cat = CATEGORIES[i % CATEGORIES.length];
        const titleBase = TITLES[i % TITLES.length];
        const suffix = i > TITLES.length ? ` (Part ${Math.floor(i / TITLES.length) + 1})` : '';
        const date = new Date();
        date.setDate(date.getDate() - (i * 3)); 
        
        return {
            id: `blog-${i}`,
            title: `${titleBase}${suffix}`,
            category: cat,
            date: date.toISOString(),
            excerpt: `Expert insights on ${cat} for your Himalayan adventure. Learn what our guides recommend for a safe and memorable journey.`,
            image: `https://picsum.photos/seed/${i + 100}/600/400`,
            readTime: `${3 + (i % 8)} min read`,
            isTrending: i < 3 // Mark first 3 as trending for manipulation
        };
    });

    // --- STATE ---
    let state = {
        currentPage: 1,
        currentCategory: 'all',
        searchQuery: '',
        filteredBlogs: [...allBlogs]
    };

    // --- DOM ---
    const grid = document.getElementById('blogGrid');
    const paginationContainer = document.getElementById('pagination');
    const searchInput = document.getElementById('blogSearchInput');
    const clearBtn = document.getElementById('clearSearch');
    const tabs = document.querySelectorAll('.tab-btn');
    const resultText = document.getElementById('resultText');
    const emptyState = document.getElementById('emptyState');
    const suggestionsBox = document.getElementById('searchSuggestions');
    const stickyWrapper = document.querySelector('.sticky-tabs-wrapper');

    // --- INIT ---
    function init() {
        bindEvents();
        applyFilters();
        handleScrollEffects();
    }

    function bindEvents() {
        // SEARCH INPUT
        let debounceTimer;
        searchInput.addEventListener('input', (e) => {
            clearTimeout(debounceTimer);
            const val = e.target.value.trim();
            state.searchQuery = val;
            clearBtn.classList.toggle('hidden', !val);
            
            debounceTimer = setTimeout(() => {
                if (val.length >= 2) {
                    showSuggestions(val);
                } else {
                    hideSuggestions();
                }
                state.currentPage = 1;
                applyFilters();
            }, 200);
        });

        // KEYBOARD NAV
        searchInput.addEventListener('keydown', (e) => {
            if (suggestionsBox.classList.contains('hidden')) return;
            
            const items = suggestionsBox.querySelectorAll('.suggestion-item');
            const activeItem = suggestionsBox.querySelector('.suggestion-item.active');
            let currentIndex = Array.from(items).indexOf(activeItem);

            if (e.key === 'ArrowDown') {
                e.preventDefault();
                currentIndex = (currentIndex + 1) % items.length;
                updateActiveSuggestion(items, currentIndex);
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                currentIndex = (currentIndex - 1 + items.length) % items.length;
                updateActiveSuggestion(items, currentIndex);
            } else if (e.key === 'Enter') {
                e.preventDefault();
                if (activeItem) {
                    selectSuggestion(activeItem.dataset.title);
                } else {
                    hideSuggestions();
                    state.currentPage = 1;
                    applyFilters();
                }
            } else if (e.key === 'Escape') {
                hideSuggestions();
            }
        });

        // CLEAR
        clearBtn.addEventListener('click', () => {
            searchInput.value = '';
            state.searchQuery = '';
            clearBtn.classList.add('hidden');
            hideSuggestions();
            state.currentPage = 1;
            applyFilters();
            searchInput.focus();
        });

        // CLICK OUTSIDE
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.blog-search-wrapper')) {
                hideSuggestions();
            }
        });

        // TABS
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                if (tab.dataset.category === state.currentCategory) return;
                tabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                state.currentCategory = tab.dataset.category;
                state.currentPage = 1;
                applyFilters();
            });
        });
    }

    // --- SMART SUGGESTIONS (MANIPULATIVE) ---
    function showSuggestions(query) {
        const q = query.toLowerCase();
        
        // 1. Get actual matches
        let matches = allBlogs.filter(b => 
            b.title.toLowerCase().includes(q) || 
            b.category.toLowerCase().includes(q)
        );

        // 2. MANIPULATION: Prioritize "Trending" or "Editor's Picks" regardless of query match
        // If we have trending items, put them first to steer the user
        const trending = allBlogs.filter(b => b.isTrending);
        
        // Combine: Trending first, then matches (remove duplicates)
        let combined = [...trending];
        matches.forEach(m => {
            if (!combined.find(c => c.id === m.id)) combined.push(m);
        });

        // Limit to 6
        const finalList = combined.slice(0, 6);

        suggestionsBox.innerHTML = '';
        
        if (finalList.length === 0) {
            suggestionsBox.innerHTML = `<div class="suggestion-empty">No matching articles found</div>`;
        } else {
            finalList.forEach(blog => {
                const item = document.createElement('div');
                item.className = 'suggestion-item';
                item.dataset.title = blog.title;
                
                const trendingBadge = blog.isTrending ? `<span class="trending-badge">Trending</span>` : '';
                
                item.innerHTML = `
                    <img src="${blog.image}" alt="" class="suggestion-thumb">
                    <div class="suggestion-info">
                        <div class="suggestion-title">${highlightMatch(blog.title, query)}</div>
                        <div class="suggestion-meta">
                            ${blog.category} ${trendingBadge}
                        </div>
                    </div>
                `;
                item.addEventListener('click', () => selectSuggestion(blog.title));
                suggestionsBox.appendChild(item);
            });
        }
        
        suggestionsBox.classList.remove('hidden');
    }

    function hideSuggestions() {
        suggestionsBox.classList.add('hidden');
    }

    function updateActiveSuggestion(items, index) {
        items.forEach(i => i.classList.remove('active'));
        if (items[index]) {
            items[index].classList.add('active');
            items[index].scrollIntoView({ block: 'nearest' });
        }
    }

    function selectSuggestion(title) {
        searchInput.value = title;
        state.searchQuery = title;
        clearBtn.classList.remove('hidden');
        hideSuggestions();
        state.currentPage = 1;
        applyFilters();
    }

    function highlightMatch(text, query) {
        if (!query) return text;
        const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
        return text.replace(regex, '<mark style="background:var(--pine-soft);color:var(--pine-dark);padding:0 2px;border-radius:2px;">$1</mark>');
    }

    // --- CORE LOGIC ---
    function applyFilters() {
        const query = state.searchQuery.toLowerCase();
        const cat = state.currentCategory;

        state.filteredBlogs = allBlogs.filter(blog => {
            const matchesCat = cat === 'all' || blog.category === cat;
            const matchesSearch = !query || 
                blog.title.toLowerCase().includes(query) || 
                blog.excerpt.toLowerCase().includes(query) ||
                blog.category.toLowerCase().includes(query);
            return matchesCat && matchesSearch;
        });

        updateResultText();
        renderPage();
        renderPagination();
    }

    function updateResultText() {
        const count = state.filteredBlogs.length;
        const catLabel = state.currentCategory === 'all' ? '' : ` in "${state.currentCategory}"`;
        const searchLabel = state.searchQuery ? ` matching "${state.searchQuery}"` : '';
        resultText.textContent = count === 0 
            ? 'No results found' 
            : `Showing ${count} article${count !== 1 ? 's' : ''}${catLabel}${searchLabel}`;
    }

    function renderPage() {
        grid.innerHTML = '';
        const start = (state.currentPage - 1) * ITEMS_PER_PAGE;
        const pageItems = state.filteredBlogs.slice(start, start + ITEMS_PER_PAGE);

        if (pageItems.length === 0) {
            emptyState.classList.remove('hidden');
            grid.style.display = 'none';
            paginationContainer.style.display = 'none';
            return;
        }

        emptyState.classList.add('hidden');
        grid.style.display = '';
        paginationContainer.style.display = '';

        pageItems.forEach((blog, index) => {
            const card = createBlogCard(blog);
            card.style.animationDelay = `${index * 0.05}s`;
            grid.appendChild(card);
        });
    }

    function createBlogCard(blog) {
        const article = document.createElement('article');
        article.className = 'blog-card animate-in';
        const formattedDate = new Date(blog.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

        article.innerHTML = `
            <div class="blog-media">
                <img src="${blog.image}" alt="${blog.title}" loading="lazy">
                <div class="blog-hover-overlay">
                    <a href="blog-detail.html?id=${blog.id}" class="read-more-pill">
                        Read Article 
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                    </a>
                </div>
            </div>
            <div class="blog-body">
                <div class="blog-meta">
                    <span class="blog-cat">${blog.category}</span>
                    <span class="meta-dot"></span>
                    <span>${formattedDate}</span>
                </div>
                <h3 class="blog-title">${highlightMatch(blog.title, state.searchQuery)}</h3>
                <p class="blog-excerpt">${highlightMatch(blog.excerpt, state.searchQuery)}</p>
                <div class="blog-footer">
                    <span>${blog.readTime}</span>
                    <a href="blog-detail.html?id=${blog.id}" style="color:var(--pine); font-weight:700;">Read More &rarr;</a>
                </div>
            </div>
        `;
        return article;
    }

    // --- PAGINATION ---
    function renderPagination() {
        paginationContainer.innerHTML = '';
        const totalPages = Math.ceil(state.filteredBlogs.length / ITEMS_PER_PAGE);
        if (totalPages <= 1) return;

        const prevBtn = createPageButton('‹', state.currentPage - 1, state.currentPage === 1);
        paginationContainer.appendChild(prevBtn);

        const pages = getPageNumbers(state.currentPage, totalPages);
        pages.forEach(p => {
            if (p === '...') {
                const el = document.createElement('span');
                el.className = 'page-ellipsis';
                el.textContent = '...';
                paginationContainer.appendChild(el);
            } else {
                paginationContainer.appendChild(createPageButton(p, p, false, p === state.currentPage));
            }
        });

        const nextBtn = createPageButton('›', state.currentPage + 1, state.currentPage === totalPages);
        paginationContainer.appendChild(nextBtn);
    }

    function createPageButton(label, pageNum, disabled, isActive = false) {
        const btn = document.createElement('button');
        btn.className = `page-btn ${isActive ? 'active' : ''}`;
        btn.textContent = label;
        btn.disabled = disabled;
        if (!disabled && !isActive) {
            btn.addEventListener('click', () => {
                state.currentPage = pageNum;
                applyFilters();
                document.querySelector('.blog-content-section').scrollIntoView({ behavior: 'smooth', block: 'start' });
            });
        }
        return btn;
    }

    function getPageNumbers(current, total) {
        if (total <= 7) return Array.from({length: total}, (_, i) => i + 1);
        const pages = [];
        if (current <= 4) {
            for (let i = 1; i <= 5; i++) pages.push(i);
            pages.push('...', total);
        } else if (current >= total - 3) {
            pages.push(1, '...');
            for (let i = total - 4; i <= total; i++) pages.push(i);
        } else {
            pages.push(1, '...', current - 1, current, current + 1, '...', total);
        }
        return pages;
    }

    // --- SCROLL EFFECTS ---
    function handleScrollEffects() {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                stickyWrapper.classList.add('scrolled');
            } else {
                stickyWrapper.classList.remove('scrolled');
            }
        });
    }

    window.resetFilters = () => {
        searchInput.value = '';
        state.searchQuery = '';
        state.currentCategory = 'all';
        state.currentPage = 1;
        clearBtn.classList.add('hidden');
        hideSuggestions();
        tabs.forEach(t => t.classList.toggle('active', t.dataset.category === 'all'));
        applyFilters();
    };

    init();
});