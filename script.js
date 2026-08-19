/* ===================================================
   Zaza Apk - JavaScript
   - بيانات التطبيقات (سهلة الإضافة والتعديل)
   - البحث، الفلترة، نافذة التفاصيل، التمرير
   =================================================== */

/* ====== 1) بيانات التصنيفات ====== */
const categories = [
  { name: 'ألعاب',       icon: '🎮', count: 2450, gradient: 'linear-gradient(135deg,#8b5cf6,#ec4899)' },
  { name: 'تواصل اجتماعي', icon: '💬', count: 320,  gradient: 'linear-gradient(135deg,#06b6d4,#3b82f6)' },
  { name: 'أدوات',       icon: '🛠️', count: 890,  gradient: 'linear-gradient(135deg,#f59e0b,#ef4444)' },
  { name: 'ترفيه',       icon: '🎬', count: 1240, gradient: 'linear-gradient(135deg,#ec4899,#f43f5e)' },
  { name: 'تعليم',       icon: '📚', count: 670,  gradient: 'linear-gradient(135deg,#10b981,#06b6d4)' },
  { name: 'تصوير',       icon: '📷', count: 420,  gradient: 'linear-gradient(135deg,#8b5cf6,#6366f1)' },
  { name: 'موسيقى',      icon: '🎵', count: 380,  gradient: 'linear-gradient(135deg,#f59e0b,#ec4899)' },
  { name: 'رياضة',       icon: '⚽', count: 290,  gradient: 'linear-gradient(135deg,#22c55e,#10b981)' },
];

/* ====== 2) بيانات التطبيقات (نموذجية - استبدلها لاحقاً) ======
   لإضافة تطبيق جديد: انسخ أحد الكائنات وعدّل القيم.
   الحقول المطلوبة: id, name, dev, icon, gradient, category, categoryKey,
                     rating, downloads, size, version, updateDate, description, isNew, isFeatured
   =================================================== */
