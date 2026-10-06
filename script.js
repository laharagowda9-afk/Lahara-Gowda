/**
 * ALEX MORGAN PORTFOLIO - JAVASCRIPT LOGIC
 * Features:
 *  - Interactive Career Timeline (Filtering, Searching, Sorting, Expand/Collapse Accordions)
 *  - Scroll-triggered Timeline Spine Progress Bar
 *  - Skills Category Filter
 *  - Dark / Light Theme Switcher with Persistence
 *  - ScrollSpy Navigation & Mobile Menu Toggle
 *  - Interactive Contact Form with Validation
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize all modular components
  initTheme();
  initNavigation();
  initAvatarSwitcher();
  initSkillsFilter();
  initTimeline();
  initTestimonialsFilter();
  initContactForm();
});

/* ==========================================================================
   1. THEME SWITCHER (Dark / Light Mode)
   ========================================================================== */
function initTheme() {
  const themeToggle = document.getElementById('themeToggle');
  const body = document.body;

  // Retrieve saved preference or default to dark
  const savedTheme = localStorage.getItem('portfolio-theme') || 'dark';
  body.setAttribute('data-theme', savedTheme);

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const currentTheme = body.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      body.setAttribute('data-theme', newTheme);
      localStorage.setItem('portfolio-theme', newTheme);
    });
  }
}

/* ==========================================================================
   2. NAVIGATION, MOBILE MENU & SCROLLSPY
   ========================================================================== */
function initNavigation() {
  const mobileToggle = document.getElementById('mobileToggle');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  // Mobile menu toggle
  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      const isExpanded = mobileToggle.getAttribute('aria-expanded') === 'true';
      mobileToggle.setAttribute('aria-expanded', !isExpanded);
      navMenu.classList.toggle('active');
    });

    // Close mobile menu when a nav link is clicked
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        mobileToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // ScrollSpy: highlight active link based on scroll position
  window.addEventListener('scroll', () => {
    let scrollY = window.pageYOffset + 120;

    sections.forEach(section => {
      const sectionHeight = section.offsetHeight;
      const sectionTop = section.offsetTop;
      const sectionId = section.getAttribute('id');

      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }, { passive: true });
}

/* ==========================================================================
   2.5. AVATAR SWITCHER (Photo / Pixel Art Toggle)
   ========================================================================== */
function initAvatarSwitcher() {
  const photoBtn = document.getElementById('showPhotoBtn');
  const pixelBtn = document.getElementById('showPixelBtn');
  const photoFrame = document.getElementById('photoAvatarFrame');
  const pixelFrame = document.getElementById('pixelAvatarFrame');

  if (photoBtn && pixelBtn && photoFrame && pixelFrame) {
    photoBtn.addEventListener('click', () => {
      photoBtn.classList.add('active');
      photoBtn.setAttribute('aria-pressed', 'true');
      pixelBtn.classList.remove('active');
      pixelBtn.setAttribute('aria-pressed', 'false');

      photoFrame.classList.add('active');
      pixelFrame.classList.remove('active');
    });

    pixelBtn.addEventListener('click', () => {
      pixelBtn.classList.add('active');
      pixelBtn.setAttribute('aria-pressed', 'true');
      photoBtn.classList.remove('active');
      photoBtn.setAttribute('aria-pressed', 'false');

      pixelFrame.classList.add('active');
      photoFrame.classList.remove('active');
    });
  }
}

/* ==========================================================================
   3. SKILLS SECTION FILTER
   ========================================================================== */
function initSkillsFilter() {
  const tabs = document.querySelectorAll('.skill-tab');
  const skillCards = document.querySelectorAll('.skill-card');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');

      const filter = tab.getAttribute('data-filter');

      skillCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.style.display = 'block';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 10);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(10px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 200);
        }
      });
    });
  });
}

/* ==========================================================================
   4. INTERACTIVE CAREER MILESTONES TIMELINE (MAIN FEATURE)
   ========================================================================== */
