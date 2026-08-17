/* ============================================
   Zaza Al — منطق التطبيق
   ============================================ */

/* --------- الإعدادات --------- */
const API_URL = 'https://api.z.ai/api/paas/v4/chat/completions';
const STORAGE_KEY = 'zaza-al-conversation';
const API_KEY_STORAGE = 'zaza-al-api-key';
const THEME_STORAGE = 'zaza-al-theme';

const SYSTEM_PROMPT = `أنت "Zaza Al" — مساعد ذكاء اصطناعي عربي ودود وذكي ومضاحك، يشبه النماذج الرائدة مثل ChatGPT.

شخصيتك:
- ذكي ومطلع على كل المواضيع: العلم، التقنية، التاريخ، الفلسفة، الرياضة، الطبخ، الأدب، البرمجة، الرياضيات، وغيرها.
- لغتك الأساسية هي العربية. اجب دائمًا بالعربية إلا إذا طلب المستخدم لغة أخرى صراحةً.
- استخدم العربية الفصحى المبسطة أو اللهجة حسب أسلوب المستخدم.
- تحب المزاح والنكات الخفيفة والردود الذكية، لكنك تعرف متى تكون جادًا.
- إجاباتك واضحة ومنظمة: استخدم عناوين فرعية، نقاط، جداول، وأكواد برمجية عند الحاجة (Markdown).
- عند الكود البرمجي، استخدم كتل Markdown مع تحديد اللغة: \`\`\`python, \`\`\`javascript, إلخ.
- كن صريحًا إذا لم تعرف الإجابة، ولا تخترع معلومات.
- لا تذكر أبدًا أنك مبنية على نموذج آخر أو أنك تابعة لأي شركة. أنت ببساطة Zaza Al.
- ردودك دافئة وتشجيعية، وترحب بالأسئلة المتابعة.

تذكّر دائمًا: أجب بالعربية فقط ما لم يُطلب منك خلاف ذلك.`;

/* --------- الحالة --------- */
let messages = [];
let isStreaming = false;
let abortController = null;

/* --------- العناصر --------- */
const $ = (id) => document.getElementById(id);
const els = {
  app: $('app'),
  messages: $('messages'),
  welcome: $('welcome'),
  input: $('input'),
  sendBtn: $('send-btn'),
  sendIcon: $('send-icon'),
  stopIcon: $('stop-icon'),
  themeBtn: $('theme-btn'),
  themeIcon: $('theme-icon'),
  clearBtn: $('clear-btn'),
  newChatBtn: $('new-chat-btn'),
  menuBtn: $('menu-btn'),
  sidebar: document.querySelector('.sidebar'),
  msgCount: $('msg-count'),
  statusDot: $('status-dot'),
  statusText: $('status-text'),
  setupModal: $('setup-modal'),
  apiKeyInput: $('api-key-input'),
  saveKeyBtn: $('save-key-btn'),
  skipKeyBtn: $('skip-key-btn'),
  settingsBtn: $('settings-btn'),
};

/* --------- أدوات مساعدة --------- */
function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

function getApiKey() {
  return localStorage.getItem(API_KEY_STORAGE) || '';
}

function setApiKey(key) {
  localStorage.setItem(API_KEY_STORAGE, key.trim());
}

/* --------- السمة --------- */
function loadTheme() {
  const saved = localStorage.getItem(THEME_STORAGE) || 'dark';
  document.documentElement.setAttribute('data-theme', saved);
  updateThemeIcon(saved);
}

function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem(THEME_STORAGE, next);
  updateThemeIcon(next);
}

function updateThemeIcon(theme) {
  if (theme === 'dark') {
    els.themeIcon.innerHTML = '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>';
  } else {
    els.themeIcon.innerHTML = '<circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>';
  }
}

/* --------- حفظ/تحميل المحادثة --------- */
function saveConversation() {
  const toSave = messages.filter(
    (m) => m.role === 'user' || m.content.trim().length > 0
  );
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
  } catch (e) {
    console.warn('فشل حفظ المحادثة:', e);
  }
}

function loadConversation() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

