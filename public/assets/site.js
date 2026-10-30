/**
 * Shared Site JavaScript for Tarun's Portfolio & Blog
 * Unified functionality:
 * - Data Store for Projects & Blog Posts (localStorage persistence)
 * - Admin Authentication & Authorization (Passcode: xyz)
 * - Dynamic Rendering for Home, Projects, Blog, Post, and Admin Dashboard
 * - Non-blocking In-Page Confirmation Modals (NO window.confirm/window.alert)
 * - Toast Notifications
 * - Dark Mode, Mobile Menu, Active Nav, Formspree Handler, Copy Email, Live Clock
 * - Interactive Search and Filter for Projects and Field Notes
 */

// ==========================================
// 1. DEFAULT SEED DATA
// ==========================================
const DEFAULT_PROJECTS = [
  {
    id: 'polyglot-lens',
    title: 'PolyglotLens AI',
    status: 'Complete',
    category: 'ai / ml language tech',
    kanjiBadge: '「視覚識別」',
    typeBadge: 'OCR + Vision',
    description: 'Lightweight OCR and dictionary lookup tool tailored for Japanese kanji acquisition. Extracts characters from raw camera clips and matches stroke order animations.',
    tags: ['Python', 'OpenCV', 'OCR', 'PyTorch'],
    githubUrl: 'https://github.com/TODO-tarun/polyglot-lens',
    devlogSlug: 'building-polyglotlens',
    exampleMockup: {
      tag: 'CAM-INPUT: GLYPH_FRAME',
      kanji: '道',
      breakdown: ['1. 辶 (road/walk)', '2. 首 (head)', 'Meaning: way, path']
    }
  },
  {
    id: 'hanziflow',
    title: 'HanziFlow',
    status: 'Complete',
    category: 'language tech web & tools',
    kanjiBadge: '「漢字分解」',
    typeBadge: 'SRS Engine',
    description: 'Interactive mnemonic flashcard engine decomposing characters into semantic radicals with automated spaced repetition.',
    tags: ['TypeScript', 'React', 'SQLite', 'Tailwind'],
    githubUrl: 'https://github.com/TODO-tarun/hanziflow',
    devlogSlug: 'architecting-hanziflow',
    exampleMockup: {
      tag: 'RADICAL PARSER',
      kanji: '休',
      breakdown: ['休 (xiū - rest)', '亻 (person) + 木 (tree)']
    }
  },
  {
    id: 'neuralnotes',
    title: 'NeuralNotes',
    status: 'In Progress',
    category: 'ai / ml web & tools',
    kanjiBadge: '「神経要約」',
    typeBadge: 'Local SLM',
    description: 'Privacy-first study journal synthesizing lecture recordings into structured markdown summaries and flashcards using quantized on-device SLMs.',
    tags: ['WebGPU', 'ONNX Runtime', 'Whisper', 'IndexedDB'],
    githubUrl: 'https://github.com/TODO-tarun/neural-notes',
    devlogSlug: 'demystifying-small-language-models',
    exampleMockup: {
      tag: 'ONNX RUNTIME: LOCAL',
      kanji: '学',
      breakdown: ['Model: Qwen2.5-1.5B 4-bit', 'Context: 4,096 tokens', 'Target: Zero cloud telemetry']
    }
  }
];

const DEFAULT_POSTS = [
  {
    slug: 'japanese-journey-day-1',
    title: 'The 365-Day Japanese Journey: Day 1 Kickoff',
    date: 'Feb 28, 2026',
    category: 'What I\'m Learning',
    readingTime: '5 min read',
    summary: 'Setting up the daily 90-minute routine, phonetic kana muscle memory, and configuring Anki decks powered by stroke-order mnemonics.',
    badge: 'Target: JLPT N2 | Mastering Hiragana + Katakana muscle memory',
    content: `
      <p class="lead text-lg text-slate-700 dark:text-slate-200 font-medium mb-6">
        Every language journey begins with muscle memory. Today marks Day 1 of my commitment to study Japanese and track every breakthrough, roadblock, and lesson learned over the next 365 days.
      </p>
      <h2 class="text-2xl font-bold text-slate-900 dark:text-white mt-8 mb-4">Why Document Daily?</h2>
      <p class="mb-4 text-slate-600 dark:text-slate-300 leading-relaxed">
        Language acquisition easily falls victim to the "collector's fallacy"—downloading dozens of textbooks, bookmarking YouTube channels, and hoarding spaced repetition decks without putting in focused, deliberate output. By writing public notes, I keep myself accountable to the process rather than vague intentions.
      </p>
      <div class="my-6 p-5 rounded-2xl bg-sky-50 dark:bg-sky-950/40 border border-sky-100 dark:border-sky-800">
        <div class="text-xs font-mono font-bold uppercase tracking-wider text-sky-700 dark:text-sky-300 mb-2">Daily Learning Architecture</div>
        <ul class="space-y-2 text-sm text-slate-700 dark:text-slate-300">
          <li><strong>06:30 - 07:15 AM:</strong> Anki review cycle (recognition + stroke recall).</li>
          <li><strong>07:15 - 08:00 AM:</strong> Shadowing drill (pitch accent and pronunciation pacing).</li>
          <li><strong>Evening:</strong> Reading 2 real Japanese sentence contexts from NHK Easy News.</li>
        </ul>
      </div>
      <h2 class="text-2xl font-bold text-slate-900 dark:text-white mt-8 mb-4">Milestone Roadmap</h2>
      <p class="mb-4 text-slate-600 dark:text-slate-300 leading-relaxed">
        My immediate goal is solidifying all 46 basic Hiragana and 46 Katakana with zero hesitation, followed by daily kanji radicals through KanjiDamage and RTK mnemonics. Aiming for JLPT N2 level comprehension.
      </p>
    `
  },
  {
    slug: 'lora-rank-tradeoffs',
    title: 'Daily TIL: LoRA Rank Trade-offs & FlashAttention Intuitions',
    date: 'Feb 22, 2026',
    category: 'Daily TIL',
    readingTime: '4 min read',
    summary: 'Why scaling rank r from 8 to 64 yields diminishing returns on stylistic alignment, but dramatic spikes in memory overhead.',
    badge: 'r = 16, alpha = 32: sweet spot for attention query-key projection matrices',
    content: `
      <p class="lead text-lg text-slate-700 dark:text-slate-200 font-medium mb-6">
        When fine-tuning small language models (SLMs) with Low-Rank Adaptation (LoRA), conventional intuition might tempt you to set rank <em>r</em> as high as your VRAM permits. Today I ran ablation passes on Qwen-2.5 and Llama-3.2 to see where rank scaling actually matters.
      </p>
      <h2 class="text-2xl font-bold text-slate-900 dark:text-white mt-8 mb-4">The Rank Equation: W + ΔW where ΔW = B × A</h2>
      <p class="mb-4 text-slate-600 dark:text-slate-300 leading-relaxed">
        In standard LoRA, the base model weight matrix remains frozen. Instead, we learn low-rank matrices <em>A</em> and <em>B</em>. Because rank <em>r</em> is small, we train only a fraction of parameters.
      </p>
      <div class="my-6 p-4 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 text-sm">
        <strong>Takeaway:</strong> Setting rank <em>r = 16</em> and targeting both attention (q, k, v, o) and MLP (gate, up, down) projection matrices offers far higher task accuracy than pushing <em>r = 64</em> on attention alone.
      </div>
    `
  },
  {
    slug: 'chinese-tones-contour',
    title: 'Chinese Tones Contour Intuition: Singing Pitch Analogy',
    date: 'Feb 19, 2026',
    category: 'What I\'m Learning',
    readingTime: '3 min read',
    summary: 'Treating the four tones as musical vocal warm-up intervals: First (high steady soprano), Second (questioning rise), Third (low dip), Fourth (sharp command).',
    badge: '1: 55 | 2: 35 | 3: 214 | 4: 51',
    content: `
      <p class="lead text-lg text-slate-700 dark:text-slate-200 font-medium mb-6">
        For non-tonal language speakers, the initial barrier in Mandarin Chinese isn't the grammar—Mandarin grammar is remarkably clean and modular. The true hurdle is pitch-contour phonology.
      </p>
      <h2 class="text-2xl font-bold text-slate-900 dark:text-white mt-8 mb-4">The 4-Tone Pitch Map</h2>
      <ul class="space-y-3 text-slate-600 dark:text-slate-300 text-sm my-4">
        <li><strong>First Tone (55):</strong> High, level, flat soprano note. Maintain constant pitch without vibrato.</li>
        <li><strong>Second Tone (35):</strong> Rising inflection, like asking "What?" with genuine surprise.</li>
        <li><strong>Third Tone (214):</strong> Low, rumbling chest resonance that dips deep before a subtle rise.</li>
        <li><strong>Fourth Tone (51):</strong> Crisp downward drop, identical to a definitive "No!".</li>
      </ul>
    `
  },
  {
    slug: 'demystifying-small-language-models',
    title: 'Demystifying Small Language Models: What Actually Happens During Fine-Tuning',
    date: 'Feb 04, 2026',
    category: 'AI & Engineering',
    readingTime: '7 min read',
    summary: 'Peeling back the math of rank-decomposition matrices, low-rank adaptations, gradient flow across frozen weights, and testing local inferences with 1B-3B models.',
    badge: 'Student Deep-Dive | 1B-3B Parameter Regimes',
    content: `
      <p class="lead text-lg text-slate-700 dark:text-slate-200 font-medium mb-6">
        With the rise of capable 1B to 3B models, machine learning engineering is shifting toward domain-specific edge intelligence. In this walkthrough, I unpack what happens under the hood during fine-tuning on consumer hardware.
      </p>
      <h2 class="text-2xl font-bold text-slate-900 dark:text-white mt-8 mb-4">Gradient Propagation Through Frozen Layers</h2>
      <p class="mb-4 text-slate-600 dark:text-slate-300 leading-relaxed">
        The magic of parameter-efficient fine-tuning (PEFT) is that we don't calculate or store optimizer states for billions of base weights. The forward pass flows through the frozen weights, but backpropagation stops short, calculating gradients only for the adapter matrices.
      </p>
    `
  },
  {
    slug: 'starting-from-zero',
    title: 'Starting from Zero: Why I\'m Learning Japanese and Mandarin Simultaneously',
    date: 'Jan 18, 2026',
    category: 'What I\'m Learning',
    readingTime: '5 min read',
    summary: 'Exploring the cognitive synthesis of dual-orthography immersion, shared kanji/hanzi semantic anchors, and engineering a bidirectional spaced repetition engine for dual language fluency from day one.',
    badge: 'Featured Essay | Dual Orthography',
    content: `
      <p class="lead text-lg text-slate-700 dark:text-slate-200 font-medium mb-6">
        Conventional wisdom advises against studying two foreign languages at once, especially two East Asian languages with shared writing systems. But what if the overlap isn't a source of confusion, but a cognitive multiplier?
      </p>
      <h2 class="text-2xl font-bold text-slate-900 dark:text-white mt-8 mb-4">The Semantic Anchor: Kanji & Hanzi</h2>
      <p class="mb-4 text-slate-600 dark:text-slate-300 leading-relaxed">
        While spoken Japanese and Mandarin belong to completely distinct language families, their written logographs share common roots. Characters like 日 (sun/day), 月 (moon/month), and 水 (water) convey the exact same semantic intuition in both languages.
      </p>
    `
  },
  {
    slug: 'building-polyglotlens',
    title: 'Building PolyglotLens: From Pixels to Kanji Radicals',
    date: 'Jan 05, 2026',
    category: 'Project Devlog',
    readingTime: '6 min read',
    summary: 'Prototyping an on-device OCR pipeline for camera glyph recognition. Binarization thresholds, stroke component bounding boxes, and phonetic lookup caching.',
    badge: 'Devlog 01 | Computer Vision & Kanji',
    content: `
      <p class="lead text-lg text-slate-700 dark:text-slate-200 font-medium mb-6">
        When reading physical Japanese manga, signage, or restaurant menus, stopping to look up an unknown kanji by radical stroke count can take 45 seconds per character. PolyglotLens was born from the desire to point a phone camera at an isolated character and instantly see its stroke breakdown.
      </p>
      <h2 class="text-2xl font-bold text-slate-900 dark:text-white mt-8 mb-4">Binarization & Adaptive Thresholding</h2>
      <p class="mb-4 text-slate-600 dark:text-slate-300 leading-relaxed">
        Real-world camera inputs suffer from inconsistent shadows, glare, and colored paper textures. Using Otsu thresholding coupled with bilateral filtering allowed us to isolate dark ink strokes cleanly before feeding bounding boxes into our lightweight classifier.
      </p>
    `
  }
];