function initTimeline() {
  const filterButtons = document.querySelectorAll('.t-filter-btn');
  const timelineItems = Array.from(document.querySelectorAll('.timeline-item'));
  const itemsWrapper = document.getElementById('timelineItemsWrapper');
  const emptyState = document.getElementById('timelineEmptyState');
  const resetBtn = document.getElementById('resetTimelineFiltersBtn');
  const searchInput = document.getElementById('milestoneSearch');
  const clearSearchBtn = document.getElementById('clearSearchBtn');
  const sortToggleBtn = document.getElementById('sortToggleBtn');
  const sortLabel = document.getElementById('sortLabel');
  const expandAllBtn = document.getElementById('expandAllBtn');
  const expandLabel = document.getElementById('expandLabel');
  const spineProgress = document.getElementById('timelineProgress');
  const timelineComponent = document.getElementById('timelineComponent');

  let currentCategory = 'all';
  let searchQuery = '';
  let isSortNewest = true; // true = 2024 to 2019, false = 2019 to 2024
  let allExpanded = false;

  // Filter Button Clicks
  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentCategory = btn.getAttribute('data-category');
      applyFilters();
    });
  });

  // Search Input live typing
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value.trim().toLowerCase();
      if (clearSearchBtn) {
        clearSearchBtn.style.display = searchQuery ? 'flex' : 'none';
      }
      applyFilters();
    });

    if (clearSearchBtn) {
      clearSearchBtn.addEventListener('click', () => {
        searchInput.value = '';
        searchQuery = '';
        clearSearchBtn.style.display = 'none';
        applyFilters();
        searchInput.focus();
      });
    }
  }

  // Reset Filters Button
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      currentCategory = 'all';
      searchQuery = '';
      if (searchInput) searchInput.value = '';
      if (clearSearchBtn) clearSearchBtn.style.display = 'none';

      filterButtons.forEach(b => {
        if (b.getAttribute('data-category') === 'all') b.classList.add('active');
        else b.classList.remove('active');
      });

      applyFilters();
    });
  }

  // Sorting Toggle (Newest First vs Oldest First)
  if (sortToggleBtn) {
    sortToggleBtn.addEventListener('click', () => {
      isSortNewest = !isSortNewest;
      sortLabel.textContent = isSortNewest ? 'Newest First' : 'Oldest First';
      sortToggleBtn.setAttribute('aria-label', `Sort Order: ${sortLabel.textContent}`);

      const sortedItems = [...timelineItems].sort((a, b) => {
        const orderA = parseInt(a.getAttribute('data-order'), 10);
        const orderB = parseInt(b.getAttribute('data-order'), 10);
        return isSortNewest ? orderA - orderB : orderB - orderA;
      });

      sortedItems.forEach(item => itemsWrapper.appendChild(item));
      updateScrollProgress();
    });
  }

  // Expand / Collapse All Toggle
  if (expandAllBtn) {
    expandAllBtn.addEventListener('click', () => {
      allExpanded = !allExpanded;
      expandLabel.textContent = allExpanded ? 'Collapse All' : 'Expand All';

      const toggleButtons = document.querySelectorAll('.details-toggle-btn');
      toggleButtons.forEach(btn => {
        const panelId = btn.getAttribute('aria-controls');
        const panel = document.getElementById(panelId);
        btn.setAttribute('aria-expanded', allExpanded);
        if (panel) {
          panel.hidden = !allExpanded;
        }
      });
      updateScrollProgress();
    });
  }

  // Individual Card Accordion Toggle
  const detailsToggles = document.querySelectorAll('.details-toggle-btn');
  detailsToggles.forEach(btn => {
    btn.addEventListener('click', () => {
      const isExpanded = btn.getAttribute('aria-expanded') === 'true';
      const panelId = btn.getAttribute('aria-controls');
      const panel = document.getElementById(panelId);

      btn.setAttribute('aria-expanded', !isExpanded);
      if (panel) {
        panel.hidden = isExpanded;
      }
      setTimeout(updateScrollProgress, 100);
    });
  });

  // Main Filter & Search function
  function applyFilters() {
    let visibleCount = 0;

    timelineItems.forEach(item => {
      const itemCategory = item.getAttribute('data-category');
      const itemText = item.textContent.toLowerCase();

      const matchesCategory = currentCategory === 'all' || itemCategory === currentCategory;
      const matchesSearch = !searchQuery || itemText.includes(searchQuery);

      if (matchesCategory && matchesSearch) {
        item.classList.remove('is-filtered-out');
        visibleCount++;
      } else {
        item.classList.add('is-filtered-out');
      }
    });

    // Toggle Empty State
    if (emptyState) {
      emptyState.style.display = visibleCount === 0 ? 'block' : 'none';
    }

    setTimeout(updateScrollProgress, 50);
  }

  // Dynamic Spine Scroll Fill
  function updateScrollProgress() {
    if (!spineProgress || !timelineComponent) return;

    const rect = timelineComponent.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    const componentTop = rect.top;
    const componentHeight = rect.height;

    // Calculate percentage traversed
    if (componentTop > windowHeight) {
      spineProgress.style.height = '0%';
    } else if (componentTop + componentHeight < windowHeight / 2) {
      spineProgress.style.height = '100%';
    } else {
      const scrolled = windowHeight - componentTop - 150;
      const pct = Math.min(100, Math.max(0, (scrolled / componentHeight) * 100));
      spineProgress.style.height = `${pct}%`;
    }
  }

  window.addEventListener('scroll', updateScrollProgress, { passive: true });
  window.addEventListener('resize', updateScrollProgress);
  updateScrollProgress();
}

/* ==========================================================================
   5. TESTIMONIALS CATEGORY FILTER
   ========================================================================== */
function initTestimonialsFilter() {
  const filterPills = document.querySelectorAll('.t-pill-btn');
  const testimonialCards = document.querySelectorAll('.testimonial-card');

  filterPills.forEach(pill => {
    pill.addEventListener('click', () => {
      filterPills.forEach(p => {
        p.classList.remove('active');
        p.setAttribute('aria-selected', 'false');
      });
      pill.classList.add('active');
      pill.setAttribute('aria-selected', 'true');

      const filter = pill.getAttribute('data-filter');

      testimonialCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.classList.remove('is-filtered-out');
        } else {
          card.classList.add('is-filtered-out');
        }
      });
    });
  });
}

/* ==========================================================================
   6. CONTACT FORM INTERACTION
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('contactForm');
  const feedback = document.getElementById('formFeedback');

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('contactName').value.trim();

      if (feedback) {
        feedback.className = 'form-feedback success';
        feedback.innerHTML = `<strong>Thank you, ${name || 'friend'}!</strong> Your message has been received. I’ll get back to you shortly.`;
        feedback.style.display = 'block';

        form.reset();

        setTimeout(() => {
          feedback.style.display = 'none';
        }, 6000);
      }
    });
  }
}
