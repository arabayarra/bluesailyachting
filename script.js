/* ============================================================
   BlueSailYachting — script.js
   - İçerik content/site.json dosyasından okunur (panelden düzenlenebilir)
   - Çoklu dil (TR/EN) + localStorage
   - Modal, scroll reveal, sayaç, mobil menü, form
   ============================================================ */

/* ------------------------------------------------------------
   1) ARAYÜZ ÇEVİRİLERİ (sabit etiketler — menü, butonlar, form)
      İçerik metinleri (yat, kamara, yazılar) site.json'dan gelir.
   ------------------------------------------------------------ */
const I18N = {
  tr: {
    nav_about: 'Hakkımızda', nav_fleet: 'Yatlarımız', nav_cabins: 'Kamaralarımız',
    nav_why: 'Neden Biz', nav_booking: 'Rezervasyon', nav_contact: 'İletişim', nav_cta: 'Rezervasyon',
    hero_eyebrow: 'AKDENİZ & EGE • LÜKS YAT KİRALAMA', hero_cta1: 'Hemen Kirala', hero_cta2: 'Filomuzu Keşfet',
    about_eyebrow: 'HAKKIMIZDA',
    stat_yachts: 'Premium Yat', stat_guests: 'Mutlu Misafir', stat_routes: 'Rota', stat_years: 'Yıllık Tecrübe',
    fleet_eyebrow: 'FİLOMUZ', fleet_title: 'Yatlarımız',
    fleet_lead: 'Her biri özenle seçilmiş, donanımlı ve konforlu premium yatlarımızı keşfedin.',
    cabins_eyebrow: 'KONFOR', cabins_title: 'Kamaralarımız',
    cabins_lead: 'Her bütçeye ve zevke uygun, zarafetle tasarlanmış kamara seçenekleri.',
    why_eyebrow: 'AYRICALIK', why_title: 'Neden Bizi Seçmelisiniz?',
    booking_eyebrow: 'REZERVASYON', booking_title: 'Yolculuğunuzu Planlayın',
    booking_lead: 'Formu doldurun, uzman ekibimiz 24 saat içinde size özel teklifle dönüş yapsın. Esnek tarihler, kişiye özel rotalar ve tam sigorta güvencesi.',
    booking_point1: '✓ Ücretsiz iptal (kalkıştan 14 gün önce)',
    booking_point2: '✓ Profesyonel kaptan ve mürettebat dahil',
    booking_point3: '✓ Tam kapsamlı sigorta',
    form_name: 'Ad Soyad', form_email: 'E-posta', form_phone: 'Telefon',
    form_start: 'Başlangıç Tarihi', form_end: 'Bitiş Tarihi', form_guests: 'Misafir Sayısı',
    form_yacht: 'Yat Seçimi', form_port: 'Kalkış Limanı / Rota', form_message: 'Notunuz',
    form_submit: 'Teklif İste', form_success: 'Talebiniz alındı! Ekibimiz en kısa sürede sizinle iletişime geçecek.',
    footer_about: 'Akdeniz ve Ege\'de premium lüks yat kiralama. Hayalinizdeki mavi yolculuk bizimle başlasın.',
    footer_links: 'Hızlı Menü', footer_contact: 'İletişim',
    footer_hours: 'Çalışma Saatleri', footer_hours_val: 'Her gün 09:00 – 21:00', footer_support: '7/24 acil destek hattı',
    footer_rights: 'Tüm hakları saklıdır.',
    per_day: '/ gün', modal_book: 'Bu Yatı Kirala', select_placeholder: 'Yat seçiniz...',
    details: 'Detaylar →'
  },
  en: {
    nav_about: 'About', nav_fleet: 'Our Yachts', nav_cabins: 'Cabins',
    nav_why: 'Why Us', nav_booking: 'Booking', nav_contact: 'Contact', nav_cta: 'Book Now',
    hero_eyebrow: 'MEDITERRANEAN & AEGEAN • LUXURY YACHT CHARTER', hero_cta1: 'Charter Now', hero_cta2: 'Explore Our Fleet',
    about_eyebrow: 'ABOUT US',
    stat_yachts: 'Premium Yachts', stat_guests: 'Happy Guests', stat_routes: 'Routes', stat_years: 'Years of Experience',
    fleet_eyebrow: 'OUR FLEET', fleet_title: 'Our Yachts',
    fleet_lead: 'Discover our premium yachts — each one handpicked, fully equipped and comfortable.',
    cabins_eyebrow: 'COMFORT', cabins_title: 'Our Cabins',
    cabins_lead: 'Elegantly designed cabin options to suit every budget and taste.',
    why_eyebrow: 'PRIVILEGE', why_title: 'Why Choose Us?',
    booking_eyebrow: 'BOOKING', booking_title: 'Plan Your Voyage',
    booking_lead: 'Fill in the form and our expert team will get back to you within 24 hours with a tailored offer. Flexible dates, bespoke routes and full insurance coverage.',
    booking_point1: '✓ Free cancellation (14 days before departure)',
    booking_point2: '✓ Professional captain and crew included',
    booking_point3: '✓ Comprehensive insurance',
    form_name: 'Full Name', form_email: 'Email', form_phone: 'Phone',
    form_start: 'Start Date', form_end: 'End Date', form_guests: 'Number of Guests',
    form_yacht: 'Choose a Yacht', form_port: 'Departure Port / Route', form_message: 'Your Note',
    form_submit: 'Request a Quote', form_success: 'Your request has been received! Our team will contact you shortly.',
    footer_about: 'Premium luxury yacht charter in the Mediterranean and the Aegean. Let your dream blue voyage begin with us.',
    footer_links: 'Quick Links', footer_contact: 'Contact',
    footer_hours: 'Working Hours', footer_hours_val: 'Every day 09:00 – 21:00', footer_support: '24/7 emergency support line',
    footer_rights: 'All rights reserved.',
    per_day: '/ day', modal_book: 'Charter This Yacht', select_placeholder: 'Select a yacht...',
    details: 'Details →'
  }
};

