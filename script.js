/* chocoma — Cloudflare deployment scripts */

const $ = s => document.querySelector(s);
const $$ = s => Array.from(document.querySelectorAll(s));

// Products data
const products = [
  { id: 1, name: 'شکلات سادات Milk', price: '۴۵,۰۰۰', image: '🍫', desc: 'شوکلاتλή با لبن و کاکائو اصل' },
  { id: 2, name: 'شکلات تیره Dark', price: '۵۲,۰۰۰', image: '🍫', desc: '۷۰٪ کاکائو، طعم intensiv و خالص' },
  { id: 3, name: 'شکلاتilled حبق', price: '۴۸,۰۰۰', image: '🌿', desc: 'ترکیب منحصر به فرد با استربه حبق' },
  { id: 4, name: 'بسته‌بهایی هدیه‌ای', price: '۱۲۰,۰۰۰', image: '🎁', desc: 'بسته‌بندی ویژه برای مناسبت‌ها وهدیه' },
  { id: 5, name: 'شکلاتilled شاتز', price: '۴۱,۰۰۰', image: '🍓', desc: 'شوکلاتلی با Gide strawberry' },
  { id: 6, name: 'خرید عمده B2B', price: 'اتفاقی', image: '🏭', desc: 'برای CAFE و رستوران و فروشگاه‌ها' },
];

// Cart from localStorage
let cart = JSON.parse(localStorage.getItem('chocoma-cart') || '[]');
function saveCart() { localStorage.setItem('chocoma-cart', JSON.stringify(cart)); updateCartCount(); }
function updateCartCount() {
  const el = $('#cartCount');
  if (!el) return;
  const count = cart.reduce((a, i) => a + (i.qty || 0), 0);
  el.textContent = count.toLocaleString('fa-IR');
}
function addToCart(id) {
  const p = products.find(x => x.id === id);
  const existing = cart.find(i => i.id === id);
  if (existing) existing.qty = (existing.qty || 0) + 1;
  else cart.push({ ...p, qty: 1 });
  saveCart();
}

// Render featured products
function renderProducts() {
  const grid = $('#productGrid');
  if (!grid) return;
  grid.innerHTML = products.map(p => `
    <article class="product-card reveal">
      <div class="product-mark">${p.image}</div>
      <h3>${p.name}</h3>
      <p class="product-desc">${p.desc}</p>
      <div class="product-row">
        <span class="product-price">${p.price} تومان</span>
        <button class="btn btn-primary add-to-cart" data-id="${p.id}">افزودن به سبد</button>
      </div>
    </article>
  `).join('');
  $$('.add-to-cart').forEach(btn => {
    btn.addEventListener('click', () => addToCart(Number(btn.dataset.id)));
  });
}

// Top announcement bar rotation
const topMsgs = [
  'ارسال سراسری به تمام شهرهای ایران',
  'ثبت‌نام عمده‌فروشان و نمایندگان جدید باز است',
  'تولید مستمر، با کنترل کیفیت آزمایشگاهی',
];
let topIdx = 0;
const topText = $('#topText');
if (topText) {
  setInterval(() => {
    topText.style.opacity = 0;
    setTimeout(() => {
      topIdx = (topIdx + 1) % topMsgs.length;
      topText.textContent = topMsgs[topIdx];
      topText.style.opacity = 1;
    }, 400);
  }, 3000);
}

// Mobile menu toggle
const menuToggle = $('.menu-toggle');
const mainNav = $('#main-nav');
if (menuToggle && mainNav) {
  menuToggle.addEventListener('click', () => {
    const open = mainNav.classList.toggle('is-open');
    menuToggle.setAttribute('aria-expanded', open);
  });
  // Close menu on nav link click
  $$('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      mainNav.classList.remove('is-open');
      menuToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

// Intersection Observer for reveal animations
const io = new IntersectionObserver(entries => {
  entries.forEach(en => {
    if (en.isIntersecting) {
      en.target.classList.add('is-visible');
      io.unobserve(en.target);
    }
  });
}, { threshold: 0.12 });
$$('.reveal').forEach(el => io.observe(el));

// Newsletter form
const newsletterForm = $('#newsletterForm');
if (newsletterForm) {
  newsletterForm.addEventListener('submit', e => {
    e.preventDefault();
    const btn = newsletterForm.querySelector('button[type="submit"]');
    const original = btn.textContent;
    btn.textContent = 'ثبت شد!';
    btn.disabled = true;
    setTimeout(() => {
      btn.textContent = original;
      btn.disabled = false;
      newsletterForm.reset();
    }, 1500);
  });
}

// Floating CTA show on scroll
const floatCta = $('.float-cta');
if (floatCta) {
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        floatCta.classList.toggle('visible', window.scrollY > 300);
        ticking = false;
      });
      ticking = true;
    }
  });
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  renderProducts();
  updateCartCount();
});