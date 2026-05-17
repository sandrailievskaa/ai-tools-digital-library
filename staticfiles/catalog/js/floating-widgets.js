/* =========================================================
   Floating Widgets — FAQ Chat Bot + Human Avatar
   Fixed in bottom-right corner, stacked vertically.
   Click to open/close each panel.
   ========================================================= */
(function () {
  "use strict";

  /* ── FAQ DATA ─────────────────────────────────────────── */
  var FAQ_CATEGORIES = [
    {
      id: "general",
      label: "About this Library",
      icon: "📚",
      questions: [
        {
          q: "What is the Digital Library of AI Tools?",
          a: "This is a curated catalog of AI tools and tutorials. You can browse by category, filter by type or difficulty, search for specific tools, save your favorites, and explore usage tutorials — all in one place."
        },
        {
          q: "How do I save a tool to favorites?",
          a: "Click the heart icon (♡) on any tool card to save it. Your favorites are stored in your session and you can view them anytime from the sidebar or by clicking the bookmark icon in the top navigation."
        },
        {
          q: "How do I search for a specific tool?",
          a: "Use the search bar at the top of the page. It searches across tool names, descriptions, categories, tags, and keywords in real-time as you type."
        },
        {
          q: "Can I filter tools by category?",
          a: "Yes! Use the filters panel on the left side of the catalog. You can filter by Category (e.g. Design Tools, Development Tools), AI Type, Difficulty level, and Tags."
        },
        {
          q: "What is the Dashboard?",
          a: "The Dashboard shows visual analytics about the catalog — charts of tools per category, AI types, difficulty distribution, and lists of the most popular and bookmarked tools."
        }
      ]
    },
    {
      id: "categories",
      label: "Tool Categories",
      icon: "🗂️",
      questions: [
        {
          q: "What categories of AI tools are available?",
          a: "The library covers 8 main categories: General AI (ChatGPT, Claude), Creative AI (Midjourney, DALL·E, Leonardo AI), Design Tools (Figma AI, Uizard), Development Tools (Cursor AI, Lovable AI, Framer AI), Productivity (Notion AI, Gamma AI, Tome AI), Content Creation (Copy.ai, Jasper AI), Media AI (Runway ML, Pictory AI, Synthesia), and Research Tools (Perplexity AI)."
        },
        {
          q: "What are the best tools for image generation?",
          a: "For image generation, the library features Midjourney (best for artistic, high-quality images from text prompts), DALL·E (OpenAI's system for versatile image creation), and Leonardo AI (great for game assets and stylized illustrations). All are in the Creative AI category."
        },
        {
          q: "Which tools are best for coding and development?",
          a: "Check the Development Tools category: Cursor AI is an AI-powered code editor for generating and refactoring code, Lovable AI generates full-stack web apps from plain language prompts, and Framer AI builds landing pages instantly."
        },
        {
          q: "What tools help with productivity and writing?",
          a: "The Productivity category includes Notion AI (writing + organization), Gamma AI (instant presentations and docs), Tome AI (AI storytelling for slides), and Beautiful.ai (smart slide design). For writing specifically, Content Creation has Copy.ai and Jasper AI."
        },
        {
          q: "Are there tools for video and media creation?",
          a: "Yes — the Media AI category has Runway ML (AI video editing and generation), Pictory AI (turns text into short videos automatically), and Synthesia (AI avatar video creation for presentations and courses)."
        }
      ]
    },
    {
      id: "tools",
      label: "Specific Tools",
      icon: "🛠️",
      questions: [
        {
          q: "What is Cursor AI and how does it work?",
          a: "Cursor AI is an AI-powered code editor built on VSCode. It uses AI to help you generate, refactor, and debug code through chat and inline suggestions. You can find its full detail page in the Development Tools category."
        },
        {
          q: "What is Midjourney used for?",
          a: "Midjourney is an AI tool that generates stunning, artistic images from text descriptions (prompts). It's especially popular for concept art, illustration, and creative exploration. It's in the Creative AI category."
        },
        {
          q: "What's the difference between ChatGPT and Claude AI?",
          a: "Both are in the General AI category. ChatGPT (by OpenAI) excels at a wide range of writing, coding, and problem-solving tasks. Claude AI (by Anthropic) is known for long-context reasoning, careful analysis, and nuanced writing. Both are excellent general-purpose AI assistants."
        },
        {
          q: "What is Perplexity AI?",
          a: "Perplexity AI is an AI-powered search engine that gives real-time, cited answers to questions — like a combination of a search engine and a chatbot. It's in the Research Tools category and is great for fact-checking and research."
        },
        {
          q: "What is Synthesia?",
          a: "Synthesia is a platform for creating AI avatar videos — you type a script and an AI-generated presenter delivers it on screen. It's widely used for training videos, product demos, and corporate content without needing a camera or studio."
        }
      ]
    },
    {
      id: "howto",
      label: "How to Use the Library",
      icon: "💡",
      questions: [
        {
          q: "How do I view tool tutorials?",
          a: "Go to the Tutorials page from the sidebar or top navigation. Tutorials are linked to specific tools and walk you through how to get started with each tool."
        },
        {
          q: "How do I switch between grid and list view?",
          a: "In the catalog, look for the ▦ / ☰ toggle buttons in the top-right area of the tools grid. Click ▦ for grid view and ☰ for list view. Your preference is saved in your browser."
        },
        {
          q: "How do I clear all active filters?",
          a: "When filters are active, you'll see a row of blue 'active filter' chips above the results. Click 'Clear all' at the end of that row, or click any individual chip to remove just that filter."
        },
        {
          q: "What is the 'Recently viewed' section?",
          a: "The 'Recently viewed' panel in the left sidebar automatically tracks the last 8 tool detail pages you've visited, so you can jump back to them quickly. It's stored in your browser locally."
        },
        {
          q: "How do I switch between dark and light mode?",
          a: "Click the 🌙 (moon) icon in the top navigation to switch to dark mode, or ☀️ (sun) to go back to light mode. Your theme preference is saved in a cookie so it persists across visits."
        }
      ]
    }
  ];

  /* ── AVATAR TIPS ──────────────────────────────────────── */
  var AVATAR_MESSAGES = [
    "👋 Need help finding the right AI tool?",
    "💡 Try filtering by category in the sidebar!",
    "❤️ Save tools to favorites to build your collection.",
    "🔍 Search across names, tags, and descriptions.",
    "📊 Check the Dashboard for catalog analytics.",
    "🎨 Explore Creative AI for image generation tools.",
    "💻 Development Tools has great coding assistants.",
    "📚 Tutorials section has step-by-step guides."
  ];

  /* ── HELPERS ──────────────────────────────────────────── */
  function getUrls() {
    var cfg = document.getElementById("app-config");
    var indexUrl     = (cfg && cfg.getAttribute("data-catalog-index"))   || "/";
    var dashUrl      = (cfg && cfg.getAttribute("data-dashboard-url"))   || "/dashboard/";
    var tutorialsUrl = (cfg && cfg.getAttribute("data-tutorials-url"))   || "/tutorials/";
    var favsUrl      = indexUrl + "?favorites=1";
    return { indexUrl: indexUrl, dashUrl: dashUrl, tutorialsUrl: tutorialsUrl, favsUrl: favsUrl };
  }

  /* ── CREATE STACK WRAPPER ─────────────────────────────── */
  function createStack() {
    var stack = document.createElement("div");
    stack.id = "fw-widgets-stack";
    document.body.appendChild(stack);
    return stack;
  }

  /* ── BUILD FAQ CHAT ───────────────────────────────────── */
  function buildFaqChat(stack) {
    var wrap = document.createElement("div");
    wrap.id = "fw-chat-widget";
    wrap.className = "fw-widget";
    wrap.innerHTML = [
      '<button class="fw-fab fw-fab-chat" id="fw-chat-btn" title="AI Assistant FAQ" aria-label="Open FAQ chat">',
      '  <span class="fw-fab-icon">',
      '    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">',
      '      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>',
      '    </svg>',
      '  </span>',
      '</button>',
      '<div class="fw-panel fw-chat-panel" id="fw-chat-panel" role="dialog" aria-modal="true" aria-label="FAQ Assistant">',
      '  <div class="fw-panel-header">',
      '    <div class="fw-panel-avatar">',
      '      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>',
      '    </div>',
      '    <div>',
      '      <div class="fw-panel-title">AI Library Assistant</div>',
      '      <div class="fw-panel-subtitle">Ask me anything about the catalog</div>',
      '    </div>',
      '    <button class="fw-close-btn" id="fw-chat-close" aria-label="Close">',
      '      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 6L6 18M6 6l12 12"/></svg>',
      '    </button>',
      '  </div>',
      '  <div class="fw-chat-body" id="fw-chat-body">',
      '    <div class="fw-chat-bubble fw-bubble-bot">',
      '      <p>Hello! 👋 I\'m your AI Library assistant. I can answer questions about tools, categories, and how to use this catalog.</p>',
      '      <p>Choose a topic below to get started:</p>',
      '    </div>',
      '    <div class="fw-faq-categories" id="fw-faq-cats"></div>',
      '    <div class="fw-faq-questions d-none" id="fw-faq-qs"></div>',
      '  </div>',
      '  <div class="fw-chat-footer">',
      '    <button class="fw-back-btn d-none" id="fw-back-btn">← Back to topics</button>',
      '    <span class="fw-chat-hint">Tap a question to see the answer</span>',
      '  </div>',
      '</div>'
    ].join("\n");

    stack.appendChild(wrap);

    var catsEl   = document.getElementById("fw-faq-cats");
    var qsEl     = document.getElementById("fw-faq-qs");
    var backBtn  = document.getElementById("fw-back-btn");
    var chatBody = document.getElementById("fw-chat-body");
    var panel    = document.getElementById("fw-chat-panel");
    var chatBtn  = document.getElementById("fw-chat-btn");

    /* Render category buttons */
    FAQ_CATEGORIES.forEach(function (cat) {
      var btn = document.createElement("button");
      btn.className = "fw-cat-btn";
      btn.innerHTML = '<span class="fw-cat-icon">' + cat.icon + '</span><span>' + cat.label + '</span>';
      btn.addEventListener("click", function () { showQuestions(cat); });
      catsEl.appendChild(btn);
    });

    function showQuestions(cat) {
      catsEl.classList.add("d-none");
      qsEl.classList.remove("d-none");
      backBtn.classList.remove("d-none");
      qsEl.innerHTML = '<div class="fw-qs-header">' + cat.icon + ' ' + cat.label + '</div>';
      cat.questions.forEach(function (item) {
        var qBtn = document.createElement("button");
        qBtn.className = "fw-q-btn";
        qBtn.textContent = item.q;
        qBtn.addEventListener("click", function () { showAnswer(cat, item); });
        qsEl.appendChild(qBtn);
      });
      chatBody.scrollTop = 0;
    }

    function showAnswer(cat, item) {
      qsEl.classList.add("d-none");
      var answerEl = document.createElement("div");
      answerEl.className = "fw-faq-answer";
      answerEl.innerHTML = [
        '<div class="fw-chat-bubble fw-bubble-user">' + item.q + '</div>',
        '<div class="fw-chat-bubble fw-bubble-bot fw-bubble-typing" id="fw-typing">',
        '  <span class="fw-dot"></span><span class="fw-dot"></span><span class="fw-dot"></span>',
        '</div>'
      ].join("");
      chatBody.appendChild(answerEl);
      chatBody.scrollTop = chatBody.scrollHeight;

      setTimeout(function () {
        var typingEl = answerEl.querySelector("#fw-typing");
        if (typingEl) {
          typingEl.className = "fw-chat-bubble fw-bubble-bot";
          typingEl.removeAttribute("id");
          typingEl.textContent = item.a;
          chatBody.scrollTop = chatBody.scrollHeight;
        }
        var moreBtn = document.createElement("button");
        moreBtn.className = "fw-more-btn";
        moreBtn.textContent = "Ask another question";
        moreBtn.addEventListener("click", function () {
          answerEl.remove();
          moreBtn.remove();
          showQuestions(cat);
        });
        chatBody.appendChild(moreBtn);
        chatBody.scrollTop = chatBody.scrollHeight;
      }, 900);
    }

    backBtn.addEventListener("click", function () {
      chatBody.querySelectorAll(".fw-faq-answer, .fw-more-btn").forEach(function (el) { el.remove(); });
      qsEl.classList.add("d-none");
      catsEl.classList.remove("d-none");
      backBtn.classList.add("d-none");
      chatBody.scrollTop = 0;
    });

    chatBtn.addEventListener("click", function () {
      var isOpen = panel.classList.toggle("fw-panel-open");
      chatBtn.classList.toggle("fw-fab-active", isOpen);
      // Close avatar panel if open
      var avatarPanel = document.getElementById("fw-avatar-panel");
      if (avatarPanel) {
        avatarPanel.classList.remove("fw-panel-open");
        var avatarBtn = document.getElementById("fw-avatar-btn");
        if (avatarBtn) avatarBtn.classList.remove("fw-fab-active");
      }
    });

    document.getElementById("fw-chat-close").addEventListener("click", function () {
      panel.classList.remove("fw-panel-open");
      chatBtn.classList.remove("fw-fab-active");
    });
  }

  /* ── BUILD AVATAR ─────────────────────────────────────── */
  function buildAvatar(stack) {
    var urls = getUrls();

    var wrap = document.createElement("div");
    wrap.id = "fw-avatar-widget";
    wrap.className = "fw-widget";

    wrap.innerHTML = [
      '<button class="fw-fab fw-fab-avatar" id="fw-avatar-btn" title="Your Library Guide" aria-label="Open guide">',
      '  <span class="fw-avatar-face" aria-hidden="true">',
      '    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" width="36" height="36">',
      '      <circle cx="24" cy="18" r="11" fill="#FBBF24" stroke="#F59E0B" stroke-width="1.5"/>',
      '      <path d="M13.5 14 C13 8 17 5 24 5 C31 5 35 8 34.5 14" fill="#1e293b"/>',
      '      <circle cx="20" cy="17" r="1.8" fill="#1e293b"/>',
      '      <circle cx="28" cy="17" r="1.8" fill="#1e293b"/>',
      '      <circle cx="20.6" cy="16.4" r="0.6" fill="white"/>',
      '      <circle cx="28.6" cy="16.4" r="0.6" fill="white"/>',
      '      <path d="M20 22 Q24 26 28 22" stroke="#92400e" stroke-width="1.5" fill="none" stroke-linecap="round"/>',
      '      <path d="M12 48 L12 36 Q12 28 24 28 Q36 28 36 36 L36 48Z" fill="#3b82f6"/>',
      '      <path d="M24 28 L20 35 L24 33 L28 35 Z" fill="white"/>',
      '    </svg>',
      '  </span>',
      '  <span class="fw-avatar-pulse" aria-hidden="true"></span>',
      '</button>',
      '<div class="fw-panel fw-avatar-panel" id="fw-avatar-panel" role="dialog" aria-modal="true" aria-label="Library Guide">',
      '  <div class="fw-panel-header">',
      '    <div class="fw-avatar-panel-face">',
      '      <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" width="26" height="26">',
      '        <circle cx="24" cy="18" r="11" fill="#FBBF24" stroke="#F59E0B" stroke-width="1.5"/>',
      '        <path d="M13.5 14 C13 8 17 5 24 5 C31 5 35 8 34.5 14" fill="#1e293b"/>',
      '        <circle cx="20" cy="17" r="1.8" fill="#1e293b"/>',
      '        <circle cx="28" cy="17" r="1.8" fill="#1e293b"/>',
      '        <path d="M20 22 Q24 26 28 22" stroke="#92400e" stroke-width="1.5" fill="none" stroke-linecap="round"/>',
      '      </svg>',
      '    </div>',
      '    <div>',
      '      <div class="fw-panel-title">Alex — Your Guide</div>',
      '      <div class="fw-panel-subtitle">Here to help you explore</div>',
      '    </div>',
      '    <button class="fw-close-btn" id="fw-avatar-close" aria-label="Close">',
      '      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 6L6 18M6 6l12 12"/></svg>',
      '    </button>',
      '  </div>',
      '  <div class="fw-avatar-body">',
      '    <div class="fw-avatar-tip" id="fw-avatar-tip"></div>',
      '    <div class="fw-avatar-nav">',
      '      <button class="fw-tip-nav" id="fw-tip-prev" aria-label="Previous tip">&#8592;</button>',
      '      <span class="fw-tip-dots" id="fw-tip-dots"></span>',
      '      <button class="fw-tip-nav" id="fw-tip-next" aria-label="Next tip">&#8594;</button>',
      '    </div>',
      '    <div class="fw-avatar-actions">',
      '      <a href="' + urls.indexUrl     + '" class="fw-action-chip js-catalog-nav">Browse Catalog</a>',
      '      <a href="' + urls.favsUrl      + '" class="fw-action-chip js-catalog-nav">My Favorites</a>',
      '      <a href="' + urls.dashUrl      + '" class="fw-action-chip">Dashboard</a>',
      '      <a href="' + urls.tutorialsUrl + '" class="fw-action-chip">Tutorials</a>',
      '    </div>',
      '  </div>',
      '</div>'
    ].join("\n");

    stack.appendChild(wrap);

    var tipEl      = document.getElementById("fw-avatar-tip");
    var dotsEl     = document.getElementById("fw-tip-dots");
    var panel      = document.getElementById("fw-avatar-panel");
    var avatarBtn  = document.getElementById("fw-avatar-btn");
    var currentTip = 0;
    var tipTimer   = null;

    function renderDots() {
      dotsEl.innerHTML = "";
      AVATAR_MESSAGES.forEach(function (_, i) {
        var d = document.createElement("span");
        d.className = "fw-tip-dot" + (i === currentTip ? " active" : "");
        d.addEventListener("click", function () { goTo(i); });
        dotsEl.appendChild(d);
      });
    }

    function goTo(idx) {
      currentTip = (idx + AVATAR_MESSAGES.length) % AVATAR_MESSAGES.length;
      tipEl.style.opacity = "0";
      tipEl.style.transform = "translateY(5px)";
      setTimeout(function () {
        tipEl.textContent = AVATAR_MESSAGES[currentTip];
        tipEl.style.opacity = "1";
        tipEl.style.transform = "translateY(0)";
        renderDots();
      }, 180);
    }

    goTo(0);

    document.getElementById("fw-tip-prev").addEventListener("click", function () { goTo(currentTip - 1); });
    document.getElementById("fw-tip-next").addEventListener("click", function () { goTo(currentTip + 1); });

    avatarBtn.addEventListener("click", function () {
      var isOpen = panel.classList.toggle("fw-panel-open");
      avatarBtn.classList.toggle("fw-fab-active", isOpen);
      if (isOpen) {
        tipTimer = setInterval(function () { goTo(currentTip + 1); }, 5000);
      } else {
        clearInterval(tipTimer);
      }
      // Close chat panel if open
      var chatPanel = document.getElementById("fw-chat-panel");
      if (chatPanel) {
        chatPanel.classList.remove("fw-panel-open");
        var chatBtn = document.getElementById("fw-chat-btn");
        if (chatBtn) chatBtn.classList.remove("fw-fab-active");
      }
    });

    document.getElementById("fw-avatar-close").addEventListener("click", function () {
      panel.classList.remove("fw-panel-open");
      avatarBtn.classList.remove("fw-fab-active");
      clearInterval(tipTimer);
    });

    /* Tooltip bubble */
    function showBubble() {
      var existing = wrap.querySelector(".fw-avatar-tooltip");
      if (existing || panel.classList.contains("fw-panel-open")) return;
      var bubble = document.createElement("span");
      bubble.className = "fw-avatar-tooltip";
      bubble.textContent = AVATAR_MESSAGES[Math.floor(Math.random() * AVATAR_MESSAGES.length)];
      wrap.appendChild(bubble);
      setTimeout(function () { bubble.classList.add("fw-tooltip-visible"); }, 50);
      setTimeout(function () {
        bubble.classList.remove("fw-tooltip-visible");
        setTimeout(function () { if (bubble.parentNode) bubble.parentNode.removeChild(bubble); }, 400);
      }, 3500);
    }

    setTimeout(function () {
      showBubble();
      setInterval(showBubble, 20000);
    }, 3000);
  }

  /* ── INIT ─────────────────────────────────────────────── */
  function init() {
    var stack = createStack();
    buildFaqChat(stack);
    buildAvatar(stack);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