/* --------- عرض الرسائل --------- */
function renderMessages() {
  if (messages.length === 0) {
    els.welcome.style.display = 'flex';
    // إزالة رسائل سابقة إن وجدت
    const oldChat = els.messages.querySelector('.chat-messages');
    if (oldChat) oldChat.remove();
    els.msgCount.textContent = '0';
    return;
  }

  els.welcome.style.display = 'none';
  let chatEl = els.messages.querySelector('.chat-messages');
  if (!chatEl) {
    chatEl = document.createElement('div');
    chatEl.className = 'chat-messages';
    els.messages.appendChild(chatEl);
  }

  // إعادة البناء الكامل في كل مرة (بسيط وموثوق)
  chatEl.innerHTML = '';
  for (const m of messages) {
    chatEl.appendChild(createMessageEl(m));
  }

  els.msgCount.textContent = messages.length;
  scrollToBottom();
}

function createMessageEl(m) {
  const div = document.createElement('div');
  div.className = `message ${m.role}`;
  div.dataset.id = m.id;

  const avatar = document.createElement('div');
  avatar.className = `avatar ${m.role}`;
  if (m.role === 'user') {
    avatar.textContent = 'أنت';
  } else {
    avatar.innerHTML = `<svg width="22" height="22" viewBox="0 0 64 64" fill="none">
      <defs>
        <linearGradient id="ag-${m.id}" x1="0" y1="0" x2="64" y2="64">
          <stop offset="0%" stop-color="#ffffff"/>
          <stop offset="100%" stop-color="#ffffff"/>
        </linearGradient>
      </defs>
      <path d="M 23 24 H 41 L 25 40 H 41" stroke="white" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
    </svg>`;
  }

  const bubble = document.createElement('div');
  bubble.className = 'bubble';

  if (m.role === 'assistant' && m.streaming && m.content.length === 0) {
    // مؤشر الكتابة
    bubble.innerHTML = '<div class="typing"><span></span><span></span><span></span></div>';
  } else if (m.role === 'user') {
    bubble.textContent = m.content;
  } else {
    // عرض Markdown
    bubble.innerHTML = renderMarkdown(m.content);
    // تمييز الأكواد
    bubble.querySelectorAll('pre code').forEach((block) => {
      try { hljs.highlightElement(block); } catch {}
    });
    // إضافة أزرار النسخ
    addCopyButtons(bubble);
  }

  div.appendChild(avatar);
  div.appendChild(bubble);
  return div;
}

function renderMarkdown(text) {
  try {
    // إعداد marked
    marked.setOptions({
      breaks: true,
      gfm: true,
    });
    return marked.parse(text);
  } catch {
    return text.replace(/</g, '&lt;').replace(/\n/g, '<br>');
  }
}

function addCopyButtons(container) {
  container.querySelectorAll('pre').forEach((pre) => {
    if (pre.querySelector('.copy-btn')) return;
    const btn = document.createElement('button');
    btn.className = 'copy-btn';
    btn.textContent = 'نسخ';
    btn.style.cssText = `
      position: absolute;
      top: 8px;
      left: 8px;
      background: rgba(255,255,255,0.1);
      color: #abb2bf;
      border: 1px solid rgba(255,255,255,0.15);
      border-radius: 6px;
      padding: 4px 10px;
      font-size: 11px;
      cursor: pointer;
      font-family: inherit;
      opacity: 0;
      transition: opacity 0.2s;
    `;
    pre.style.position = 'relative';
    pre.appendChild(btn);
    pre.addEventListener('mouseenter', () => btn.style.opacity = '1');
    pre.addEventListener('mouseleave', () => btn.style.opacity = '0');
    btn.addEventListener('click', () => {
      const code = pre.querySelector('code');
      if (code) {
        navigator.clipboard.writeText(code.textContent).then(() => {
          btn.textContent = 'تم النسخ ✓';
          setTimeout(() => btn.textContent = 'نسخ', 1500);
        });
      }
    });
  });
}

