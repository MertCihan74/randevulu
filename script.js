// Hero Slider Fonksiyonları
let currentSlide = 0;
const slides = document.querySelectorAll('.slide');
const dots = document.querySelectorAll('.slider-dots .dot');

function showSlide(index) {
    slides.forEach(slide => slide.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));

    slides[index].classList.add('active');
    dots[index].classList.add('active');
    currentSlide = index;
}

function nextSlide() {
    currentSlide = (currentSlide + 1) % slides.length;
    showSlide(currentSlide);
}

function prevSlide() {
    currentSlide = (currentSlide - 1 + slides.length) % slides.length;
    showSlide(currentSlide);
}

// Otomatik slider
let slideInterval = setInterval(nextSlide, 5000);

// Dot click olayları
dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
        clearInterval(slideInterval);
        showSlide(index);
        slideInterval = setInterval(nextSlide, 5000);
    });
});

// Testimonial Slider
let currentTestimonial = 0;
const testimonials = document.querySelectorAll('.testimonial');
const testimonialDots = document.querySelectorAll('.testimonial-dots .dot');

function showTestimonial(index) {
    testimonials.forEach(testimonial => testimonial.classList.remove('active'));
    testimonialDots.forEach(dot => dot.classList.remove('active'));

    testimonials[index].classList.add('active');
    testimonialDots[index].classList.add('active');
    currentTestimonial = index;
}

function nextTestimonial() {
    currentTestimonial = (currentTestimonial + 1) % testimonials.length;
    showTestimonial(currentTestimonial);
}

// Otomatik testimonial değişimi
setInterval(nextTestimonial, 4000);

// Testimonial dot click olayları
testimonialDots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
        showTestimonial(index);
    });
});

// Navbar scroll efekti
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Mobile menu toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', function() {
    navMenu.classList.toggle('active');
    hamburger.classList.toggle('active');
});

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Sayfa yüklendiğinde çalıştır
document.addEventListener('DOMContentLoaded', function() {
    // Başlangıç slide'ını göster
    showSlide(0);
    showTestimonial(0);

    // Animasyonları ekle
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
            }
        });
    }, observerOptions);

    // Gözlemlemek istediğimiz elementleri seç
    const animatedElements = document.querySelectorAll('.service-card, .team-member, .gallery-item, .contact-item');
    animatedElements.forEach(el => observer.observe(el));
});

// Form validation için yardımcı fonksiyon
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validatePhone(phone) {
    const re = /^[\+]?[0-9\-\s\(\)]{10,}$/;
    return re.test(phone);
}

// Randevu formu için temel validasyon (randevu.html'de kullanılacak)
function validateAppointmentForm(formData) {
    const errors = [];

    if (!formData.name || formData.name.trim().length < 2) {
        errors.push('İsim en az 2 karakter olmalıdır.');
    }

    if (!formData.email || !validateEmail(formData.email)) {
        errors.push('Geçerli bir e-posta adresi giriniz.');
    }

    if (!formData.phone || !validatePhone(formData.phone)) {
        errors.push('Geçerli bir telefon numarası giriniz.');
    }

    if (!formData.service) {
        errors.push('Lütfen bir hizmet seçiniz.');
    }

    if (!formData.date) {
        errors.push('Lütfen bir tarih seçiniz.');
    }

    if (!formData.time) {
        errors.push('Lütfen bir saat seçiniz.');
    }

    return errors;
}

// Local Storage ile randevu verilerini yönetme
function saveAppointment(appointment) {
    const appointments = JSON.parse(localStorage.getItem('appointments') || '[]');
    appointments.push({
        ...appointment,
        id: Date.now(),
        status: 'pending'
    });
    localStorage.setItem('appointments', JSON.stringify(appointments));
}

function getAppointments() {
    return JSON.parse(localStorage.getItem('appointments') || '[]');
}

// Admin paneli için randevuları getirme
function getPendingAppointments() {
    const appointments = getAppointments();
    return appointments.filter(app => app.status === 'pending');
}

function getConfirmedAppointments() {
    const appointments = getAppointments();
    return appointments.filter(app => app.status === 'confirmed');
}

// Randevu durumunu güncelleme
function updateAppointmentStatus(id, status) {
    const appointments = getAppointments();
    const index = appointments.findIndex(app => app.id === id);
    if (index !== -1) {
        appointments[index].status = status;
        localStorage.setItem('appointments', JSON.stringify(appointments));
    }
}