// ==========================================
// 2. CUSTOM NON-BLOCKING UI MODALS & TOASTS
// (Never uses window.confirm or window.alert)
// ==========================================
function showConfirmModal({ title, message, confirmText = 'Delete', confirmClass = 'bg-rose-600 hover:bg-rose-700', onConfirm }) {
  let modal = document.getElementById('site-custom-confirm-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'site-custom-confirm-modal';
    modal.className = 'fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs transition-opacity duration-200';
    document.body.appendChild(modal);
  }

  modal.innerHTML = `
    <div class="relative w-full max-w-sm p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-2xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 flex items-center justify-center text-lg font-bold">
          ⚠️
        </div>
        <div>
          <h3 class="text-base font-bold text-slate-900 dark:text-white">${title || 'Confirm Action'}</h3>
          <p class="text-[11px] text-slate-500 dark:text-slate-400">Please confirm your decision below.</p>
        </div>
      </div>

      <p class="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
        ${message || 'Are you sure you want to proceed?'}
      </p>

      <div class="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100 dark:border-slate-800">
        <button type="button" id="confirm-modal-cancel" class="px-4 py-2 rounded-full border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
          Cancel
        </button>
        <button type="button" id="confirm-modal-action" class="px-4 py-2 rounded-full ${confirmClass} text-white text-xs font-bold shadow-xs transition-colors">
          ${confirmText}
        </button>
      </div>
    </div>
  `;

  modal.classList.remove('hidden');

  const close = () => {
    modal.classList.add('hidden');
  };

  const cancelBtn = modal.querySelector('#confirm-modal-cancel');
  if (cancelBtn) cancelBtn.onclick = close;

  modal.onclick = (e) => {
    if (e.target === modal) close();
  };

  const actionBtn = modal.querySelector('#confirm-modal-action');
  if (actionBtn) {
    actionBtn.onclick = () => {
      close();
      if (typeof onConfirm === 'function') {
        onConfirm();
      }
    };
  }
}

function showToast(message, type = 'success') {
  let toast = document.getElementById('site-custom-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'site-custom-toast';
    document.body.appendChild(toast);
  }

  if (type === 'success') {
    toast.className = 'fixed bottom-6 left-1/2 -translate-x-1/2 z-[110] px-5 py-2.5 rounded-full shadow-2xl text-xs font-bold flex items-center gap-2 bg-slate-900 text-white dark:bg-white dark:text-slate-900 border border-slate-700 dark:border-slate-300 transition-all duration-300 transform translate-y-0 opacity-100 pointer-events-auto';
    toast.innerHTML = `<span class="text-emerald-400 dark:text-emerald-600 font-bold">✓</span><span>${message}</span>`;
  } else {
    toast.className = 'fixed bottom-6 left-1/2 -translate-x-1/2 z-[110] px-5 py-2.5 rounded-full shadow-2xl text-xs font-bold flex items-center gap-2 bg-rose-600 text-white transition-all duration-300 transform translate-y-0 opacity-100 pointer-events-auto';
    toast.innerHTML = `<span>⚠️</span><span>${message}</span>`;
  }

  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => {
    toast.className = 'fixed bottom-6 left-1/2 -translate-x-1/2 z-[110] px-5 py-2.5 rounded-full shadow-2xl text-xs font-bold flex items-center gap-2 transition-all duration-300 transform translate-y-12 opacity-0 pointer-events-none';
  }, 2800);
}