/* ------------------------------------------------------------
   2) DURUM
   ------------------------------------------------------------ */
let currentLang = localStorage.getItem('bsy_lang') || 'tr';
let DATA = null;                              // site.json içeriği buraya yüklenir

function t(key) { return (I18N[currentLang] && I18N[currentLang][key]) || key; }
function L(obj, base) { return obj[base + '_' + currentLang] || obj[base + '_tr'] || ''; }  // dile göre alan seç

// Görsel yüklenmezse zarif bir yedek arka plan
function imgFallback(el) {
  el.onerror = null;
  el.style.background = 'linear-gradient(135deg,#122d52,#0a1f3c)';
  el.removeAttribute('src');
}

/* ------------------------------------------------------------
   3) RENDER FONKSİYONLARI (DATA üzerinden)
   ------------------------------------------------------------ */
function renderContentTexts() {
  if (!DATA) return;
  const set = (id, val) => { const el = document.getElementById(id); if (el && val != null) el.textContent = val; };

  // Hero
  set('heroTitle', L(DATA.hero, 'title'));
  set('heroSubtitle', L(DATA.hero, 'subtitle'));
  if (DATA.hero.image) {
    document.querySelector('.hero').style.backgroundImage = `url('${DATA.hero.image}')`;
  }
  // Hakkımızda
  set('aboutTitle', L(DATA.about, 'title'));
  set('aboutP1', L(DATA.about, 'p1'));
  set('aboutP2', L(DATA.about, 'p2'));
  const aboutImg = document.getElementById('aboutImg');
  if (aboutImg && DATA.about.image) aboutImg.src = DATA.about.image;
  // İletişim
  set('contactAddress', L(DATA.contact, 'address'));
  set('contactPhone', DATA.contact.phone);
  set('contactEmail', DATA.contact.email);
}

