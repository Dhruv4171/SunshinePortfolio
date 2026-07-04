const scrollTopBtn = document.getElementById('scrollTop');
window.addEventListener('scroll', () => scrollTopBtn.classList.toggle('show', window.scrollY > 400));
scrollTopBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', function(e) {
        e.preventDefault();
        const t = document.querySelector(this.getAttribute('href'));
        if (t) window.scrollTo({ top: t.offsetTop - 80, behavior: 'smooth' });
        document.getElementById('mobileNav')?.classList.remove('show');
    });
});

function handleFormSubmit(form) {
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        const data = new FormData(this);
        const message = [
            'Hi Sunshine Motor Driving School, I want to enquire about driving classes.',
            `Name: ${data.get('name') || ''}`,
            `Phone: ${data.get('phone') || ''}`,
            `Course: ${data.get('course') || 'Not selected'}`,
            `Message: ${data.get('message') || 'Please call me back.'}`
        ].join('\n');
        window.open(`https://wa.me/918502010101?text=${encodeURIComponent(message)}`, '_blank');
        this.reset();
        const btn = this.querySelector('button[type="submit"]');
        if (btn) {
            const orig = btn.innerHTML;
            btn.innerHTML = '<i class="fas fa-check-circle"></i> Sent!';
            btn.disabled = true;
            setTimeout(() => { btn.innerHTML = orig; btn.disabled = false; }, 3000);
        }
    });
}

const heroForm = document.getElementById('heroEnquiry');
if (heroForm) handleFormSubmit(heroForm);

document.querySelectorAll('.gallery-item').forEach(item => {
    item.setAttribute('tabindex', '0');
    item.setAttribute('role', 'button');
    item.setAttribute('aria-label', `Open ${item.querySelector('img')?.alt || 'gallery image'}`);
    item.addEventListener('click', function() {
        const img = this.querySelector('img').src;
        const o = document.createElement('div');
        o.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.95);z-index:9999;display:flex;align-items:center;justify-content:center;cursor:pointer;padding:20px;';
        const i = document.createElement('img');
        i.src = img;
        i.style.cssText = 'max-width:92%;max-height:92%;border-radius:8px;object-fit:contain;';
        o.appendChild(i);
        o.addEventListener('click', () => o.remove());
        document.body.appendChild(o);
    });
    item.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); this.click(); }
    });
});

const observer = new IntersectionObserver((entries) => { entries.forEach(e => { if(e.isIntersecting) e.target.classList.add('aos-animate'); }); }, { threshold: 0.1 });
document.querySelectorAll('[data-aos]').forEach(el => observer.observe(el));

if (!('ontouchstart' in window)) {
    document.querySelectorAll('a[href^="tel:"]').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const num = this.getAttribute('href').replace('tel:', '');
            navigator.clipboard.writeText(num).then(() => {
                const tip = document.createElement('div');
                tip.textContent = 'Number copied!';
                tip.style.cssText = 'position:fixed;bottom:140px;right:24px;background:var(--primary);color:#fff;padding:10px 18px;border-radius:8px;font-size:14px;z-index:9999;box-shadow:0 4px 12px rgba(0,0,0,0.2);';
                document.body.appendChild(tip);
                setTimeout(() => tip.remove(), 2000);
            });
        });
    });
}