function updateMessageContent(id, content, streaming) {
  const el = els.messages.querySelector(`.message[data-id="${id}"]`);
  if (!el) return;
  const bubble = el.querySelector('.bubble');
  if (!bubble) return;

  if (streaming && content.length === 0) {
    bubble.innerHTML = '<div class="typing"><span></span><span></span><span></span></div>';
  } else {
    bubble.innerHTML = renderMarkdown(content);
    bubble.querySelectorAll('pre code').forEach((block) => {
      try { hljs.highlightElement(block); } catch {}
    });
    addCopyButtons(bubble);
  }
}

function scrollToBottom() {
  setTimeout(() => {
    els.messages.scrollTop = els.messages.scrollHeight;
  }, 50);
}

/* --------- الإرسال --------- */
async function sendMessage(text) {
  const trimmed = text.trim();
  if (!trimmed || isStreaming) return;

  const apiKey = getApiKey();
  if (!apiKey) {
    openSetupModal();
    return;
  }

  // إنشاء رسالة المستخدم
  const userMsg = {
    id: uid(),
    role: 'user',
    content: trimmed,
  };

  // إنشاء رسالة المساعد (فارغة حتى يبدأ البث)
  const aiMsg = {
    id: uid(),
    role: 'assistant',
    content: '',
    streaming: true,
  };

  messages.push(userMsg);
  messages.push(aiMsg);
  renderMessages();
  saveConversation();

  // تحديث الواجهة
  setInputState(true);
  setStreamingState(true);

  // إعداد الطلب
  const requestMessages = [
    { role: 'system', content: SYSTEM_PROMPT },
    ...messages
      .filter((m) => m.role !== 'system' && (m.role === 'user' || m.content.trim()))
      .slice(-30)
      .map((m) => ({ role: m.role, content: m.content })),
  ];

  abortController = new AbortController();

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'glm-4-plus',
        messages: requestMessages,
        stream: true,
        temperature: 0.7,
      }),
      signal: abortController.signal,
    });

    if (!response.ok) {
      const errText = await response.text().catch(() => '');
      let errMsg = `خطأ ${response.status}`;
      try {
        const errJson = JSON.parse(errText);
        errMsg = errJson.error?.message || errJson.message || errMsg;
      } catch {}
      throw new Error(errMsg);
    }

    if (!response.body) {
      throw new Error('استجابة فارغة من الخادم.');
    }

    // قراءة البث
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';
    let fullText = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        const trimmedLine = line.trim();
        if (!trimmedLine || !trimmedLine.startsWith('data:')) continue;

        const dataStr = trimmedLine.slice(5).trim();
        if (!dataStr || dataStr === '[DONE]') continue;

        try {
          const data = JSON.parse(dataStr);
          const delta = data.choices?.[0]?.delta?.content || '';
          if (delta) {
            fullText += delta;
            // تحديث رسالة المساعد
            aiMsg.content = fullText;
            updateMessageContent(aiMsg.id, fullText, true);
            scrollToBottom();
          }
        } catch (e) {
          // تجاهل الأسطر التالفة
        }
      }
    }

    // إكمال الرسالة
    aiMsg.content = fullText || 'مرحبًا! أنا Zaza Al، جاهز لمساعدتك. كيف يمكنني خدمتك؟';
    aiMsg.streaming = false;
    updateMessageContent(aiMsg.id, aiMsg.content, false);

  } catch (err) {
    if (err.name === 'AbortError') {
      // المستخدم أوقف البث
      aiMsg.content = aiMsg.content || '(تم الإيقاف)';
      aiMsg.streaming = false;
      updateMessageContent(aiMsg.id, aiMsg.content, false);
    } else {
      console.error('خطأ:', err);
      aiMsg.content = `⚠️ حدث خطأ: ${err.message}\n\nحاول مرة أخرى أو تحقق من مفتاح API.`;
      aiMsg.streaming = false;
      updateMessageContent(aiMsg.id, aiMsg.content, false);
      alert(`خطأ: ${err.message}`);
    }
  } finally {
    setStreamingState(false);
    setInputState(false);
    saveConversation();
    abortController = null;
    els.input.focus();
  }
}