const apps = [
  {
    id: 1,
    name: 'Mega Chat',
    dev: 'Zaza Studios',
    icon: '💬',
    gradient: 'linear-gradient(135deg,#06b6d4,#3b82f6)',
    category: 'تواصل اجتماعي',
    categoryKey: 'social',
    rating: 4.8,
    downloads: '15M+',
    size: '38 MB',
    version: '3.2.1',
    updateDate: '2026-08-15',
    description: 'تطبيق مراسلة سريع وآمن مع تشفير من الطرف إلى الطرف، مكالمات صوت وفيديو عالية الجودة، ومجموعات تضم آلاف الأعضاء. يدعم مشاركة الملفات بجميع الصيغ.',
    isNew: false,
    isFeatured: true,
    isTrending: true,
  },
  {
    id: 2,
    name: 'Speed Racer X',
    dev: 'GameZone',
    icon: '🏎️',
    gradient: 'linear-gradient(135deg,#8b5cf6,#ec4899)',
    category: 'ألعاب',
    categoryKey: 'games',
    rating: 4.9,
    downloads: '50M+',
    size: '120 MB',
    version: '5.0.4',
    updateDate: '2026-08-18',
    description: 'لعبة سباقات سيارات ثلاثية الأبعاد بجرافيك خارق، أكثر من 80 سيارة مرخصة، مسارات متعددة حول العالم، ووضع لعب جماعي أونلاين حتى 8 لاعبين.',
    isNew: true,
    isFeatured: true,
    isTrending: true,
  },
  {
    id: 3,
    name: 'Photo Studio Pro',
    dev: 'Creative Labs',
    icon: '📷',
    gradient: 'linear-gradient(135deg,#8b5cf6,#6366f1)',
    category: 'تصوير',
    categoryKey: 'tools',
    rating: 4.7,
    downloads: '8M+',
    size: '45 MB',
    version: '2.4.0',
    updateDate: '2026-08-10',
    description: 'محرر صور احترافي مع أكثر من 200 فلتر وتأثير، أدوات قص متقدمة، تصحيح الألوان، وإضافة نصوص وكولاجات. سهل الاستخدام لجميع المستويات.',
    isNew: false,
    isFeatured: true,
    isTrending: false,
  },
  {
    id: 4,
    name: 'Music Flow',
    dev: 'Sound Wave',
    icon: '🎵',
    gradient: 'linear-gradient(135deg,#f59e0b,#ec4899)',
    category: 'موسيقى',
    categoryKey: 'entertainment',
    rating: 4.6,
    downloads: '25M+',
    size: '28 MB',
    version: '4.1.2',
    updateDate: '2026-08-12',
    description: 'مشغل موسيقى بنظام توصية ذكي يتعلم ذوقك، مكتبة ضخمة من الأغاني العربية والعالمية، تشغيل بدون إنترنت للأغاني المحفوظة، وكلمات الأغاني المتزامنة.',
    isNew: false,
    isFeatured: true,
    isTrending: true,
  },
  {
    id: 5,
    name: 'Task Master',
    dev: 'Productive Co',
    icon: '✅',
    gradient: 'linear-gradient(135deg,#22c55e,#10b981)',
    category: 'أدوات',
    categoryKey: 'tools',
    rating: 4.8,
    downloads: '5M+',
    size: '18 MB',
    version: '3.0.7',
    updateDate: '2026-08-14',
    description: 'تطبيق إدارة المهام والوقت مع تذكيرات ذكية، تقويم مرئي، تتبع الإنجازات، ومزامنة سحابية بين جميع أجهزتك. مثالي للطلاب والمحترفين.',
    isNew: true,
    isFeatured: true,
    isTrending: false,
  },
  {
    id: 6,
    name: 'Learn Code',
    dev: 'EduTech',
    icon: '💻',
    gradient: 'linear-gradient(135deg,#10b981,#06b6d4)',
    category: 'تعليم',
    categoryKey: 'education',
    rating: 4.9,
    downloads: '3M+',
    size: '52 MB',
    version: '2.2.5',
    updateDate: '2026-08-16',
    description: 'منصة تعلم البرمجة بالعربية، دورات تفاعلية في Python و JavaScript و Java، تحديات يومية، شهادات إتمام، ومجتمع مطورين نشط لمساعدتك في رحلتك.',
    isNew: true,
    isFeatured: true,
    isTrending: true,
  },
  {
    id: 7,
    name: 'Sky VPN',
    dev: 'Secure Net',
    icon: '🛡️',
    gradient: 'linear-gradient(135deg,#6366f1,#8b5cf6)',
    category: 'أدوات',
    categoryKey: 'tools',
    rating: 4.5,
    downloads: '40M+',
    size: '22 MB',
    version: '1.9.8',
    updateDate: '2026-08-09',
    description: 'شبكة افتراضية خاصة سريعة وآمنة، خوادم في أكثر من 50 دولة، تشفير عسكري، سياسة عدم تسجيل، وسرعات فائقة للبث والتحميل دون انقطاع.',
    isNew: false,
    isFeatured: true,
    isTrending: false,
  },
  {
    id: 8,
    name: 'Movie Hub',
    dev: 'Stream Plus',
    icon: '🎬',
    gradient: 'linear-gradient(135deg,#ec4899,#f43f5e)',
    category: 'ترفيه',
    categoryKey: 'entertainment',
    rating: 4.7,
    downloads: '20M+',
    size: '65 MB',
    version: '6.3.1',
    updateDate: '2026-08-17',
    description: 'منصة أفلام ومسلسلات بمكتبة ضخمة، ترجمة عربية احترافية، جودة حتى 4K، تحميل للمشاهدة بدون إنترنت، وقوائم مخصصة حسب ذوقك.',
    isNew: false,
    isFeatured: true,
    isTrending: true,
  },
  {
    id: 9,
    name: 'Sport Live',
    dev: 'Goal Network',
    icon: '⚽',
    gradient: 'linear-gradient(135deg,#22c55e,#06b6d4)',
    category: 'رياضة',
    categoryKey: 'entertainment',
    rating: 4.6,
    downloads: '12M+',
    size: '32 MB',
    version: '3.5.0',
    updateDate: '2026-08-11',
    description: 'بث مباشر للمباريات العالمية، نتائج فورية، إحصائيات مفصلة، فيديوهات الأهداف، وتحليلات خبراء. تابع فريقك المفضل أينما كنت.',
    isNew: false,
    isFeatured: false,
    isTrending: true,
  },
  {
    id: 10,
    name: 'Puzzle Quest',
    dev: 'Mind Games',
    icon: '🧩',
    gradient: 'linear-gradient(135deg,#f59e0b,#8b5cf6)',
    category: 'ألعاب',
    categoryKey: 'games',
    rating: 4.8,
    downloads: '30M+',
    size: '75 MB',
    version: '2.8.3',
    updateDate: '2026-08-13',
    description: 'مجموعة ألغاز ذكية تنشّط العقل، أكثر من 500 مستوى متدرج الصعوبة، تحديات يومية، نظام نقاط ومكافآت، ومسابقات بين الأصدقاء.',
    isNew: false,
    isFeatured: true,
    isTrending: false,
  },
  {
    id: 11,
    name: 'Health Tracker',
    dev: 'Fit Life',
    icon: '🏃',
    gradient: 'linear-gradient(135deg,#ef4444,#f59e0b)',
    category: 'أدوات',
    categoryKey: 'tools',
    rating: 4.7,
    downloads: '18M+',
    size: '40 MB',
    version: '4.0.2',
    updateDate: '2026-08-08',
    description: 'تتبع نشاطك البدني وخطواتك وسعراتك الحرارية، خطط تمارين مخصصة، تذكيرات شرب الماء، تحليل النوم، وربط بالساعات الذكية.',
    isNew: true,
    isFeatured: false,
    isTrending: false,
  },
  {
    id: 12,
    name: 'Chat World',
    dev: 'Social Plus',
    icon: '👥',
    gradient: 'linear-gradient(135deg,#3b82f6,#06b6d4)',
    category: 'تواصل اجتماعي',
    categoryKey: 'social',
    rating: 4.5,
    downloads: '60M+',
    size: '55 MB',
    version: '7.1.0',
    updateDate: '2026-08-06',
    description: 'شبكة اجتماعية عالمية، شارك لحظاتك بالصور والفيديو، تواصل مع أصدقاء جدد حول العالم، اكتشف المحتوى الذي يحبه كل منهم.',
    isNew: false,
    isFeatured: false,
    isTrending: true,
  },
];

