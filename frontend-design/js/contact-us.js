/* Contact Us Page JavaScript */

// Contact Form Handling
const contactForm = $('#contactForm');
const formSuccess = $('#formSuccess');

if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(contactForm);
        const data = Object.fromEntries(formData);
        
        // Validate form
        if (!validateForm(data)) {
            return;
        }
        
        // Show success message (in production, this would send to server)
        showFormSuccess();
        
        // Log form data (for demo purposes)
        console.log('Form submitted:', data);
        
        // In production, you would send this to your backend:
        // fetch('/api/contact', {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify(data)
        // });
    });
}

function validateForm(data) {
    // Basic validation
    if (!data.fullName || data.fullName.trim().length < 2) {
        showToast('Please enter your full name');
        return false;
    }
    
    if (!data.email || !isValidEmail(data.email)) {
        showToast('Please enter a valid email address');
        return false;
    }
    
    if (!data.country) {
        showToast('Please select your country');
        return false;
    }
    
    if (!data.phone || data.phone.trim().length < 7) {
        showToast('Please enter a valid phone number');
        return false;
    }
    
    if (!data.message || data.message.trim().length < 10) {
        showToast('Please enter a message (at least 10 characters)');
        return false;
    }
    
    return true;
}

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function showFormSuccess() {
    contactForm.style.display = 'none';
    formSuccess.style.display = 'block';
    formSuccess.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function resetForm() {
    contactForm.reset();
    contactForm.style.display = 'flex';
    formSuccess.style.display = 'none';
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// FAQ Accordion with Expand All
const expandAllBtn = $('#expandAllBtn');
let allExpanded = false;

$$('.faq-item').forEach(item => {
    const question = $('.faq-question', item);
    
    question.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        
        // Close this item if it's active, otherwise open it
        if (isActive) {
            item.classList.remove('active');
            question.setAttribute('aria-expanded', 'false');
        } else {
            item.classList.add('active');
            question.setAttribute('aria-expanded', 'true');
        }
    });
});

// Expand All Button
if (expandAllBtn) {
    expandAllBtn.addEventListener('click', () => {
        allExpanded = !allExpanded;
        
        $$('.faq-item').forEach(item => {
            const question = $('.faq-question', item);
            if (allExpanded) {
                item.classList.add('active');
                question.setAttribute('aria-expanded', 'true');
            } else {
                item.classList.remove('active');
                question.setAttribute('aria-expanded', 'false');
            }
        });
        
        expandAllBtn.textContent = allExpanded ? 'Collapse All' : 'Expand All';
    });
}

// Auto-resize textarea
const textarea = $('#message');
if (textarea) {
    textarea.addEventListener('input', () => {
        textarea.style.height = 'auto';
        textarea.style.height = Math.max(textarea.scrollHeight, 120) + 'px';
    });
}

// Country select sorting
const countrySelect = $('#country');
if (countrySelect) {
    // Sort countries alphabetically
    const options = Array.from(countrySelect.options).slice(1);
    options.sort((a, b) => a.text.localeCompare(b.text));
    
    // Clear and re-add sorted options
    countrySelect.innerHTML = '<option value="">Select your country</option>';
    options.forEach(opt => countrySelect.add(opt));
}

// Smooth scroll for phone and email links
$$('a[href^="tel:"], a[href^="mailto:"]').forEach(link => {
    link.addEventListener('click', (e) => {
        showToast('Opening contact app...');
    });
});

// WhatsApp button click tracking
$$('a[href*="wa.me"]').forEach(link => {
    link.addEventListener('click', () => {
        console.log('WhatsApp chat initiated');
        // You could add analytics tracking here
    });
});

// Form field animations
$$('.form-group input, .form-group select, .form-group textarea').forEach(field => {
    field.addEventListener('focus', () => {
        field.parentElement.classList.add('focused');
    });
    
    field.addEventListener('blur', () => {
        field.parentElement.classList.remove('focused');
    });
});