/* --------- حالات الواجهة --------- */
function setStreamingState(streaming) {
  isStreaming = streaming;
  if (streaming) {
    els.sendBtn.classList.add('stop');
    els.sendIcon.classList.add('hidden');
    els.stopIcon.classList.remove('hidden');
    els.statusDot.classList.add('busy');
    els.statusText.textContent = 'يكتب الآن…';
  } else {
    els.sendBtn.classList.remove('stop');
    els.sendIcon.classList.remove('hidden');
    els.stopIcon.classList.add('hidden');
    els.statusDot.classList.remove('busy');
    els.statusText.textContent = 'جاهز للدردشة';
  }
}

function setInputState(disabled) {
  els.input.disabled = disabled && !els.input.value;
  els.sendBtn.disabled = disabled ? false : !els.input.value.trim();
}

function stopStreaming() {
  if (abortController) {
    abortController.abort();
  }
}

/* --------- محادثة جديدة --------- */
function newChat() {
  if (isStreaming) stopStreaming();
  messages = [];
  saveConversation();
  renderMessages();
  els.input.value = '';
  autoResize();
  closeSidebar();
}

/* --------- الإدخال --------- */
function autoResize() {
  els.input.style.height = 'auto';
  els.input.style.height = Math.min(els.input.scrollHeight, 200) + 'px';
}

els.input.addEventListener('input', () => {
  autoResize();
  els.sendBtn.disabled = isStreaming ? false : !els.input.value.trim();
});

els.input.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent?.isComposing) {
    e.preventDefault();
    if (isStreaming) return;
    const text = els.input.value;
    els.input.value = '';
    autoResize();
    sendMessage(text);
  }
});

els.sendBtn.addEventListener('click', () => {
  if (isStreaming) {
    stopStreaming();
  } else {
    const text = els.input.value;
    els.input.value = '';
    autoResize();
    sendMessage(text);
  }
});

/* --------- الأزرار --------- */
els.themeBtn.addEventListener('click', toggleTheme);
els.clearBtn.addEventListener('click', newChat);
els.newChatBtn.addEventListener('click', newChat);
els.menuBtn.addEventListener('click', () => {
  els.sidebar.classList.toggle('open');
});

function closeSidebar() {
  els.sidebar.classList.remove('open');
}

/* --------- الاقتراحات --------- */
document.querySelectorAll('.suggestion').forEach((btn) => {
  btn.addEventListener('click', () => {
    const prompt = btn.dataset.prompt;
    sendMessage(prompt);
  });
});

/* --------- مودال إعداد المفتاح --------- */
function openSetupModal() {
  els.apiKeyInput.value = getApiKey();
  els.setupModal.classList.remove('hidden');
  setTimeout(() => els.apiKeyInput.focus(), 100);
}

function closeSetupModal() {
  els.setupModal.classList.add('hidden');
}

els.saveKeyBtn.addEventListener('click', () => {
  const key = els.apiKeyInput.value.trim();
  if (!key) {
    alert('الرجاء إدخال مفتاح API صالح.');
    return;
  }
  setApiKey(key);
  closeSetupModal();
  // إعادة إرسال آخر رسالة مستخدم إن وجدت
  if (messages.length > 0) {
    const lastUser = [...messages].reverse().find((m) => m.role === 'user');
    if (lastUser) {
      // إزالة آخر رسالة مساعد فارغة إن وجدت
      const lastMsg = messages[messages.length - 1];
      if (lastMsg.role === 'assistant' && lastMsg.content === '') {
        messages.pop();
      }
      renderMessages();
      sendMessage(lastUser.content);
    }
  }
});

els.skipKeyBtn.addEventListener('click', closeSetupModal);
els.settingsBtn.addEventListener('click', openSetupModal);

els.setupModal.addEventListener('click', (e) => {
  if (e.target === els.setupModal) closeSetupModal();
});

/* --------- التهيئة --------- */
function init() {
  loadTheme();

  // إعداد Markdown
  if (typeof marked !== 'undefined') {
    marked.setOptions({ breaks: true, gfm: true });
  }

  // تحميل المحادثة المحفوظة
  messages = loadConversation();
  renderMessages();

  // التحقق من مفتاح API
  if (!getApiKey()) {
    openSetupModal();
  }

  // تركيز الإدخال
  els.input.focus();

  console.log('✨ Zaza Al جاهز!');
}

// تشغيل عند تحميل الصفحة
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