// ==========================================
// 3. DATA STORE SERVICES (LOCAL STORAGE)
// ==========================================
function getStoredProjects() {
  try {
    const raw = localStorage.getItem('tarun_projects');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (e) {
    console.warn('Error reading projects from storage:', e);
  }
  saveStoredProjects(DEFAULT_PROJECTS);
  return DEFAULT_PROJECTS;
}

function saveStoredProjects(projects) {
  try {
    localStorage.setItem('tarun_projects', JSON.stringify(projects));
  } catch (e) {
    console.error('Error saving projects:', e);
  }
}

function addProject(project) {
  return performAddProject(project);
}

function performAddProject(project) {
  const projects = getStoredProjects();
  if (!project.id) {
    project.id = (project.title || 'project').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || ('proj-' + Date.now());
  }
  projects.unshift(project);
  saveStoredProjects(projects);
  try { window.dispatchEvent(new Event('storage')); } catch (e) {}
  showToast(`"${project.title}" added to projects ✓`);
  return project;
}

function deleteProject(id) {
  return performDeleteProject(id);
}

function performDeleteProject(id) {
  if (!id) return [];
  const target = String(id).trim().toLowerCase();
  let projects = getStoredProjects();
  let deletedItemTitle = '';
  projects = projects.filter(p => {
    const pId = String(p.id || '').trim().toLowerCase();
    const pTitle = String(p.title || p.name || '').trim().toLowerCase();
    const isMatch = pId === target || pTitle === target;
    if (isMatch) deletedItemTitle = p.title || p.name;
    return !isMatch;
  });
  saveStoredProjects(projects);
  try { window.dispatchEvent(new Event('storage')); } catch (e) {}
  showToast(deletedItemTitle ? `"${deletedItemTitle}" removed ✓` : 'Project removed ✓');
  return projects;
}

function getStoredPosts() {
  try {
    const raw = localStorage.getItem('tarun_blog_posts');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (e) {
    console.warn('Error reading posts from storage:', e);
  }
  saveStoredPosts(DEFAULT_POSTS);
  return DEFAULT_POSTS;
}

function saveStoredPosts(posts) {
  try {
    localStorage.setItem('tarun_blog_posts', JSON.stringify(posts));
  } catch (e) {
    console.error('Error saving blog posts:', e);
  }
}

function addPost(post) {
  return performAddPost(post);
}

function performAddPost(post) {
  const posts = getStoredPosts();
  if (!post.slug) {
    post.slug = (post.title || 'post').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || ('post-' + Date.now());
  }
  posts.unshift(post);
  saveStoredPosts(posts);
  try { window.dispatchEvent(new Event('storage')); } catch (e) {}
  showToast(`"${post.title}" published ✓`);
  return post;
}

function deletePost(slug) {
  return performDeletePost(slug);
}

function performDeletePost(slug) {
  if (!slug) return [];
  const target = String(slug).trim().toLowerCase();
  let posts = getStoredPosts();
  let deletedItemTitle = '';
  posts = posts.filter(p => {
    const pSlug = String(p.slug || '').trim().toLowerCase();
    const pTitle = String(p.title || '').trim().toLowerCase();
    const isMatch = pSlug === target || pTitle === target;
    if (isMatch) deletedItemTitle = p.title;
    return !isMatch;
  });
  saveStoredPosts(posts);
  try { window.dispatchEvent(new Event('storage')); } catch (e) {}
  showToast(deletedItemTitle ? `"${deletedItemTitle}" removed ✓` : 'Field note removed ✓');
  return posts;
}

function resetDefaultData() {
  saveStoredProjects(DEFAULT_PROJECTS);
  saveStoredPosts(DEFAULT_POSTS);
  try { window.dispatchEvent(new Event('storage')); } catch (e) {}
  showToast('Restored all default projects and field notes ✓');
}

// ==========================================
// 4. ADMIN AUTHENTICATION
// ==========================================
const ADMIN_PASSCODE = 'tarun2026';

function isAdminLoggedIn() {
  try {
    return localStorage.getItem('tarun_admin_active') === 'true';
  } catch (e) {
    return false;
  }
}

function loginAdmin(passcode) {
  if (passcode && passcode.trim() === ADMIN_PASSCODE) {
    try {
      localStorage.setItem('tarun_admin_active', 'true');
    } catch (e) {}
    showToast('Admin Mode unlocked! You can now add and delete items.');
    return true;
  }
  return false;
}

function logoutAdmin() {
  try {
    localStorage.removeItem('tarun_admin_active');
  } catch (e) {}
  showToast('Exited Admin Mode');
}

function setupAdminHeaderTrigger() {
  const adminBtns = document.querySelectorAll('.admin-trigger-btn');
  adminBtns.forEach(btn => {
    if (isAdminLoggedIn()) {
      btn.classList.add('ring-2', 'ring-primary', 'bg-primary/10', 'text-primary');
      btn.setAttribute('title', 'Admin Mode Active - Click for Dashboard');
    }

    btn.addEventListener('click', (e) => {
      e.preventDefault();
      if (isAdminLoggedIn()) {
        window.location.href = 'admin.html';
      } else {
        openAdminLoginModal();
      }
    });
  });
}

function openAdminLoginModal() {
  let modal = document.getElementById('admin-login-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'admin-login-modal';
    modal.className = 'fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs';
    modal.innerHTML = `
      <div class="relative w-full max-w-sm p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <span class="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">🔒</span>
            <h3 class="text-base font-bold text-slate-900 dark:text-white">Admin Authentication</h3>
          </div>
          <button type="button" id="close-admin-login" class="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-lg">✕</button>
        </div>
        <p class="text-xs text-slate-600 dark:text-slate-300">
          Enter your admin passcode to add or delete projects and field notes.
        </p>
        <form id="admin-login-form" class="space-y-3">
          <div>
            <label for="admin-passcode-input" class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Passcode</label>
            <input type="password" id="admin-passcode-input" required placeholder="Default: xyz" class="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:border-primary focus:ring-2 focus:ring-primary/20" />
            <span id="admin-login-error" class="text-[11px] text-rose-500 mt-1 block hidden">Incorrect passcode. Default is: tarun2026</span>
          </div>
          <div class="flex items-center justify-between pt-2">
            <span class="text-[10px] text-slate-400 font-mono">Default: xyz</span>
            <button type="submit" class="px-5 py-2 rounded-full bg-[#dc3c19] hover:bg-[#b52603] text-white text-xs font-semibold shadow-xs">
              Unlock Admin
            </button>
          </div>
        </form>
      </div>
    `;
    document.body.appendChild(modal);

    document.getElementById('close-admin-login').addEventListener('click', () => {
      modal.classList.add('hidden');
    });

    document.getElementById('admin-login-form').addEventListener('submit', (ev) => {
      ev.preventDefault();
      const code = document.getElementById('admin-passcode-input').value;
      if (loginAdmin(code)) {
        window.location.href = 'admin.html';
      } else {
        document.getElementById('admin-login-error').classList.remove('hidden');
      }
    });
  }

  modal.classList.remove('hidden');
  const input = modal.querySelector('input');
  if (input) input.focus();
}

function renderAdminFloatingBanner() {
  if (!isAdminLoggedIn()) return;
  if (window.location.pathname.includes('admin.html')) return;

  let banner = document.getElementById('admin-floating-status-banner');
  if (!banner) {
    banner = document.createElement('aside');
    banner.id = 'admin-floating-status-banner';
    banner.setAttribute('aria-label', 'Admin status banner');
    banner.className = 'fixed bottom-4 right-4 z-50 flex items-center gap-2 p-2 px-3 rounded-full bg-slate-900/90 text-white backdrop-blur-md border border-slate-700 shadow-xl text-xs';
    document.body.appendChild(banner);
  }

  banner.innerHTML = `
    <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
    <span class="font-medium">Admin Mode Active</span>
    <a href="admin.html" class="ml-1 px-2.5 py-1 rounded-full bg-[#dc3c19] text-white font-semibold text-[11px] hover:bg-[#b52603]">Dashboard</a>
    <button type="button" id="exit-admin-btn" class="ml-1 text-slate-400 hover:text-white text-[11px] px-1.5 py-0.5 rounded">Exit</button>
  `;

  document.getElementById('exit-admin-btn').addEventListener('click', () => {
    logoutAdmin();
    window.location.reload();
  });
}

// ==========================================
// 5. DYNAMIC PAGE RENDERERS
// ==========================================
function renderHomePage() {
  const projectsContainer = document.getElementById('home-projects-container');
  const blogContainer = document.getElementById('home-blog-container');
  const admin = isAdminLoggedIn();

  if (projectsContainer) {
    const projects = getStoredProjects().slice(0, 3);
    if (projects.length === 0) {
      projectsContainer.innerHTML = `<div class="col-span-full py-8 text-center text-xs text-slate-400">No projects currently listed. Use Admin to add new entries.</div>`;
    } else {
      projectsContainer.innerHTML = projects.map(proj => `
        <div class="p-6 rounded-3xl bg-white dark:bg-slate-850 border border-slate-200/70 dark:border-slate-800 shadow-xs hover-card flex flex-col justify-between relative group">
          ${admin ? `
            <button type="button" data-home-delete-proj="${proj.id}" class="absolute top-4 right-4 z-10 px-2 py-0.5 rounded-full bg-rose-500 hover:bg-rose-600 text-white text-[10px] font-bold shadow-xs transition-colors flex items-center gap-1" title="Delete Project">
              <span>🗑️</span>
              <span>Delete</span>
            </button>
          ` : ''}
          <div class="space-y-4">
            <div class="w-12 h-12 rounded-2xl bg-orange-50 dark:bg-orange-950/40 border border-orange-100 dark:border-orange-900/40 flex items-center justify-center text-primary text-xl">
              ${proj.title.includes('OCR') || proj.title.includes('Polyglot') ? '🔍' : proj.title.includes('Hanzi') ? '📖' : '🧠'}
            </div>
            <div>
              <div class="flex items-center justify-between mb-1">
                <h3 class="text-lg font-bold text-slate-900 dark:text-white">${proj.title}</h3>
                <span class="text-[10px] font-mono px-2 py-0.5 rounded-full ${proj.status === 'Complete' ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 border border-emerald-200/50' : 'bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 border border-amber-200/50'} font-semibold">
                  ${proj.status}
                </span>
              </div>
              <p class="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                ${proj.description}
              </p>
            </div>
            <div class="flex flex-wrap gap-1.5 pt-1">
              ${(proj.tags || []).map(tag => `<span class="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">${tag}</span>`).join('')}
            </div>
          </div>
          <div class="pt-6 mt-4 border-t border-slate-100 dark:border-slate-800/80">
            <a href="${proj.githubUrl || 'https://github.com/TODO-tarun'}" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-primary-hover group">
              <span>View on GitHub</span>
              <svg class="w-3.5 h-3.5 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
              </svg>
            </a>
          </div>
        </div>
      `).join('');

      projectsContainer.querySelectorAll('[data-home-delete-proj]').forEach(btn => {
        btn.onclick = (e) => {
          e.preventDefault();
          e.stopPropagation();
          const id = btn.getAttribute('data-home-delete-proj');
          showConfirmModal({
            title: 'Delete Project',
            message: 'Are you sure you want to remove this project? It will be deleted across the site.',
            confirmText: 'Delete Project',
            onConfirm: () => {
              deleteProject(id);
              renderHomePage();
            }
          });
        };
      });
    }
  }

  if (blogContainer) {
    const posts = getStoredPosts().slice(0, 3);
    if (posts.length === 0) {
      blogContainer.innerHTML = `<div class="col-span-full py-8 text-center text-xs text-slate-400">No field notes currently listed. Use Admin to write a post.</div>`;
    } else {
      blogContainer.innerHTML = posts.map(post => `
        <div class="p-6 rounded-3xl bg-white dark:bg-slate-850 border border-slate-200/70 dark:border-slate-800 shadow-xs hover-card flex flex-col justify-between group relative">
          ${admin ? `
            <button type="button" data-home-delete-post="${post.slug}" class="absolute top-4 right-4 z-10 px-2 py-0.5 rounded-full bg-rose-500 hover:bg-rose-600 text-white text-[10px] font-bold shadow-xs transition-colors flex items-center gap-1" title="Delete Field Note">
              <span>🗑️</span>
              <span>Delete</span>
            </button>
          ` : ''}
          <div class="space-y-3">
            <div class="flex items-center justify-between text-xs">
              <span class="px-2.5 py-0.5 rounded-full font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300">
                ${post.category}
              </span>
              <span class="text-slate-400 font-mono text-[11px]">${post.date}</span>
            </div>
            <a href="post.html?slug=${post.slug}" class="block">
              <h3 class="text-base font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors leading-snug">
                ${post.title}
              </h3>
            </a>
            <p class="text-xs text-slate-600 dark:text-slate-400 line-clamp-3 leading-relaxed">
              ${post.summary}
            </p>
          </div>
          <div class="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
            <span>${post.readingTime || '4 min read'}</span>
            <a href="post.html?slug=${post.slug}" class="font-semibold text-primary group-hover:underline flex items-center gap-1">Read Note →</a>
          </div>
        </div>
      `).join('');

      blogContainer.querySelectorAll('[data-home-delete-post]').forEach(btn => {
        btn.onclick = (e) => {
          e.preventDefault();
          e.stopPropagation();
          const slug = btn.getAttribute('data-home-delete-post');
          showConfirmModal({
            title: 'Delete Field Note',
            message: 'Are you sure you want to remove this field note from the blog?',
            confirmText: 'Delete Note',
            onConfirm: () => {
              deletePost(slug);
              renderHomePage();
            }
          });
        };
      });
    }
  }
}

function renderProjectsPage() {
  const container = document.getElementById('projects-container');
  if (!container) return;

  const admin = isAdminLoggedIn();
  const adminHeaderArea = document.getElementById('project-admin-actions');
  if (adminHeaderArea) {
    if (admin) {
      adminHeaderArea.innerHTML = `
        <button type="button" id="open-add-project-modal" class="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#dc3c19] hover:bg-[#b52603] text-white text-xs font-semibold shadow-xs transition-colors">
          <span>+ Add Project</span>
        </button>
      `;
      const addBtn = document.getElementById('open-add-project-modal');
      if (addBtn) {
        addBtn.addEventListener('click', () => openAddProjectModal());
      }
    } else {
      adminHeaderArea.innerHTML = '';
    }
  }

  const projects = getStoredProjects();
  container.innerHTML = projects.map(proj => `
    <div class="project-card p-6 rounded-3xl bg-white dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 shadow-xs hover-card flex flex-col justify-between relative group"
         data-title="${(proj.title || '').toLowerCase()}"
         data-tags="${(proj.tags || []).join(' ').toLowerCase()}"
         data-desc="${(proj.description || '').toLowerCase()}"
         data-category="${(proj.category || '').toLowerCase()}">
      
      ${admin ? `
        <button type="button" data-delete-project="${proj.id}" class="delete-proj-trigger absolute top-4 right-4 z-20 px-2.5 py-1 rounded-full bg-rose-500 hover:bg-rose-600 text-white text-[10px] font-bold shadow-sm transition-colors flex items-center gap-1 cursor-pointer" title="Delete Project">
          <span>🗑️</span>
          <span>Delete</span>
        </button>
      ` : ''}

      <div class="space-y-4">
        <div class="flex items-center justify-between gap-2">
          <div class="flex items-center gap-1.5">
            <span class="w-2 h-2 rounded-full ${proj.status === 'Complete' ? 'bg-emerald-500' : 'bg-amber-500'}"></span>
            <span class="text-[11px] font-mono font-semibold text-slate-700 dark:text-slate-300">${proj.status}</span>
            <span class="text-slate-300 dark:text-slate-700">•</span>
            <span class="text-[11px] font-mono text-slate-500 dark:text-slate-400">${proj.typeBadge || 'Engineering Build'}</span>
          </div>
          <span class="text-xs font-mono text-slate-400">${proj.kanjiBadge || ''}</span>
        </div>

        ${proj.exampleMockup ? `
          <div class="relative p-4 rounded-2xl bg-slate-900 text-slate-100 font-mono text-xs overflow-hidden border border-slate-800">
            <div class="flex items-center justify-between text-[10px] text-slate-400 border-b border-slate-800 pb-2 mb-2">
              <span class="text-orange-400 font-semibold">${proj.exampleMockup.tag || 'SYSTEM PREVIEW'}</span>
              <span class="text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">Example Visual</span>
            </div>
            <div class="flex items-center gap-4">
              <div class="text-3xl font-extrabold text-white">${proj.exampleMockup.kanji || '道'}</div>
              <div class="text-[11px] text-slate-300 space-y-0.5">
                ${(proj.exampleMockup.breakdown || []).map(b => `<div>${b}</div>`).join('')}
              </div>
            </div>
          </div>
        ` : ''}

        <div>
          <h2 class="text-xl font-bold text-slate-900 dark:text-white mb-1.5">${proj.title}</h2>
          <p class="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">${proj.description}</p>
        </div>

        <div class="flex flex-wrap gap-1.5 pt-1">
          ${(proj.tags || []).map(tag => `<span class="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">${tag}</span>`).join('')}
        </div>
      </div>

      <div class="pt-6 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
        <div class="flex items-center gap-3">
          ${proj.githubUrl ? `
            <a href="${proj.githubUrl}" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:text-primary transition-colors">
              <span>Code</span>
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
              </svg>
            </a>
          ` : ''}
          ${proj.devlogSlug ? `
            <a href="post.html?slug=${proj.devlogSlug}" class="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors">
              <span>Devlog</span>
            </a>
          ` : ''}
        </div>
        <span class="text-[11px] font-mono text-slate-400">Tarun Portfolio</span>
      </div>

    </div>
  `).join('') + `
    <!-- Collaboration Slot -->
    <div class="project-card p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-orange-50/70 via-white to-amber-50/50 dark:from-slate-850 dark:via-slate-850 dark:to-orange-950/20 border border-dashed border-orange-300 dark:border-orange-800/60 shadow-xs flex flex-col justify-between"
         data-title="suggest a project idea"
         data-tags="collaboration idea open-source"
         data-desc="have an idea combining lightweight ml models speech recognition or vocabulary graph theory"
         data-category="collaboration">
      <div>
        <div class="w-12 h-12 rounded-2xl bg-[#dc3c19]/10 text-primary flex items-center justify-center font-bold text-xl mb-4">
          💡
        </div>
        <div>
          <span class="text-[11px] font-mono font-bold uppercase tracking-wider text-primary">Collaboration Slot</span>
          <h2 class="text-xl font-bold text-slate-900 dark:text-white mt-1 mb-2">
            Suggest a Project Idea
          </h2>
          <p class="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            Have an idea combining lightweight ML models, speech recognition, or vocabulary graph theory? Send me an email and let's explore it.
          </p>
        </div>
      </div>
      <div class="pt-6 mt-4 border-t border-orange-100 dark:border-slate-800">
        <a href="mailto:kumartarun3094@gmail.com?subject=Project%20Idea%20Suggestion" class="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#dc3c19] hover:bg-[#b52603] text-white text-xs font-semibold shadow-xs transition-colors">
          <span>Email an Idea</span>
          <span>↗</span>
        </a>
      </div>
    </div>
  `;

  const badge = document.getElementById('project-count-badge');
  if (badge) badge.textContent = `All Projects (${projects.length})`;

  // Attach delete listeners
  container.querySelectorAll('[data-delete-project]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      e.preventDefault();
      const id = btn.getAttribute('data-delete-project');
      showConfirmModal({
        title: 'Delete Project',
        message: 'Are you sure you want to permanently delete this project? It will be removed immediately.',
        confirmText: 'Delete Project',
        onConfirm: () => {
          deleteProject(id);
          renderProjectsPage();
          if (typeof renderHomePage === 'function') renderHomePage();
        }
      });
    });
  });
}