/* ====== 3) عناصر DOM ====== */
const categoriesGrid = document.getElementById('categoriesGrid');
const appsGrid = document.getElementById('appsGrid');
const trendingList = document.getElementById('trendingList');
const newAppsGrid = document.getElementById('newAppsGrid');
const emptyState = document.getElementById('emptyState');
const filterChips = document.getElementById('filterChips');
const searchInput = document.getElementById('searchInput');
const modalOverlay = document.getElementById('modalOverlay');
const modalBody = document.getElementById('modalBody');
const modalClose = document.getElementById('modalClose');
const backToTop = document.getElementById('backToTop');
const header = document.getElementById('header');
const menuToggle = document.getElementById('menuToggle');
const nav = document.getElementById('nav');

/* ====== 4) حالة التطبيق ====== */
let currentFilter = 'all';
let currentSearch = '';

/* ====== 5) عرض التصنيفات ====== */
function renderCategories() {
  categoriesGrid.innerHTML = categories.map(cat => `
    <div class="category-card fade-in" data-cat="${cat.name}">
      <div class="category-icon" style="background:${cat.gradient}">${cat.icon}</div>
      <div class="category-name">${cat.name}</div>
      <div class="category-count">${cat.count.toLocaleString('ar-EG')} تطبيق</div>
    </div>
  `).join('');

  // عند الضغط على تصنيف - فلترة التطبيقات
  categoriesGrid.querySelectorAll('.category-card').forEach(card => {
    card.addEventListener('click', () => {
      const cat = card.dataset.cat;
      // تنقل للقسم المميز
      document.getElementById('featured').scrollIntoView({ behavior: 'smooth' });
      // إزالة الفلاتر النشطة وإظهار الكل
      currentSearch = '';
      searchInput.value = '';
      // إذا كان التصنيف من المفاتيح المعروفة
      const map = { 'ألعاب':'games','تواصل اجتماعي':'social','أدوات':'tools','ترفيه':'entertainment','تعليم':'education' };
      const key = map[cat] || 'all';
      setFilter(key);
    });
  });
}