function renderFleet() {
  if (!DATA) return;
  const grid = document.getElementById('fleetGrid');
  grid.innerHTML = DATA.yachts.map((y, i) => `
    <article class="yacht reveal" data-idx="${i}">
      <div class="yacht__media">
        <span class="yacht__tag">${L(y, 'tag')}</span>
        <img src="${y.image}" alt="${y.name}" loading="lazy" onerror="imgFallback(this)" />
      </div>
      <div class="yacht__body">
        <h3 class="yacht__name">${y.name}</h3>
        <div class="yacht__meta">
          <span>📏 ${y.length}</span>
          <span>👥 ${y.guests}</span>
          <span>🛏️ ${y.cabins}</span>
        </div>
        <div class="yacht__foot">
          <span class="yacht__price">${y.price} <small>${t('per_day')}</small></span>
          <span class="yacht__more">${t('details')}</span>
        </div>
      </div>
    </article>
  `).join('');

  grid.querySelectorAll('.yacht').forEach(card => {
    card.addEventListener('click', () => openModal(+card.dataset.idx));
  });
}

function renderCabins() {
  if (!DATA) return;
  document.getElementById('cabinsGrid').innerHTML = DATA.cabins.map(c => {
    const feats = L(c, 'features').split(',').map(s => s.trim()).filter(Boolean);
    return `
    <article class="cabin reveal">
      <img src="${c.image}" alt="${L(c, 'name')}" loading="lazy" onerror="imgFallback(this)" />
      <div class="cabin__overlay">
        <h3 class="cabin__name">${L(c, 'name')}</h3>
        <p class="cabin__desc">${L(c, 'desc')}</p>
        <div class="cabin__feat">${feats.map(f => `<span>${f}</span>`).join('')}</div>
      </div>
    </article>`;
  }).join('');
}

function renderWhy() {
  if (!DATA) return;
  document.getElementById('whyGrid').innerHTML = DATA.features.map(f => `
    <article class="feature reveal">
      <span class="feature__icon">${f.icon}</span>
      <h3 class="feature__title">${L(f, 'title')}</h3>
      <p class="feature__desc">${L(f, 'desc')}</p>
    </article>
  `).join('');
}

function renderYachtSelect() {
  if (!DATA) return;
  const sel = document.getElementById('formYacht');
  sel.innerHTML = `<option value="">${t('select_placeholder')}</option>` +
    DATA.yachts.map((y, i) => `<option value="${i}">${y.name}</option>`).join('');
}

/* ------------------------------------------------------------
   4) MODAL (yat detay)
   ------------------------------------------------------------ */
const modal = document.getElementById('modal');

function openModal(idx) {
  const y = DATA.yachts[idx];
  if (!y) return;
  document.getElementById('modalImg').src = y.image;
  document.getElementById('modalImg').alt = y.name;
  document.getElementById('modalTitle').textContent = y.name;
  document.getElementById('modalDesc').textContent = L(y, 'desc');
  document.getElementById('modalPrice').textContent = y.price;

  const lbl = currentLang === 'tr'
    ? { length: 'Uzunluk', guests: 'Misafir', cabins: 'Kamara', crew: 'Mürettebat', speed: 'Hız', year: 'Yapım Yılı', amenities: 'Olanaklar' }
    : { length: 'Length', guests: 'Guests', cabins: 'Cabins', crew: 'Crew', speed: 'Speed', year: 'Year Built', amenities: 'Amenities' };

  document.getElementById('modalSpecs').innerHTML = `
    <li><strong>${lbl.length}</strong>${y.length}</li>
    <li><strong>${lbl.guests}</strong>${y.guests}</li>
    <li><strong>${lbl.cabins}</strong>${y.cabins}</li>
    <li><strong>${lbl.crew}</strong>${y.crew}</li>
    <li><strong>${lbl.speed}</strong>${y.speed}</li>
    <li><strong>${lbl.year}</strong>${y.year}</li>
    <li style="grid-column:1/-1"><strong>${lbl.amenities}</strong>${L(y, 'amenities')}</li>
  `;
  modal.hidden = false;
  document.body.style.overflow = 'hidden';
}