function renderBlogPage() {
  const container = document.getElementById('blog-posts-container');
  if (!container) return;

  const admin = isAdminLoggedIn();
  const adminHeaderArea = document.getElementById('blog-admin-actions');
  if (adminHeaderArea) {
    if (admin) {
      adminHeaderArea.innerHTML = `
        <button type="button" id="open-write-post-modal" class="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#dc3c19] hover:bg-[#b52603] text-white text-xs font-semibold shadow-xs transition-colors">
          <span>+ Write New Post</span>
        </button>
      `;
      const writeBtn = document.getElementById('open-write-post-modal');
      if (writeBtn) {
        writeBtn.addEventListener('click', () => openAddPostModal());
      }
    } else {
      adminHeaderArea.innerHTML = '';
    }
  }

  const posts = getStoredPosts();
  if (posts.length === 0) {
    container.innerHTML = `<div class="col-span-full py-12 text-center text-xs text-slate-400">No field notes currently published. Use Admin to write a post.</div>`;
  } else {
    container.innerHTML = posts.map(post => `
      <div class="blog-post-card p-6 rounded-3xl bg-white dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 shadow-xs hover-card flex flex-col justify-between group relative"
           data-title="${(post.title || '').toLowerCase()}"
           data-category="${(post.category || '').toLowerCase()}"
           data-summary="${(post.summary || '').toLowerCase()}">
        
        ${admin ? `
          <button type="button" data-delete-post="${post.slug}" class="delete-post-trigger absolute top-4 right-4 z-20 px-2.5 py-1 rounded-full bg-rose-500 hover:bg-rose-600 text-white text-[10px] font-bold shadow-sm transition-colors flex items-center gap-1 cursor-pointer" title="Delete Note">
            <span>🗑️</span>
            <span>Delete</span>
          </button>
        ` : ''}

        <div class="space-y-3">
          <div class="flex items-center justify-between text-xs">
            <span class="px-2.5 py-0.5 rounded-full font-semibold bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300">
              ${post.category}
            </span>
            <span class="text-slate-400 font-mono text-[11px]">${post.date}</span>
          </div>
          <a href="post.html?slug=${post.slug}" class="block">
            <h3 class="text-lg font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors leading-snug">
              ${post.title}
            </h3>
          </a>
          <p class="text-xs text-slate-600 dark:text-slate-400 line-clamp-3 leading-relaxed">
            ${post.summary}
          </p>
          ${post.badge ? `
            <div class="p-3 rounded-2xl bg-sky-50/70 dark:bg-slate-900 border border-sky-100 dark:border-slate-800 text-[11px] text-sky-800 dark:text-sky-300 font-mono">
              ${post.badge}
            </div>
          ` : ''}
        </div>

        <div class="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span>${post.readingTime || '4 min read'}</span>
          <a href="post.html?slug=${post.slug}" class="font-semibold text-primary group-hover:underline flex items-center gap-1">
            Read Note →
          </a>
        </div>
      </div>
    `).join('');
  }

  const countEl = document.getElementById('blog-post-count');
  if (countEl) countEl.textContent = `${posts.length} items`;

  container.querySelectorAll('[data-delete-post]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      e.preventDefault();
      const slug = btn.getAttribute('data-delete-post');
      showConfirmModal({
        title: 'Delete Field Note',
        message: 'Are you sure you want to permanently remove this field note?',
        confirmText: 'Delete Note',
        onConfirm: () => {
          deletePost(slug);
          renderBlogPage();
          if (typeof renderHomePage === 'function') renderHomePage();
        }
      });
    });
  });
}