/* ====== 6) بطاقة تطبيق ====== */
function appCard(app) {
  const badge = app.isNew
    ? '<span class="app-badge">جديد</span>'
    : app.isTrending
      ? '<span class="app-badge" style="background:linear-gradient(135deg,#f59e0b,#ec4899)">رائج</span>'
      : '';
  return `
    <div class="app-card fade-in" data-id="${app.id}">
      ${badge}
      <div class="app-icon" style="background:${app.gradient}">${app.icon}</div>
      <div class="app-name">${app.name}</div>
      <div class="app-dev">${app.dev}</div>
      <div class="app-meta">
        <span class="app-rating"><span class="star">★</span> ${app.rating}</span>
        <span class="app-size">${app.size}</span>
      </div>
      <button class="app-download-btn" data-id="${app.id}">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/>
        </svg>
        تحميل
      </button>
    </div>
  `;
}

/* ====== 7) عرض التطبيقات المميزة مع الفلترة ====== */
function renderApps() {
  let filtered = apps;

  // فلتر التصنيف
  if (currentFilter !== 'all') {
    filtered = filtered.filter(a => a.categoryKey === currentFilter);
  }
  // فلتر البحث
  if (currentSearch) {
    const q = currentSearch.toLowerCase();
    filtered = filtered.filter(a =>
      a.name.toLowerCase().includes(q) ||
      a.dev.toLowerCase().includes(q) ||
      a.category.toLowerCase().includes(q)
    );
  }

  if (filtered.length === 0) {
    appsGrid.innerHTML = '';
    emptyState.style.display = 'block';
  } else {
    emptyState.style.display = 'none';
    appsGrid.innerHTML = filtered.map(appCard).join('');
  }

  // ربط الأحداث
  appsGrid.querySelectorAll('.app-card').forEach(card => {
    card.addEventListener('click', () => openModal(+card.dataset.id));
  });

  observeFadeIn();
}

/* ====== 8) عرض الرائج ====== */
function renderTrending() {
  const trending = apps.filter(a => a.isTrending).slice(0, 6);
  trendingList.innerHTML = trending.map((app, i) => `
    <div class="trending-item fade-in" data-id="${app.id}">
      <div class="trending-rank">${(i+1).toLocaleString('ar-EG')}</div>
      <div class="trending-icon" style="background:${app.gradient}">${app.icon}</div>
      <div class="trending-info">
        <h4>${app.name}</h4>
        <p>${app.dev}</p>
      </div>
      <div class="trending-cat">${app.category}</div>
      <div class="trending-downloads">
        <strong>${app.downloads}</strong>
        تحميل
      </div>
      <button class="app-download-btn" data-id="${app.id}" style="width:auto;padding:8px 16px">
        تحميل
      </button>
    </div>
  `).join('');

  trendingList.querySelectorAll('.trending-item').forEach(item => {
    item.addEventListener('click', (e) => {
      if (e.target.closest('.app-download-btn')) {
        e.stopPropagation();
        openModal(+item.dataset.id);
        return;
      }
      openModal(+item.dataset.id);
    });
  });

  observeFadeIn();
}

/* ====== 9) عرض الجديد ====== */
function renderNew() {
  const newApps = apps.filter(a => a.isNew);
  newAppsGrid.innerHTML = newApps.map(appCard).join('');
  newAppsGrid.querySelectorAll('.app-card').forEach(card => {
    card.addEventListener('click', () => openModal(+card.dataset.id));
  });
  observeFadeIn();
}