function closeModal() { modal.hidden = true; document.body.style.overflow = ''; }
modal.querySelectorAll('[data-close]').forEach(el => el.addEventListener('click', closeModal));
document.addEventListener('keydown', e => { if (e.key === 'Escape' && !modal.hidden) closeModal(); });

/* ------------------------------------------------------------
   5) DİL DEĞİŞTİRME
   ------------------------------------------------------------ */
function applyLanguage(lang) {
  currentLang = lang;
  localStorage.setItem('bsy_lang', lang);
  document.documentElement.lang = lang;

  // Sabit arayüz metinleri
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (I18N[lang][key] !== undefined) el.textContent = I18N[lang][key];
  });

  // Bayrak aktiflik
  document.querySelectorAll('.lang__btn').forEach(b =>
    b.classList.toggle('active', b.dataset.lang === lang));

  // İçerik (site.json)
  renderContentTexts();
  renderFleet();
  renderCabins();
  renderWhy();
  renderYachtSelect();
  observeReveals();
}

document.querySelectorAll('.lang__btn').forEach(btn => {
  btn.addEventListener('click', () => applyLanguage(btn.dataset.lang));
});

/* ------------------------------------------------------------
   6) SCROLL REVEAL
   ------------------------------------------------------------ */
let revealObserver;
function observeReveals() {
  if (!revealObserver) {
    revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) { entry.target.classList.add('visible'); revealObserver.unobserve(entry.target); }
      });
    }, { threshold: 0.12 });
  }
  document.querySelectorAll('.reveal:not(.visible)').forEach(el => revealObserver.observe(el));
}

/* ------------------------------------------------------------
   7) İSTATİSTİK SAYACI
   ------------------------------------------------------------ */
function animateCount(el) {
  const target = +el.dataset.count;
  const dur = 1600, start = performance.now();
  function step(now) {
    const p = Math.min((now - start) / dur, 1);
    const eased = 1 - Math.pow(1 - p, 3);
    let val = Math.floor(eased * target);
    el.textContent = target >= 1000 ? val.toLocaleString('tr-TR') + '+' : val + '+';
    if (p < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}
const statObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) { animateCount(entry.target); statObserver.unobserve(entry.target); }
  });
}, { threshold: 0.5 });

/* ------------------------------------------------------------
   8) NAVIGASYON
   ------------------------------------------------------------ */
const nav = document.getElementById('nav');
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

window.addEventListener('scroll', () => nav.classList.toggle('scrolled', window.scrollY > 60));
navToggle.addEventListener('click', () => { navLinks.classList.toggle('open'); navToggle.classList.toggle('open'); });
navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  navLinks.classList.remove('open'); navToggle.classList.remove('open');
}));

/* ------------------------------------------------------------
   9) REZERVASYON FORMU
   ------------------------------------------------------------ */
const form = document.getElementById('bookingForm');
form.addEventListener('submit', (e) => {
  e.preventDefault();
  if (!form.checkValidity()) { form.reportValidity(); return; }
  const success = document.getElementById('formSuccess');
  success.hidden = false;
  form.reset();
  success.scrollIntoView({ behavior: 'smooth', block: 'center' });
  setTimeout(() => { success.hidden = true; }, 6000);
});

/* ------------------------------------------------------------
   10) BAŞLATMA — içeriği yükle, sonra çiz
   ------------------------------------------------------------ */
async function init() {
  try {
    const res = await fetch('content/site.json', { cache: 'no-store' });
    DATA = await res.json();
  } catch (err) {
    console.error('İçerik yüklenemedi:', err);
    DATA = { hero: {}, about: {}, contact: {}, yachts: [], cabins: [], features: [] };
  }
  applyLanguage(currentLang);
  document.querySelectorAll('.stat__num').forEach(el => statObserver.observe(el));
  observeReveals();
}
document.addEventListener('DOMContentLoaded', init);