function openAddProjectModal() {
  let modal = document.getElementById('add-project-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'add-project-modal';
    modal.className = 'fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto';
    modal.innerHTML = `
      <div class="relative w-full max-w-lg p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4 my-8">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <span class="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">🛠️</span>
            <h3 class="text-lg font-bold text-slate-900 dark:text-white">Add New Project</h3>
          </div>
          <button type="button" id="close-add-project" class="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-lg">✕</button>
        </div>
        <form id="new-project-form" class="space-y-4">
          <div>
            <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Project Title *</label>
            <input type="text" name="title" required placeholder="e.g. PolyglotLens AI" class="w-full px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:border-primary focus:ring-2 focus:ring-primary/20" />
          </div>
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Category *</label>
              <select name="category" required class="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white">
                <option value="ai / ml">AI / ML</option>
                <option value="language tech">Language Tech</option>
                <option value="web & tools">Web & Tools</option>
              </select>
            </div>
            <div>
              <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Status *</label>
              <select name="status" required class="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white">
                <option value="Complete">Complete</option>
                <option value="In Progress">In Progress</option>
                <option value="Planned">Planned</option>
              </select>
            </div>
          </div>
          <div>
            <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Description *</label>
            <textarea name="description" rows="3" required placeholder="Short summary of what this tool does..." class="w-full px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:border-primary focus:ring-2 focus:ring-primary/20"></textarea>
          </div>
          <div>
            <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Tech Stack Tags (comma separated)</label>
            <input type="text" name="tags" placeholder="Python, OpenCV, PyTorch" class="w-full px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white" />
          </div>
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">GitHub Repo URL</label>
              <input type="url" name="githubUrl" placeholder="https://github.com/..." class="w-full px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white" />
            </div>
            <div>
              <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Kanji Badge (optional)</label>
              <input type="text" name="kanjiBadge" placeholder="e.g. 「視覚識別」" class="w-full px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white" />
            </div>
          </div>
          <div class="flex items-center justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
            <button type="button" id="cancel-add-project" class="px-4 py-2 rounded-full border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-600 dark:text-slate-300">Cancel</button>
            <button type="submit" class="px-5 py-2 rounded-full bg-[#dc3c19] hover:bg-[#b52603] text-white text-xs font-semibold shadow-xs">Save Project</button>
          </div>
        </form>
      </div>
    `;
    document.body.appendChild(modal);

    document.getElementById('close-add-project').onclick = () => modal.classList.add('hidden');
    document.getElementById('cancel-add-project').onclick = () => modal.classList.add('hidden');

    document.getElementById('new-project-form').onsubmit = (e) => {
      e.preventDefault();
      const form = e.target;
      const rawTags = form.tags.value.split(',').map(t => t.trim()).filter(Boolean);
      const newProj = {
        title: form.title.value,
        category: form.category.value,
        status: form.status.value,
        description: form.description.value,
        tags: rawTags.length ? rawTags : ['Tool'],
        githubUrl: form.githubUrl.value || 'https://github.com/TODO-tarun',
        kanjiBadge: form.kanjiBadge.value || '「新規作成」',
        typeBadge: form.category.value === 'ai / ml' ? 'Applied ML' : 'System Build'
      };
      addProject(newProj);
      modal.classList.add('hidden');
      form.reset();
      if (typeof renderProjectsPage === 'function') renderProjectsPage();
      if (typeof renderHomePage === 'function') renderHomePage();
    };
  }

  modal.classList.remove('hidden');
}