/* ====== 10) نافذة تفاصيل التطبيق ====== */
function openModal(id) {
  const app = apps.find(a => a.id === id);
  if (!app) return;

  modalBody.innerHTML = `
    <div class="modal-header">
      <div class="modal-icon" style="background:${app.gradient}">${app.icon}</div>
      <div class="modal-title">
        <h2>${app.name}</h2>
        <p>${app.dev}</p>
        <div class="modal-tags">
          <span class="modal-tag">${app.category}</span>
          <span class="modal-tag">★ ${app.rating}</span>
          <span class="modal-tag">${app.size}</span>
        </div>
      </div>
    </div>

    <div class="modal-stats">
      <div class="modal-stat">
        <div class="modal-stat-num">${app.downloads}</div>
        <div class="modal-stat-label">تحميل</div>
      </div>
      <div class="modal-stat">
        <div class="modal-stat-num">${app.rating} ★</div>
        <div class="modal-stat-label">التقييم</div>
      </div>
      <div class="modal-stat">
        <div class="modal-stat-num">${app.size}</div>
        <div class="modal-stat-label">الحجم</div>
      </div>
      <div class="modal-stat">
        <div class="modal-stat-num">${app.version}</div>
        <div class="modal-stat-label">الإصدار</div>
      </div>
    </div>

    <div class="modal-section">
      <h3>📝 وصف التطبيق</h3>
      <p>${app.description}</p>
    </div>

    <div class="modal-section">
      <h3>ℹ️ معلومات إضافية</h3>
      <div class="modal-info-row"><span>المطوّر</span><span>${app.dev}</span></div>
      <div class="modal-info-row"><span>التصنيف</span><span>${app.category}</span></div>
      <div class="modal-info-row"><span>الحجم</span><span>${app.size}</span></div>
      <div class="modal-info-row"><span>الإصدار الحالي</span><span>${app.version}</span></div>
      <div class="modal-info-row"><span>آخر تحديث</span><span>${app.updateDate}</span></div>
      <div class="modal-info-row"><span>عدد التحميلات</span><span>${app.downloads}</span></div>
    </div>

    <div class="modal-actions">
      <button class="btn btn-primary" id="modalDownload">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/>
        </svg>
        تحميل التطبيق
      </button>
      <button class="btn btn-ghost" id="modalShare">مشاركة</button>
    </div>
  `;

  modalOverlay.classList.add('active');
  document.body.style.overflow = 'hidden';

  // ربط أزرار المودال
  const dlBtn = document.getElementById('modalDownload');
  dlBtn.addEventListener('click', () => {
    // هنا ستضع رابط التحميل الفعلي لاحقاً
    alert(`سيتم تجهيز رابط تحميل ${app.name} قريباً...\nأضف رابط التحميل في دالة openModal داخل script.js`);
  });
  document.getElementById('modalShare').addEventListener('click', () => {
    if (navigator.share) {
      navigator.share({ title: app.name, text: `حمّل ${app.name} من Zaza Apk` })
        .catch(() => {});
    } else {
      alert('انسخ الرابط: ' + window.location.href);
    }
  });
}

function closeModal() {
  modalOverlay.classList.remove('active');
  document.body.style.overflow = '';
}

modalClose.addEventListener('click', closeModal);
modalOverlay.addEventListener('click', (e) => {
  if (e.target === modalOverlay) closeModal();
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeModal();
});

/* ====== 11) الفلاتر ====== */
function setFilter(key) {
  currentFilter = key;
  filterChips.querySelectorAll('.chip').forEach(c => {
    c.classList.toggle('active', c.dataset.filter === key);
  });
  renderApps();
}

filterChips.querySelectorAll('.chip').forEach(chip => {
  chip.addEventListener('click', () => setFilter(chip.dataset.filter));
});

/* ====== 12) البحث ====== */
let searchTimeout;
searchInput.addEventListener('input', (e) => {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    currentSearch = e.target.value.trim();
    // التمرير لقسم التطبيقات عند البحث
    if (currentSearch) {
      document.getElementById('featured').scrollIntoView({ behavior: 'smooth' });
    }
    renderApps();
  }, 250);
});

/* ====== 13) Header scroll ====== */
window.addEventListener('scroll', () => {
  const y = window.scrollY;
  header.classList.toggle('scrolled', y > 30);
  backToTop.classList.toggle('show', y > 500);
});

backToTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ====== 14) قائمة الجوال ====== */
menuToggle.addEventListener('click', () => {
  menuToggle.classList.toggle('active');
  nav.classList.toggle('active');
});
nav.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    menuToggle.classList.remove('active');
    nav.classList.remove('active');
  });
});

/* ====== 15) تأثير الظهور التدريجي ====== */
let observer;
function observeFadeIn() {
  if (!observer) {
    observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
  }
  document.querySelectorAll('.fade-in:not(.visible)').forEach(el => observer.observe(el));
}

/* ====== 16) تفعيل رابط التنقل حسب التمرير ====== */
const navLinks = document.querySelectorAll('.nav-link');
const sections = ['home', 'categories', 'trending', 'new', 'about'];
window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(id => {
    const sec = document.getElementById(id);
    if (sec && sec.offsetTop <= window.scrollY + 120) current = id;
  });
  navLinks.forEach(link => {
    link.classList.toggle('active', link.getAttribute('href') === '#' + current);
  });
});

/* ====== 17) تشغيل ====== */
renderCategories();
renderApps();
renderTrending();
renderNew();
observeFadeIn();