function openAddPostModal() {
  let modal = document.getElementById('add-post-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'add-post-modal';
    modal.className = 'fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto';
    modal.innerHTML = `
      <div class="relative w-full max-w-xl p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4 my-8">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <span class="w-8 h-8 rounded-full bg-secondary/10 text-secondary flex items-center justify-center font-bold">✍️</span>
            <h3 class="text-lg font-bold text-slate-900 dark:text-white">Write Field Note</h3>
          </div>
          <button type="button" id="close-add-post" class="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-lg">✕</button>
        </div>
        <form id="new-post-form" class="space-y-4">
          <div>
            <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Post Title *</label>
            <input type="text" name="title" required placeholder="e.g. Fine-Tuning Attention Heads" class="w-full px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:border-secondary focus:ring-2 focus:ring-secondary/20" />
          </div>
          <div class="grid grid-cols-3 gap-3">
            <div>
              <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Category *</label>
              <select name="category" required class="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white">
                <option value="What I'm Learning">What I'm Learning</option>
                <option value="Project Devlog">Project Devlog</option>
                <option value="AI & Engineering">AI & Engineering</option>
                <option value="Daily TIL">Daily TIL</option>
                <option value="Study Journal">Study Journal</option>
              </select>
            </div>
            <div>
              <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Date</label>
              <input type="text" name="date" placeholder="Today" class="w-full px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white" />
            </div>
            <div>
              <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Reading Time</label>
              <input type="text" name="readingTime" placeholder="4 min read" class="w-full px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white" />
            </div>
          </div>
          <div>
            <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Summary *</label>
            <textarea name="summary" rows="2" required placeholder="Brief 1-2 sentence overview for the card feed..." class="w-full px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:border-secondary focus:ring-2 focus:ring-secondary/20"></textarea>
          </div>
          <div>
            <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Article Body (HTML/Text) *</label>
            <textarea name="content" rows="6" required placeholder="Write your complete notes, thoughts, and reflections here..." class="w-full px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-mono text-slate-900 dark:text-white focus:border-secondary focus:ring-2 focus:ring-secondary/20"></textarea>
          </div>
          <div class="flex items-center justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
            <button type="button" id="cancel-add-post" class="px-4 py-2 rounded-full border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-600 dark:text-slate-300">Cancel</button>
            <button type="submit" class="px-5 py-2 rounded-full bg-[#dc3c19] hover:bg-[#b52603] text-white text-xs font-semibold shadow-xs">Publish Note</button>
          </div>
        </form>
      </div>
    `;
    document.body.appendChild(modal);

    document.getElementById('close-add-post').onclick = () => modal.classList.add('hidden');
    document.getElementById('cancel-add-post').onclick = () => modal.classList.add('hidden');

    document.getElementById('new-post-form').onsubmit = (e) => {
      e.preventDefault();
      const form = e.target;
      const today = new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
      const newP = {
        title: form.title.value,
        category: form.category.value,
        date: form.date.value || today,
        readingTime: form.readingTime.value || '4 min read',
        summary: form.summary.value,
        content: `<p class="lead mb-4 font-medium text-base text-slate-700 dark:text-slate-200">${form.summary.value}</p>` + form.content.value
      };
      addPost(newP);
      modal.classList.add('hidden');
      form.reset();
      if (typeof renderBlogPage === 'function') renderBlogPage();
      if (typeof renderHomePage === 'function') renderHomePage();
    };
  }

  modal.classList.remove('hidden');
}

// ==========================================
// 6. THEME (DARK / LIGHT MODE)
// ==========================================
function initTheme() {
  const toggles = document.querySelectorAll('.theme-toggle');

  function updateIcons(isDark) {
    toggles.forEach(toggle => {
      const sun = toggle.querySelector('.icon-sun');
      const moon = toggle.querySelector('.icon-moon');
      if (sun && moon) {
        if (isDark) {
          sun.classList.remove('hidden');
          moon.classList.add('hidden');
        } else {
          sun.classList.add('hidden');
          moon.classList.remove('hidden');
        }
      }
    });
  }

  const isDarkInitial = document.documentElement.classList.contains('dark');
  updateIcons(isDarkInitial);

  toggles.forEach(toggle => {
    toggle.addEventListener('click', () => {
      const isDark = document.documentElement.classList.toggle('dark');
      try {
        localStorage.setItem('tarun_theme', isDark ? 'dark' : 'light');
        localStorage.setItem('tarun-theme', isDark ? 'dark' : 'light');
      } catch (e) {
        console.warn('Theme storage error:', e);
      }
      updateIcons(isDark);
    });
  });
}

// ==========================================
// 7. MOBILE MENU DRAWER
// ==========================================
function initMobileMenu() {
  const menuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  if (!menuBtn || !mobileMenu) return;

  const openIcon = menuBtn.querySelector('.icon-menu-open');
  const closeIcon = menuBtn.querySelector('.icon-menu-close');

  menuBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    const isHidden = mobileMenu.classList.toggle('hidden');
    menuBtn.setAttribute('aria-expanded', !isHidden);
    if (openIcon && closeIcon) {
      if (isHidden) {
        openIcon.classList.remove('hidden');
        closeIcon.classList.add('hidden');
      } else {
        openIcon.classList.add('hidden');
        closeIcon.classList.remove('hidden');
      }
    }
  });

  document.addEventListener('click', (e) => {
    if (!mobileMenu.contains(e.target) && !menuBtn.contains(e.target) && !mobileMenu.classList.contains('hidden')) {
      mobileMenu.classList.add('hidden');
      menuBtn.setAttribute('aria-expanded', 'false');
      if (openIcon && closeIcon) {
        openIcon.classList.remove('hidden');
        closeIcon.classList.add('hidden');
      }
    }
  });
}

// ==========================================
// 8. ACTIVE NAVIGATION LINK
// ==========================================
function initActiveNav() {
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  let activeKey = 'home';
  if (currentPath === 'projects.html') activeKey = 'projects';
  else if (currentPath === 'blog.html' || currentPath === 'post.html') activeKey = 'blog';
  else if (currentPath === 'connect.html') activeKey = 'connect';

  const navLinks = document.querySelectorAll('[data-nav-page]');
  navLinks.forEach(link => {
    const page = link.getAttribute('data-nav-page');
    if (page === activeKey) {
      link.classList.add('bg-white', 'dark:bg-slate-700', 'text-slate-900', 'dark:text-white', 'shadow-xs', 'font-semibold');
      link.classList.remove('text-slate-600', 'dark:text-slate-400');
    } else {
      link.classList.remove('bg-white', 'dark:bg-slate-700', 'text-slate-900', 'dark:text-white', 'shadow-xs', 'font-semibold');
      link.classList.add('text-slate-600', 'dark:text-slate-400', 'hover:text-slate-900', 'dark:hover:text-white');
    }
  });
}

// ==========================================
// 9. COPY EMAIL BUTTON
// ==========================================
function initCopyEmail() {
  const copyBtns = document.querySelectorAll('#copy-email-btn, .copy-email-btn, #hero-copy-email');
  const emailText = 'kumartarun3094@gmail.com';

  copyBtns.forEach(btn => {
    btn.addEventListener('click', async (e) => {
      e.preventDefault();
      try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          await navigator.clipboard.writeText(emailText);
        } else {
          const ta = document.createElement('textarea');
          ta.value = emailText;
          ta.style.position = 'fixed';
          ta.style.opacity = '0';
          document.body.appendChild(ta);
          ta.select();
          document.execCommand('copy');
          document.body.removeChild(ta);
        }

        const originalText = btn.innerHTML;
        btn.innerHTML = `<span>Copied to clipboard! ✓</span>`;
        btn.classList.add('text-emerald-600', 'dark:text-emerald-400');
        showToast('Email address copied to clipboard ✓');

        setTimeout(() => {
          btn.innerHTML = originalText;
          btn.classList.remove('text-emerald-600', 'dark:text-emerald-400');
        }, 2200);
      } catch (err) {
        console.warn('Copy failed:', err);
      }
    });
  });
}

// ==========================================
// 10. FORMSPREE CONTACT FORM HANDLER
// ==========================================
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  const statusMsg = document.getElementById('form-status') || (() => {
    const el = document.createElement('div');
    el.id = 'form-status';
    el.className = 'text-xs p-3.5 rounded-xl hidden mt-3';
    form.appendChild(el);
    return el;
  })();

  const submitBtn = form.querySelector('button[type="submit"]');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const action = form.getAttribute('action') || '';

    // Check placeholder
    if (action.includes('YOUR_FORM_ID') || action.trim() === '') {
      statusMsg.className = 'text-xs p-3.5 rounded-xl mt-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-amber-900 dark:text-amber-200';
      statusMsg.innerHTML = `
        <div class="font-bold mb-1">Form not connected yet.</div>
        <div>Please email Tarun directly at <a href="mailto:kumartarun3094@gmail.com" class="underline font-semibold hover:text-primary">kumartarun3094@gmail.com</a>.</div>
      `;
      statusMsg.classList.remove('hidden');
      return;
    }

    // Live form submit
    const originalBtnText = submitBtn ? submitBtn.innerHTML : 'Send Message';
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = `
        <span class="inline-block animate-spin mr-2">⏳</span>
        <span>Sending message...</span>
      `;
    }

    try {
      const response = await fetch(action, {
        method: 'POST',
        body: new FormData(form),
        headers: {
          'Accept': 'application/json'
        }
      });

      if (response.ok) {
        statusMsg.className = 'text-xs p-3.5 rounded-xl mt-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-emerald-900 dark:text-emerald-200';
        statusMsg.innerHTML = `
          <div class="font-bold">Thank you for your message!</div>
          <div>I'll get back to you shortly at your provided email.</div>
        `;
        statusMsg.classList.remove('hidden');
        form.reset();
        showToast('Message sent successfully ✓');
      } else {
        throw new Error('Formspree returned an error');
      }
    } catch (err) {
      statusMsg.className = 'text-xs p-3.5 rounded-xl mt-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800/60 text-red-900 dark:text-red-200';
      statusMsg.innerHTML = `
        <div class="font-bold">Failed to send message.</div>
        <div>Please email directly at <a href="mailto:kumartarun3094@gmail.com" class="underline font-semibold">kumartarun3094@gmail.com</a>.</div>
      `;
      statusMsg.classList.remove('hidden');
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnText;
      }
    }
  });
}

// ==========================================
// 11. LIVE TIME CLOCK (IST)
// ==========================================
function initLiveClock() {
  const clockEl = document.getElementById('live-clock') || document.querySelector('.live-clock');
  if (!clockEl) return;

  function updateTime() {
    try {
      const now = new Date();
      const timeStr = now.toLocaleTimeString('en-US', {
        timeZone: 'Asia/Kolkata',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      });
      clockEl.textContent = `${timeStr} IST`;
    } catch (e) {
      const now = new Date();
      clockEl.textContent = now.toLocaleTimeString();
    }
  }

  updateTime();
  setInterval(updateTime, 1000);
}

// ==========================================
// 12. BLOG SEARCH & FILTER
// ==========================================
function initBlogSearch() {
  const searchInput = document.getElementById('blog-search-input');
  const pills = document.querySelectorAll('.blog-filter-pill');
  const emptyState = document.getElementById('blog-empty-state');
  const countEl = document.getElementById('blog-post-count');

  if (!searchInput && pills.length === 0) return;

  let activeCategory = 'all';

  function applyFilter() {
    const query = (searchInput ? searchInput.value : '').toLowerCase().trim();
    const cards = document.querySelectorAll('.blog-post-card');
    let visibleCount = 0;

    cards.forEach(card => {
      const title = card.getAttribute('data-title') || '';
      const cat = card.getAttribute('data-category') || '';
      const summary = card.getAttribute('data-summary') || '';

      const matchesCat = activeCategory === 'all' || cat.includes(activeCategory);
      const matchesQuery = !query || title.includes(query) || cat.includes(query) || summary.includes(query);

      if (matchesCat && matchesQuery) {
        card.classList.remove('hidden');
        visibleCount++;
      } else {
        card.classList.add('hidden');
      }
    });

    if (emptyState) {
      if (visibleCount === 0) emptyState.classList.remove('hidden');
      else emptyState.classList.add('hidden');
    }

    if (countEl) countEl.textContent = `${visibleCount} item${visibleCount === 1 ? '' : 's'}`;
  }

  if (searchInput) {
    searchInput.addEventListener('input', applyFilter);
  }

  pills.forEach(pill => {
    pill.addEventListener('click', () => {
      pills.forEach(p => {
        p.className = 'blog-filter-pill px-4 py-1.5 rounded-full text-xs font-medium bg-white text-slate-600 dark:bg-slate-850 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-slate-400 transition-colors';
      });
      pill.className = 'blog-filter-pill px-4 py-1.5 rounded-full text-xs font-semibold bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-xs transition-colors';
      activeCategory = pill.getAttribute('data-filter') || 'all';
      applyFilter();
    });
  });
}

// ==========================================
// 13. PROJECTS SEARCH & FILTER
// ==========================================
function initProjectsFilter() {
  const searchInput = document.getElementById('project-search-input') || document.getElementById('projects-search-input');
  const pills = document.querySelectorAll('.project-filter-pill, .filter-pill');
  const emptyState = document.getElementById('project-empty-state') || document.getElementById('projects-empty-state');
  const badge = document.getElementById('project-count-badge');

  if (!searchInput && pills.length === 0) return;

  let activeCategory = 'all';

  function applyFilter() {
    const query = (searchInput ? searchInput.value : '').toLowerCase().trim();
    const cards = document.querySelectorAll('.project-card');
    let visibleCount = 0;

    cards.forEach(card => {
      const title = card.getAttribute('data-title') || '';
      const tags = card.getAttribute('data-tags') || '';
      const desc = card.getAttribute('data-desc') || '';
      const cat = card.getAttribute('data-category') || '';

      const matchesCat = activeCategory === 'all' || cat.includes(activeCategory);
      const matchesQuery = !query || title.includes(query) || tags.includes(query) || desc.includes(query);

      if (matchesCat && matchesQuery) {
        card.classList.remove('hidden');
        visibleCount++;
      } else {
        card.classList.add('hidden');
      }
    });

    if (emptyState) {
      if (visibleCount === 0) emptyState.classList.remove('hidden');
      else emptyState.classList.add('hidden');
    }

    if (badge && activeCategory === 'all' && !query) {
      badge.textContent = `All Projects (${visibleCount})`;
    }
  }

  if (searchInput) {
    searchInput.addEventListener('input', applyFilter);
  }

  pills.forEach(pill => {
    pill.addEventListener('click', () => {
      pills.forEach(p => {
        p.className = 'project-filter-pill px-4 py-1.5 rounded-full text-xs font-medium bg-white text-slate-600 dark:bg-slate-850 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-slate-400 transition-colors';
      });
      pill.className = 'project-filter-pill px-4 py-1.5 rounded-full text-xs font-semibold bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-xs transition-colors';
      activeCategory = pill.getAttribute('data-filter') || 'all';
      applyFilter();
    });
  });
}

// ==========================================
// 14. DYNAMIC REUSABLE BLOG POST TEMPLATE
// ==========================================
function initPostPage() {
  const container = document.getElementById('post-dynamic-content');
  if (!container) return;

  const urlParams = new URLSearchParams(window.location.search);
  const slug = urlParams.get('slug') || 'starting-from-zero';

  const posts = getStoredPosts();
  const index = posts.findIndex(p => p.slug === slug);
  const post = index !== -1 ? posts[index] : posts[0];

  if (!post) {
    container.innerHTML = `
      <div class="py-16 text-center space-y-4">
        <h1 class="text-3xl font-extrabold text-slate-900 dark:text-white">Note Not Found</h1>
        <p class="text-slate-500 text-sm">The article you requested could not be located in Tarun's field notes.</p>
        <a href="blog.html" class="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#dc3c19] text-white text-xs font-semibold">
          ← Return to All Field Notes
        </a>
      </div>
    `;
    return;
  }

  // Update page title
  document.title = `${post.title} | Tarun's Field Notes`;

  const prevPost = index > 0 ? posts[index - 1] : null;
  const nextPost = index < posts.length - 1 ? posts[index + 1] : null;
  const admin = isAdminLoggedIn();

  container.innerHTML = `
    <!-- Top Back Link & Actions -->
    <div class="flex items-center justify-between pb-2 border-b border-slate-200/60 dark:border-slate-800">
      <a href="blog.html" class="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-primary transition-colors">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
        </svg>
        <span>Back to all field notes</span>
      </a>

      <div class="flex items-center gap-2">
        <span class="px-2.5 py-0.5 rounded-full font-semibold text-[11px] bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 font-mono">
          ${post.category}
        </span>
        ${admin ? `
          <button type="button" id="post-page-delete-btn" class="px-3 py-1 rounded-full bg-rose-500 hover:bg-rose-600 text-white text-[11px] font-bold shadow-xs transition-colors flex items-center gap-1">
            <span>🗑️ Delete Note</span>
          </button>
        ` : ''}
      </div>
    </div>

    <!-- Article Header -->
    <header class="space-y-4 pt-2">
      <h1 class="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white leading-tight tracking-tight">
        ${post.title}
      </h1>

      <div class="flex flex-wrap items-center gap-3 text-xs text-slate-500 font-mono pt-1">
        <span class="flex items-center gap-1.5 text-slate-800 dark:text-slate-200 font-bold">
          <span class="w-6 h-6 rounded-full bg-[#dc3c19] text-white flex items-center justify-center text-[10px]">T</span>
          <span>Tarun</span>
        </span>
        <span>•</span>
        <span>${post.date}</span>
        <span>•</span>
        <span>${post.readingTime || '4 min read'}</span>
      </div>

      ${post.badge ? `
        <div class="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 font-mono">
          ${post.badge}
        </div>
      ` : ''}
    </header>

    <!-- Main Article Body -->
    <article class="prose prose-slate dark:prose-invert max-w-none pt-4 text-slate-700 dark:text-slate-300 leading-relaxed text-sm sm:text-base space-y-4">
      ${post.content || `<p>${post.summary}</p>`}
    </article>

    <!-- Article Footer & Author Signature -->
    <div class="pt-8 mt-12 border-t border-slate-200/80 dark:border-slate-800 space-y-6">
      <div class="p-5 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 flex items-center gap-4">
        <div class="w-12 h-12 rounded-2xl bg-[#dc3c19] text-white flex items-center justify-center font-bold text-lg shrink-0">
          T
        </div>
        <div>
          <div class="font-bold text-slate-900 dark:text-white text-sm">Documented by Tarun</div>
          <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Student & aspiring AI engineer exploring machine learning foundations and dual language acquisition.
          </p>
        </div>
      </div>

      <!-- Prev / Next Post Links -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
        ${prevPost ? `
          <a href="post.html?slug=${prevPost.slug}" class="p-4 rounded-2xl bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-800 hover-card space-y-1 block group">
            <span class="text-[10px] font-mono text-slate-400 uppercase tracking-wider">← Newer Note</span>
            <div class="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-primary transition-colors line-clamp-1">
              ${prevPost.title}
            </div>
          </a>
        ` : `<div></div>`}

        ${nextPost ? `
          <a href="post.html?slug=${nextPost.slug}" class="p-4 rounded-2xl bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-800 hover-card space-y-1 block text-right group">
            <span class="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Older Note →</span>
            <div class="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-primary transition-colors line-clamp-1">
              ${nextPost.title}
            </div>
          </a>
        ` : `<div></div>`}
      </div>
    </div>
  `;

  const deleteBtn = document.getElementById('post-page-delete-btn');
  if (deleteBtn) {
    deleteBtn.addEventListener('click', () => {
      showConfirmModal({
        title: 'Delete Field Note',
        message: `Permanently delete "${post.title}"?`,
        confirmText: 'Delete Note',
        onConfirm: () => {
          deletePost(post.slug);
          window.location.href = 'blog.html';
        }
      });
    });
  }
}

// ==========================================
// 15. EXPORT GLOBALS FOR ADMIN & OTHER PAGES
// ==========================================
window.isAdminAuthenticated = isAdminLoggedIn;
window.setAdminAuth = (auth) => {
  if (auth) loginAdmin(ADMIN_PASSCODE);
  else logoutAdmin();
};
window.getProjects = getStoredProjects;
window.getBlogPosts = getStoredPosts;
window.deleteProject = (id) => {
  performDeleteProject(id);
  if (typeof renderProjectsPage === 'function') renderProjectsPage();
  if (typeof renderHomePage === 'function') renderHomePage();
};
window.deleteBlogPost = (slug) => {
  performDeletePost(slug);
  if (typeof renderBlogPage === 'function') renderBlogPage();
  if (typeof renderHomePage === 'function') renderHomePage();
};
window.resetDataToSeed = () => {
  resetDefaultData();
  if (typeof renderProjectsPage === 'function') renderProjectsPage();
  if (typeof renderBlogPage === 'function') renderBlogPage();
  if (typeof renderHomePage === 'function') renderHomePage();
};
window.openAddProjectModal = openAddProjectModal;
window.openAddPostModal = openAddPostModal;
window.showConfirmModal = showConfirmModal;
window.showToast = showToast;

// ==========================================
// 16. DOM READY BOOTSTRAP
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initMobileMenu();
  initActiveNav();
  initCopyEmail();
  initContactForm();
  initLiveClock();
  setupAdminHeaderTrigger();
  renderAdminFloatingBanner();

  renderHomePage();
  renderProjectsPage();
  renderBlogPage();
  initBlogSearch();
  initProjectsFilter();
  initPostPage();
});

// Sync data changes across tabs or windows
window.addEventListener('storage', () => {
  if (typeof renderHomePage === 'function') renderHomePage();
  if (typeof renderProjectsPage === 'function') renderProjectsPage();
  if (typeof renderBlogPage === 'function') renderBlogPage();
});
