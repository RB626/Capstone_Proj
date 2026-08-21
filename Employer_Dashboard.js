let selectedJobType = "all";

function setJobTypeFilter(type) {
  selectedJobType = type;
  filterJobItems();
}

let activeNotificationFilter = 'all';

function toggleNotificationPanel(event) {
  if (event) {
    event.preventDefault();
    event.stopPropagation();
  }

  const panel = document.getElementById('notificationPanel');
  const button = document.getElementById('notificationButton');
  const avatarDropdown = document.getElementById('avatarDropdown');

  if (!panel) return;

  const willOpen = !panel.classList.contains('open');

  panel.classList.toggle('open', willOpen);
  panel.setAttribute('aria-hidden', String(!willOpen));
  button?.setAttribute('aria-expanded', String(willOpen));

  // Avoid overlapping dropdowns.
  avatarDropdown?.classList.remove('open');

  document.getElementById('languageMenu')?.classList.remove('open');
  document.getElementById('languageChevron')?.classList.remove('open');
}

function closeNotificationPanel() {
  const panel = document.getElementById('notificationPanel');
  const button = document.getElementById('notificationButton');

  panel?.classList.remove('open');
  panel?.setAttribute('aria-hidden', 'true');
  button?.setAttribute('aria-expanded', 'false');
}

function setNotificationFilter(filter, button) {
  activeNotificationFilter = filter;

  document.querySelectorAll('.notification-tab').forEach(tab => {
    tab.classList.toggle('active', tab === button);
  });

  document.querySelectorAll('.job-notification-item').forEach(item => {
    const isUnread = item.dataset.unread === 'true';

    item.hidden =
      filter === 'unread' &&
      !isUnread;
  });

  updateNotificationSectionVisibility();
}

function updateNotificationSectionVisibility() {
  document.querySelectorAll('.notification-section').forEach(section => {
    const visibleItems = Array.from(
      section.querySelectorAll('.job-notification-item')
    ).filter(item => !item.hidden);

    section.hidden = visibleItems.length === 0;
  });

  const list = document.getElementById('notificationList');

  if (!list) return;

  const visibleItems = Array.from(
    list.querySelectorAll('.job-notification-item')
  ).filter(item => !item.hidden);

  let empty = list.querySelector('.notification-filter-empty');

  if (!visibleItems.length) {
    if (!empty) {
      empty = document.createElement('div');
      empty.className = 'notification-filter-empty';
      list.appendChild(empty);
    }

    empty.textContent =
      activeNotificationFilter === 'unread'
        ? 'You have no unread notifications.'
        : 'You have no notifications yet.';

    empty.hidden = false;
  } else if (empty) {
    empty.hidden = true;
  }
}

/* ══════════════════════════════════════
   AVATAR DROPDOWN
══════════════════════════════════════ */
function toggleDropdown() {
  const dropdown = document.getElementById('avatarDropdown');
  const willOpen = !dropdown.classList.contains('open');

  dropdown.classList.toggle('open', willOpen);

  if (willOpen) {
    closeNotificationPanel();
  }
}

// Close dropdown when clicking outside
document.addEventListener('click', function (event) {
  const avatarWrap = document.getElementById('avatarWrap');
  const avatarDropdown = document.getElementById('avatarDropdown');

  if (avatarWrap && !avatarWrap.contains(event.target)) {
    avatarDropdown?.classList.remove('open');

    document.getElementById('languageMenu')?.classList.remove('open');
    document.getElementById('languageChevron')?.classList.remove('open');

    document
      .getElementById('languageToggleBtn')
      ?.setAttribute('aria-expanded', 'false');
  }

  const notificationWrap =
    document.getElementById('notificationWrap');

  if (
    notificationWrap &&
    !notificationWrap.contains(event.target)
  ) {
    closeNotificationPanel();
  }
});

function ddAction(action) {
  document.getElementById('avatarDropdown').classList.remove('open');
  if (action === 'profile') {
    showPage('profile');
  } else if (action === 'settings') {
    // Settings page placeholder — extend later
    alert('Settings coming soon!');
  } else if (action === 'help') {
    alert('Help & Support coming soon!');
  } else if (action === 'logout') {
    if (confirm('Are you sure you want to log out?')) {
      // Redirect to login page
      firebaseLogout();
    }
  }
}

function toggleLanguageMenu(event) {
  if (event) {
    event.preventDefault();
    event.stopPropagation();
  }

  const menu = document.getElementById('languageMenu');
  const chevron = document.getElementById('languageChevron');
  const toggleButton = document.getElementById('languageToggleBtn');

  if (!menu) return;

  const isOpen = menu.classList.toggle('open');

  chevron?.classList.toggle('open', isOpen);
  toggleButton?.setAttribute('aria-expanded', String(isOpen));
}

function selectDashboardLanguage(lang, event) {
  if (event) {
    event.preventDefault();
    event.stopPropagation();
  }

  if (!translations[lang]) {
    console.warn(`Unsupported language: ${lang}`);
    return;
  }

  localStorage.setItem('preferredLanguage', lang);
  applyTranslations(lang);
  updateActiveDashboardLanguage(lang);

  document.getElementById('languageMenu')?.classList.remove('open');
  document.getElementById('languageChevron')?.classList.remove('open');
  document
    .getElementById('languageToggleBtn')
    ?.setAttribute('aria-expanded', 'false');
}

function updateActiveDashboardLanguage(lang) {
  document.querySelectorAll('.dd-language-option').forEach(option => {
    option.classList.toggle(
      'active',
      option.dataset.lang === lang
    );
  });
}

function applyTheme(theme) {
  const isDark = theme === 'dark';
  document.body.classList.toggle('dark-mode', isDark);
  document.documentElement.style.colorScheme = isDark ? 'dark' : 'light';
  localStorage.setItem('bcc-theme', isDark ? 'dark' : 'light');
}

function toggleTheme(event) {
  if (event) event.stopPropagation();

  const isDarkNow = document.body.classList.contains('dark-mode');
  applyTheme(isDarkNow ? 'light' : 'dark');
}

(function initTheme() {
  const savedTheme = localStorage.getItem('bcc-theme');
  if (savedTheme === 'dark') {
    document.body.classList.add('dark-mode');
  }
})();

/* ══════════════════════════════════════
   PAGE NAVIGATION
══════════════════════════════════════ */
const pages = ['home', 'jobs', 'messages', 'profile', 'worker-profile'];

function showPage(page) {
  localStorage.setItem(
    'employerCurrentPage',
    page
  );
  pages.forEach(p => {
    const panel = document.getElementById('page-' + p);
    if (panel) panel.classList.toggle('active', p === page);
  });

  pages.forEach(p => {
    const nav = document.getElementById('nav-' + p);
    if (nav) nav.classList.toggle('active', p === page);
  });

  pages.forEach(p => {
    const mob = document.getElementById('mob-' + p);
    if (mob) mob.classList.toggle('active', p === page);
  });

  window.scrollTo({ top: 0, behavior: 'smooth' });

  if (page === 'messages') {
    // After a short delay to allow the page to render,
    // check if a conversation should be auto-selected.
    setTimeout(() => {
      const activeConv = document.querySelector('#conv-items .conv-item.active');
      if (!activeConv) {
        const firstConv = document.querySelector('#conv-items .conv-item');
        if (firstConv) firstConv.click();
      }
    }, 100);
  }

  if (page === 'jobs') {
    requestAnimationFrame(() => {
      filterJobPostings();
    });
  }
}

// Always start the employer dashboard on Home.
showPage('home');
showJobs();

function closeChat() {
  // Mobile: go back to conversation list
  const shell = document.querySelector('.msg-shell');
  if (shell) shell.classList.remove('chat-open');
}

async function sendMessage() {
  const input = document.getElementById("chat-input");
  const text = input.value.trim();

  if (!text) return;

  if (!window.sendRealtimeMessage) {
    alert("Realtime messaging is not ready.");
    return;
  }

  await window.sendRealtimeMessage(text);
  input.value = "";
}

function sendOnEnter(e) {
  if (e.key === 'Enter') sendMessage();
}

function filterConvs(q) {
  const query = q.toLowerCase().trim();
  document.querySelectorAll('.conv-item').forEach(item => {
    const name = (item.dataset.name || '').toLowerCase();
    item.style.display = (!query || name.includes(query)) ? '' : 'none';
  });
}

/* ══════════════════════════════════════
   BOOKMARK TOGGLE
══════════════════════════════════════ */
function toggleSave(btn) {
  const saved = btn.classList.toggle('saved');
  btn.innerHTML = saved
    ? `<svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>`
    : `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>`;
}


/* ══════════════════════════════════════
   WORK EXPERIENCE MODAL
══════════════════════════════════════ */
function openExperienceModal(title, company, date, description, tags) {
  document.getElementById('experienceModalTitle').textContent = title;
  document.getElementById('experienceModalCompany').textContent = company;
  document.getElementById('experienceModalDate').textContent = date;
  document.getElementById('experienceModalDesc').textContent = description;

  const tagsWrap = document.getElementById('experienceModalTags');
  tagsWrap.innerHTML = '';

  tags.forEach(tag => {
    const span = document.createElement('span');
    span.className = 'exp-tag';
    span.textContent = tag;
    tagsWrap.appendChild(span);
  });

  document.getElementById('experienceModalOverlay').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeExperienceModal(event) {
  if (event && event.target !== event.currentTarget) return;

  document.getElementById('experienceModalOverlay').classList.remove('open');
  document.body.style.overflow = '';
}

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape') {
    closeExperienceModal();
  }
});

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape') {
    closeExperienceModal();
  }
});

function setEmployerHomeTab(btn, panelId) {
  document.querySelectorAll('#page-home .employer-home-tab').forEach(tab => {
    tab.classList.remove('active');
  });

  document.querySelectorAll('#page-home .employer-home-panel').forEach(panel => {
    panel.classList.remove('active');
  });

  btn.classList.add('active');
  document.getElementById(panelId).classList.add('active');
}

let activeJobType = 'all';

function setJobTab(btn, type) {
  activeJobType = type;

  document.querySelectorAll('.type-tab').forEach(tab => {
    tab.classList.remove('active');
  });

  btn.classList.add('active');

  filterJobItems();
}

function filterJobItems() {
  const searchInput = document.querySelector('.job-search-input');
  const items = document.querySelectorAll('.job-item');

  // SAFETY CHECK (VERY IMPORTANT)
  if (!items.length) {
    console.warn("No job items found");
    return;
  }

  const q = searchInput ? searchInput.value.toLowerCase().trim() : '';

  items.forEach(item => {
    const itemType = (item.dataset.type || '').toLowerCase();
    const itemTitle = (item.dataset.title || '').toLowerCase();

    const typeOk = activeJobType === 'all' || itemType === activeJobType;
    const titleOk = !q || itemTitle.includes(q);

    item.style.display = (typeOk && titleOk) ? '' : 'none';
  });
}

let activeJobStatus = 'all';

const blueCollarJobCategories = [

  {
    id: "home-personal-services",
    label: "Home & Personal Services",

    roles: [

      {
        id: "manicurist",
        label: "Manicurist",
        keywords: [
          "manicurist",
          "nail technician",
          "nail tech"
        ]
      },

      {
        id: "barber",
        label: "Barber",
        keywords: [
          "barber",
          "barbering"
        ]
      },

      {
        id: "hairdresser",
        label: "Hairdresser",
        keywords: [
          "hairdresser",
          "hair dresser",
          "hair stylist",
          "hairstylist"
        ]
      },

      {
        id: "tailor",
        label: "Tailor",
        keywords: [
          "tailor",
          "tailoring",
          "seamstress"
        ]
      },

      {
        id: "laundry-worker",
        label: "Laundry Worker",
        keywords: [
          "laundry worker",
          "laundry",
          "washer"
        ]
      },

      {
        id: "house-keeper",
        label: "House Keeper",
        keywords: [
          "house keeper",
          "housekeeper",
          "housekeeping"
        ]
      },

      {
        id: "masseur",
        label: "Masseur",
        keywords: [
          "masseur",
          "massage",
          "massage therapist"
        ]
      },

      {
        id: "caregiver",
        label: "Caregiver",
        keywords: [
          "caregiver",
          "care giver",
          "elderly care"
        ]
      }

    ]
  },


  {
    id: "construction-roles",
    label: "Construction Roles",

    roles: [

      {
        id: "construction-worker",
        label: "Construction Worker",
        keywords: [
          "construction worker",
          "construction laborer",
          "construction"
        ]
      },

      {
        id: "foreman",
        label: "Foreman",
        keywords: [
          "foreman",
          "site foreman"
        ]
      },

      {
        id: "time-keeper",
        label: "Time Keeper",
        keywords: [
          "time keeper",
          "timekeeper"
        ]
      },

      {
        id: "maintenance-worker",
        label: "Maintenance Worker",
        keywords: [
          "maintenance worker",
          "maintenance"
        ]
      },

      {
        id: "plumber",
        label: "Plumber",
        keywords: [
          "plumber",
          "plumbing"
        ]
      },

      {
        id: "carpenter",
        label: "Carpenter",
        keywords: [
          "carpenter",
          "carpentry",
          "woodwork"
        ]
      },

      {
        id: "mason",
        label: "Mason",
        keywords: [
          "mason",
          "masonry"
        ]
      },

      {
        id: "flooring-installer",
        label: "Flooring Installer",
        keywords: [
          "flooring installer",
          "floor installer",
          "flooring",
          "tile installer"
        ]
      },

      {
        id: "welder",
        label: "Welder",
        keywords: [
          "welder",
          "welding"
        ]
      },

      {
        id: "heavy-equipment-operator",
        label: "Heavy Equipment Operator",
        keywords: [
          "heavy equipment operator",
          "excavator operator",
          "excavator",
          "crane operator",
          "crane",
          "lifter operator",
          "heavy equipment"
        ]
      }

    ]
  },


  {
    id: "service-industry-roles",
    label: "Service Industry Roles",

    roles: [

      {
        id: "driver",
        label: "Driver",
        keywords: [
          "driver"
        ]
      },

      {
        id: "waiter-waitress",
        label: "Waiter / Waitress",
        keywords: [
          "waiter",
          "waitress",
          "server"
        ]
      },

      {
        id: "sales-person",
        label: "Sales Lady / Man",
        keywords: [
          "sales lady",
          "sales man",
          "salesman",
          "saleslady",
          "sales associate"
        ]
      },

      {
        id: "warehouse-worker",
        label: "Warehouse Worker",
        keywords: [
          "warehouse worker",
          "warehouse staff"
        ]
      },

      {
        id: "warehouse-checker",
        label: "Warehouse Checker",
        keywords: [
          "warehouse checker",
          "checker"
        ]
      }

    ]
  },


  {
    id: "cleaning-roles",
    label: "Cleaning Roles",

    roles: [

      {
        id: "janitor",
        label: "Janitor",
        keywords: [
          "janitor",
          "janitorial"
        ]
      },

      {
        id: "garbage-collector",
        label: "Garbage Collector",
        keywords: [
          "garbage collector",
          "waste collector"
        ]
      },

      {
        id: "street-cleaner",
        label: "Street Cleaner",
        keywords: [
          "street cleaner",
          "street cleaning"
        ]
      },

      {
        id: "septic-tank-cleaner",
        label: "Septic Tank Cleaner",
        keywords: [
          "septic tank cleaner",
          "septic cleaner",
          "septic"
        ]
      }

    ]
  },


  {
    id: "security-safety",
    label: "Security & Safety",

    roles: [

      {
        id: "security-guard",
        label: "Security Guard",
        keywords: [
          "security guard",
          "security"
        ]
      },

      {
        id: "cctv-operator",
        label: "CCTV Operator",
        keywords: [
          "cctv operator",
          "cctv",
          "surveillance operator"
        ]
      },

      {
        id: "watchman",
        label: "Watchman",
        keywords: [
          "watchman",
          "watch man"
        ]
      }

    ]
  },


  {
    id: "automotive-transportation",
    label: "Automotive & Transportation",

    roles: [

      {
        id: "motorcycle-mechanic",
        label: "Motorcycle Mechanic",
        keywords: [
          "motorcycle mechanic",
          "motorbike mechanic",
          "motorcycle repair"
        ]
      },

      {
        id: "vulcanizing-technician",
        label: "Vulcanizing Technician",
        keywords: [
          "vulcanizing technician",
          "vulcanizer",
          "vulcanizing"
        ]
      },

      {
        id: "carwash-worker",
        label: "Carwash Worker",
        keywords: [
          "carwash worker",
          "car wash worker",
          "carwash",
          "car wash"
        ]
      },

      {
        id: "car-driver",
        label: "Car Driver",
        keywords: [
          "car driver",
          "private driver"
        ]
      },

      {
        id: "tricycle-driver",
        label: "Tricycle Driver",
        keywords: [
          "tricycle driver",
          "tricycle"
        ]
      },

      {
        id: "delivery-rider",
        label: "Delivery Rider",
        keywords: [
          "delivery rider",
          "rider",
          "courier rider"
        ]
      }

    ]
  },


  {
    id: "agricultural-farming",
    label: "Agricultural & Farming",

    roles: [

      {
        id: "farmer",
        label: "Farmer",
        keywords: [
          "farmer",
          "farming",
          "farm worker"
        ]
      },

      {
        id: "fishermen",
        label: "Fishermen",
        keywords: [
          "fisherman",
          "fishermen",
          "fishing worker"
        ]
      },

      {
        id: "livestock-worker",
        label: "Livestock Worker",
        keywords: [
          "livestock worker",
          "livestock"
        ]
      },

      {
        id: "poultry-worker",
        label: "Poultry Worker",
        keywords: [
          "poultry worker",
          "poultry"
        ]
      },

      {
        id: "tractor-operator",
        label: "Tractor Operator",
        keywords: [
          "tractor operator",
          "tractor"
        ]
      }

    ]
  }

];

let selectedEmployerJobRole = "all";

/* ══════════════════════════════════════
EMPLOYER JOB CATEGORY MENU
══════════════════════════════════════ */

function buildEmployerJobCategoryMenu() {

  const menu =
    document.getElementById(
      "employerJobCategoryMenu"
    );

  if (!menu) return;

  menu.innerHTML = "";


  /* ALL CATEGORIES */
  const allButton =
    document.createElement("button");

  allButton.type = "button";

  allButton.className =
    "employer-category-all-btn";

  allButton.innerHTML = `
    <span data-i18n="jobsAllCategories">
      All Categories
    </span>
  `;


  allButton.addEventListener(
    "click",
    (event) => {

      event.preventDefault();
      event.stopPropagation();

      selectEmployerJobRole(
        "all",
        "Job Category"
      );

    }
  );


  menu.appendChild(allButton);


  /*
    BUILD EACH CATEGORY
  */
  blueCollarJobCategories.forEach(
    category => {

      const group =
        document.createElement("div");

      group.className =
        "employer-category-group";


      const categoryButton =
        document.createElement("button");

      categoryButton.type = "button";

      categoryButton.className =
        "employer-category-group-btn";


      categoryButton.innerHTML = `
        <span>
          ${category.label}
        </span>

        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <polyline
            points="9 18 15 12 9 6"
          ></polyline>
        </svg>
      `;


      /*
        Submenu containing occupations.
      */
      const submenu =
        document.createElement("div");

      submenu.className =
        "employer-category-submenu";


      category.roles.forEach(
        role => {

          const roleButton =
            document.createElement("button");

          roleButton.type = "button";

          roleButton.className =
            "employer-category-role-btn";

          roleButton.dataset.roleId =
            role.id;

          roleButton.textContent =
            role.label;


          roleButton.addEventListener(
            "click",
            (event) => {

              event.preventDefault();
              event.stopPropagation();

              selectEmployerJobRole(
                role.id,
                role.label
              );

            }
          );


          submenu.appendChild(
            roleButton
          );

        }
      );


      /*
        Expand/collapse category.
      */
      categoryButton.addEventListener(
        "click",
        (event) => {

          event.preventDefault();
          event.stopPropagation();


          const isOpen =
            group.classList.contains(
              "open"
            );


          /*
            Close other categories.
          */
          document
            .querySelectorAll(
              ".employer-category-group.open"
            )
            .forEach(openGroup => {

              if (openGroup !== group) {

                openGroup.classList.remove(
                  "open"
                );

              }

            });


          group.classList.toggle(
            "open",
            !isOpen
          );

        }
      );


      group.appendChild(
        categoryButton
      );

      group.appendChild(
        submenu
      );

      menu.appendChild(
        group
      );

    }
  );
}

function toggleEmployerJobCategory(
  event
) {

  if (event) {
    event.preventDefault();
    event.stopPropagation();
  }


  const wrap =
    document.getElementById(
      "employerJobCategoryWrap"
    );


  const button =
    document.getElementById(
      "employerJobCategoryBtn"
    );


  if (!wrap) return;


  const willOpen =
    !wrap.classList.contains(
      "open"
    );


  wrap.classList.toggle(
    "open",
    willOpen
  );


  button?.setAttribute(
    "aria-expanded",
    String(willOpen)
  );
}



function closeEmployerJobCategory() {

  const wrap =
    document.getElementById(
      "employerJobCategoryWrap"
    );


  const button =
    document.getElementById(
      "employerJobCategoryBtn"
    );


  wrap?.classList.remove(
    "open"
  );


  button?.setAttribute(
    "aria-expanded",
    "false"
  );

}

function selectEmployerJobRole(
  roleId,
  roleLabel
) {

  selectedEmployerJobRole =
    roleId;


  const label =
    document.getElementById(
      "employerJobCategoryLabel"
    );


  if (label) {

    if (roleId === "all") {

      label.textContent =
        "Job Category";

      label.setAttribute(
        "data-i18n",
        "jobsCategory"
      );

    } else {

      label.removeAttribute(
        "data-i18n"
      );

      label.textContent =
        roleLabel;

    }

  }


  /*
    Highlight selected occupation.
  */
  document
    .querySelectorAll(
      ".employer-category-role-btn"
    )
    .forEach(button => {

      button.classList.toggle(
        "active",
        button.dataset.roleId ===
        roleId
      );

    });


  closeEmployerJobCategory();


  /*
    Immediately filter job posts.
  */
  filterJobPostings();

}

function normalizeEmployerCategoryText(
  value
) {

  return String(value || "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();

}



function findEmployerJobRole(
  roleId
) {

  for (
    const category
    of blueCollarJobCategories
  ) {

    const role =
      category.roles.find(
        item =>
          item.id === roleId
      );


    if (role) {
      return role;
    }

  }


  return null;
}



function employerCardMatchesRole(
  card
) {

  /*
    All Categories selected.
  */
  if (
    selectedEmployerJobRole === "all"
  ) {
    return true;
  }


  const role =
    findEmployerJobRole(
      selectedEmployerJobRole
    );


  if (!role) {
    return true;
  }


  const jobText =
    normalizeEmployerCategoryText(
      card.dataset.categorySearch ||
      ""
    );


  /*
    Look for any keyword belonging
    to the selected occupation.
  */
  return role.keywords.some(
    keyword => {

      const normalizedKeyword =
        normalizeEmployerCategoryText(
          keyword
        );


      return jobText.includes(
        normalizedKeyword
      );

    }
  );

}

function filterJobPostings() {

  const searchInput =
    document.querySelector(
      ".job-listings-search"
    );


  const statusSelect =
    document.getElementById(
      "jobStatusFilter"
    );


  /*
    IMPORTANT:
    Only Employer Job Listings cards.
  */
  const cards =
    document.querySelectorAll(
      "#employerJobsList .job-card.dynamic-post"
    );


  const searchQuery =
    searchInput
      ? searchInput.value
        .toLowerCase()
        .trim()
      : "";


  const selectedStatus =
    statusSelect
      ? statusSelect.value
        .toLowerCase()
        .trim()
      : "all";


  cards.forEach(
    card => {

      const title =
        card
          .querySelector(
            ".job-title"
          )
          ?.textContent
          .toLowerCase() ||
        "";


      const searchText =
        (
          card.dataset.categorySearch ||
          title
        ).toLowerCase();


      const cardStatus =
        (
          card.dataset.status ||
          "active"
        ).toLowerCase();


      /* SEARCH */
      const matchesSearch =
        !searchQuery ||
        searchText.includes(
          searchQuery
        );


      /* ALL / ACTIVE / DRAFT / CLOSED */
      const matchesStatus =
        selectedStatus === "all" ||
        cardStatus ===
        selectedStatus;


      /* JOB CATEGORY */
      const matchesCategory =
        employerCardMatchesRole(
          card
        );


      card.style.display =
        matchesSearch &&
          matchesStatus &&
          matchesCategory
          ? ""
          : "none";

    }
  );

}

if (
  document.readyState ===
  "loading"
) {

  document.addEventListener(
    "DOMContentLoaded",
    buildEmployerJobCategoryMenu
  );

} else {

  buildEmployerJobCategoryMenu();

}

document.addEventListener(
  "click",
  (event) => {

    const wrap =
      document.getElementById(
        "employerJobCategoryWrap"
      );


    if (
      wrap &&
      !wrap.contains(
        event.target
      )
    ) {

      closeEmployerJobCategory();

    }

  }
);

document.addEventListener(
  "keydown",
  (event) => {

    if (event.key === "Escape") {
      closeEmployerJobCategory();
    }

  }
);

function openJobPostModal() {
  document.getElementById('jobPostModalOverlay').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeJobPostModal(event) {
  if (event && event.target !== event.currentTarget) return;
  document.getElementById('jobPostModalOverlay').classList.remove('open');
  document.body.style.overflow = '';
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function showApplicants(jobId = null) {
  const jobsPanel =
    document.getElementById("employer-home-jobs");

  const applicantsPanel =
    document.getElementById("employer-home-applicants");

  if (jobsPanel) {
    jobsPanel.style.display = "none";
  }

  if (applicantsPanel) {
    applicantsPanel.style.display = "block";
  }

  selectedApplicantsJobId = jobId || null;

  if (jobId) {
    showApplicantsForJob(jobId);
  } else {
    showAllApplicants();
  }
}

function showJobs() {
  const jobsPanel =
    document.getElementById("employer-home-jobs");

  const applicantsPanel =
    document.getElementById("employer-home-applicants");

  selectedApplicantsJobId = null;

  if (jobsPanel) {
    jobsPanel.style.display = "block";
  }

  if (applicantsPanel) {
    applicantsPanel.style.display = "none";
  }
}

function showApplicantsForJob(jobId) {
  const list =
    document.getElementById("applicantsModernList");

  const pill =
    document.getElementById("applicantsModernCount");

  const title =
    document.getElementById("applicantsModernTitle");

  if (!list || !jobId) {
    return;
  }

  const job =
    jobsCache.get(jobId);

  if (!job) {
    console.warn(
      "Job not found in cache:",
      jobId
    );

    renderApplicantsEmptyState(
      "Unable to find this job post."
    );

    return;
  }

  selectedApplicantsJobId = jobId;

  if (title) {
    title.textContent =
      `Applicants — ${job.title || "Untitled Job"}`;
  }

  list.innerHTML = `
    <div class="applicants-empty-state">
      <div class="applicants-empty-text">
        Loading applicants...
      </div>
    </div>
  `;

  if (pill) {
    pill.textContent =
      "Loading...";
  }

  /*
    Stop the previous single-job listener,
    if one is already active.
  */
  if (applicantsListUnsubscribe) {
    applicantsListUnsubscribe();
    applicantsListUnsubscribe = null;
  }

  const applicationsQuery = query(
    collection(
      db,
      "jobs",
      jobId,
      "applications"
    ),
    orderBy(
      "appliedAt",
      "desc"
    )
  );

  applicantsListUnsubscribe =
    onSnapshot(
      applicationsQuery,

      snapshot => {
        /*
          Ignore this listener if the employer
          has since opened another job.
        */
        if (
          selectedApplicantsJobId !== jobId
        ) {
          return;
        }

        list.innerHTML = "";

        const visibleApplications =
          snapshot.docs.filter(
            docSnap =>
              docSnap.data().status !==
              "rejected"
          );

        const count =
          visibleApplications.length;

        if (pill) {
          pill.textContent =
            `${count} applicant${count === 1 ? "" : "s"}`;
        }

        if (snapshot.empty) {
          list.innerHTML = `
            <div class="applicants-empty-state">

              <div class="applicants-empty-title">
                No applicants yet
              </div>

              <div class="applicants-empty-text">
                No one has applied for
                ${escapeHtml(
            job.title ||
            "this job"
          )}
                yet.
              </div>

            </div>
          `;

          return;
        }

        visibleApplications.forEach(
          docSnap => {
            const applicationData =
              docSnap.data();

            const applicant = {
              id:
                `${jobId}__${docSnap.id}`,

              applicationDocId:
                docSnap.id,

              jobId,

              notificationType:
                "application",

              title:
                applicationData.title ||
                job.title ||
                "Untitled Job",

              ...applicationData
            };

            list.appendChild(
              createApplicantCard(
                applicant.id,
                applicant
              )
            );
          });
      },

      error => {
        console.error(
          "FAILED TO LOAD APPLICANTS FOR JOB:",
          jobId,
          error
        );

        if (
          selectedApplicantsJobId !== jobId
        ) {
          return;
        }

        list.innerHTML = `
          <div class="applicants-empty-state">

            <div class="applicants-empty-title">
              Failed to load applicants
            </div>

            <div class="applicants-empty-text">
              Please try again.
            </div>

          </div>
        `;

        if (pill) {
          pill.textContent =
            "0 applicants";
        }
      }
    );
}

function showAllApplicants() {
  selectedApplicantsJobId = null;

  /*
    Remove any specific-job listener.
  */
  if (applicantsListUnsubscribe) {
    applicantsListUnsubscribe();
    applicantsListUnsubscribe = null;
  }

  const title =
    document.getElementById(
      "applicantsModernTitle"
    );

  if (title) {
    title.textContent =
      "Applicants";
  }

  renderAllEmployerApplicants();
}

function updateConversationSidebarPreview(conversationId, text) {
  const convItem = document.querySelector(`.conv-item[data-convid="${conversationId}"]`);
  if (!convItem) return;

  const preview = convItem.querySelector(".conv-preview");
  if (preview) {
    preview.textContent = text.length > 22 ? text.substring(0, 22) + "..." : text;
  }

  const timeEl = convItem.querySelector(".conv-time");
  if (timeEl) timeEl.textContent = "now";

  const convItems = document.getElementById("conv-items");
  if (convItems) convItems.prepend(convItem);
}

window.openJobPostModal = openJobPostModal;
window.closeJobPostModal = closeJobPostModal;

/* ══════════════════════════════════════
   LANGUAGE TRANSLATION
══════════════════════════════════════ */
const translations = {
  en: {
    searchPlaceholder: "Search jobs, skills, or location...",
    ddViewProfile: "View Profile",
    ddDarkMode: "Dark Mode",
    ddLanguages: "Languages",
    ddSettings: "Settings",
    ddHelp: "Help & Support",
    ddLogout: "Log Out",
    workerBackApplicants: "Back to Applicants",
    workerProfileLabel: "Job Seeker Profile",
    workerOpenForWork: "Open for Work",
    employerActivelyHiring: "Actively Hiring",
    employerHiringSubtext: "Recruiting workers for open positions",
    workerJobSeeker: "Job Seeker",
    applicantMenuReject: "Reject Application",
    profileCardJobs: "My Job Post",
    sidebarHome: "Home",
    sidebarJobs: "Job Listings",
    sidebarMessages: "Messages",
    sidebarProfile: "Profile",
    profileCardViews: "Profile Views",
    profileCardApps: "Applications",
    profileOpenForWork: "Open for Work",
    homeDashboard: "Dashboard",
    homeManageJobs: "Manage your job posts",
    homeMyJobs: "My Job Post",
    homeApplicants: "Applicants",
    applicantsEmptyTitle: "No applicants yet",
    applicantsEmptyText: "Applicants from all of your job posts will appear here automatically.",
    jobsMyPostings: "My Job Postings",
    jobsManageListings: "Manage your job listings and view applications",
    jobsPostNew: "Post New Job",
    jobsSearchPlaceholder: "Search job postings...",
    jobsAll: "All Jobs",
    jobsActive: "Active",
    jobsDrafts: "Drafts",
    jobsClosed: "Closed",
    jobsCategory: "Job Category",
    jobsAllCategories: "All Categories",
    msgSearch: "Search conversations...",
    msgSelectConvo: "Select a Conversation",
    msgStartMessaging: "Select a conversation to start messaging.",
    msgTypeMessage: "Type a message...",
    profileStatus: "Profile Status",
    profileActivelySeeking: "Actively seeking opportunities",
    profileCompletion: "Profile Completion",
    profileStats: "Statistics",
    profileRating: "Rating",
    profileCompletedJobs: "Completed Jobs",
    profileSkills: "Skills",
    profileAddSkill: "Add Skill",
    profileChangeCover: "Change Cover",
    profileSetLocation: "Set current location",
    profileMessage: "Message",
    profileContact: "Contact",
    profileAbout: "About",
    profileWorkExperience: "Work Experience",
    profileMyPhotos: "My Photos",
    profileAddPhoto: "Add Photo",
    profileReviews: "Reviews & Ratings",
    mobHome: "Home",
    mobJobs: "Job Listings",
    mobMessages: "Messages",
    mobProfile: "Profile",
    modalPostNewJob: "Post New Job",
    modalCreateJobPost: "Create a job post that matches the style of your listings page.",
    modalJobTitle: "Job Title",
    modalEmployerBadge: "Employer Badge",
    modalIndividual: "Individual",
    modalCompany: "Company",
    modalJobType: "Job Type",
    modalLocation: "Location",
    modalDuration: "Duration",
    modalPay: "Pay Range",
    modalUrgent: "Urgent Tag",
    modalYes: "Yes",
    modalNo: "No",
    modalStatus: "Status",
    modalSkills: "Skills (comma separated)",
    modalCancel: "Cancel",
    modalPostJob: "Post Job",
  },
  war: {
    searchPlaceholder: "Pamiling hin trabaho, abilidad, o lokasyon...",
    ddViewProfile: "Kitaa an Profile",
    ddDarkMode: "Dark Mode",
    ddLanguages: "Mga Pinulongan",
    ddSettings: "Mga Setting",
    ddHelp: "Bulig & Suporta",
    ddLogout: "Pag-log Out",
    workerBackApplicants: "Balik ha mga Aplikante",
    workerProfileLabel: "Profile han Nangita hin Trabaho",
    workerOpenForWork: "Abierto para Trabaho",
    employerActivelyHiring: "Aktibo nga Nagha-hire",
    employerHiringSubtext: "Namimiling hin mga trabahador para ha mga bakante nga trabaho",
    workerJobSeeker: "Nangita hin Trabaho",
    applicantMenuReject: "Isalikway an Aplikasyon",
    profileCardJobs: "Akon Mga Job Post",
    sidebarHome: "Panimalay",
    sidebarJobs: "Listahan hin Trabaho",
    sidebarMessages: "Mga Mensahe",
    sidebarProfile: "Profile",
    profileCardViews: "Mga Pagkita han Profile",
    profileCardApps: "Mga Aplikasyon",
    profileOpenForWork: "Abierto para Trabaho",
    homeDashboard: "Dashboard",
    homeManageJobs: "Pagdumara han imo mga post hin trabaho",
    homeMyJobs: "Akon Mga Post hin Trabaho",
    homeApplicants: "Mga Aplikante",
    applicantsEmptyTitle: "Waray pa mga aplikante",
    applicantsEmptyText: "An mga aplikante tikang ha ngatanan nimo nga mga post hin trabaho mangingita dinhi awtomatiko.",
    jobsMyPostings: "Akon Mga Job Postings",
    jobsManageListings: "Pagdumara han imo mga listahan hin trabaho ngan kitaa an mga aplikasyon",
    jobsPostNew: "Pag-post hin Bag-o nga Trabaho",
    jobsSearchPlaceholder: "Pamiling hin mga job postings...",
    jobsAll: "Ngatanan nga Trabaho",
    jobsActive: "Aktibo",
    jobsDrafts: "Mga Draft",
    jobsClosed: "Sarado",
    jobsCategory: "Klase han Trabaho",
    jobsAllCategories: "Ngatanan nga Kategorya",
    msgSearch: "Pamiling hin mga istorya...",
    msgSelectConvo: "Pagpili hin Istorya",
    msgStartMessaging: "Pagpili hin istorya para magtikang pag-mensahe.",
    msgTypeMessage: "Pagsurat hin mensahe...",
    profileStatus: "Status han Profile",
    profileActivelySeeking: "Aktibo nga namimiling hin oportunidad",
    profileCompletion: "Pagkakumpleto han Profile",
    profileStats: "Mga Estadistika",
    profileRating: "Rating",
    profileCompletedJobs: "Mga Natapos nga Trabaho",
    profileSkills: "Mga Abilidad",
    profileAddSkill: "Pagdugang hin Abilidad",
    profileChangeCover: "Pag-ilis hin Cover",
    profileSetLocation: "Ibutang an yana nga lokasyon",
    profileMessage: "Mensahe",
    profileContact: "Kontaka",
    profileAbout: "Mahitungod",
    profileWorkExperience: "Karanasan ha Trabaho",
    profileMyPhotos: "Akon Mga Litrato",
    profileAddPhoto: "Pagdugang hin Litrato",
    profileReviews: "Mga Repaso & Rating",
    mobHome: "Panimalay",
    mobJobs: "Mga Listahan",
    mobMessages: "Mga Mensahe",
    mobProfile: "Profile",
    modalPostNewJob: "Pag-post hin Bag-o nga Trabaho",
    modalCreateJobPost: "Paghimo hin post hin trabaho nga angay ha estilo han imo pahina han mga listahan.",
    modalJobTitle: "Titulo han Trabaho",
    modalEmployerBadge: "Badge han Agaron",
    modalIndividual: "Indibidwal",
    modalCompany: "Kompanya",
    modalJobType: "Klase han Trabaho",
    modalLocation: "Lokasyon",
    modalDuration: "Kadugayon",
    modalPay: "Sakob han Suhol",
    modalUrgent: "Urgent Tag",
    modalYes: "Oo",
    modalNo: "Diri",
    modalStatus: "Status",
    modalSkills: "Mga Abilidad (ibubulag hin comma)",
    modalCancel: "Kanselahon",
    modalPostJob: "I-post an Trabaho",
  }, tl: {
    searchPlaceholder: "Maghanap ng trabaho, kasanayan, o lokasyon...",

    ddViewProfile: "Tingnan ang Profile",
    ddDarkMode: "Dark Mode",
    ddLanguages: "Mga Wika",
    ddSettings: "Mga Setting",
    ddHelp: "Tulong at Suporta",
    ddLogout: "Mag-log Out",
    workerBackApplicants: "Bumalik sa mga Aplikante",
    workerProfileLabel: "Profile ng Job Seeker",
    workerOpenForWork: "Bukas para sa Trabaho",
    employerActivelyHiring: "Aktibong Nagha-hire",
    employerHiringSubtext: "Naghahanap ng mga manggagawa para sa mga bakanteng trabaho",
    workerJobSeeker: "Job Seeker",
    applicantMenuReject: "Tanggihan ang Aplikasyon",
    profileCardJobs: "Aking Mga Job Post",
    sidebarHome: "Home",
    sidebarJobs: "Listahan ng Trabaho",
    sidebarMessages: "Mga Mensahe",
    sidebarProfile: "Profile",
    profileCardViews: "Mga Pagtingin sa Profile",
    profileCardApps: "Mga Aplikasyon",
    profileOpenForWork: "Bukas para sa Trabaho",
    homeDashboard: "Dashboard",
    homeManageJobs: "Pamahalaan ang iyong mga job post",
    homeMyJobs: "Aking mga Job Post",
    homeApplicants: "Mga Aplikante",
    applicantsEmptyTitle: "Wala pang mga aplikante",
    applicantsEmptyText: "Awtomatikong lalabas dito ang mga aplikante mula sa lahat ng iyong job post.",
    jobsMyPostings: "Aking mga Job Posting",
    jobsManageListings: "Pamahalaan ang iyong mga listahan ng trabaho at tingnan ang mga aplikasyon",
    jobsPostNew: "Mag-post ng Bagong Trabaho",
    jobsSearchPlaceholder: "Maghanap ng mga job posting...",
    jobsAll: "Lahat ng Trabaho",
    jobsActive: "Aktibo",
    jobsDrafts: "Mga Draft",
    jobsClosed: "Sarado",
    jobsCategory: "Kategorya ng Trabaho",
    jobsAllCategories: "Lahat ng Kategorya",
    msgSearch: "Maghanap ng mga pag-uusap...",
    msgSelectConvo: "Pumili ng Pag-uusap",
    msgStartMessaging: "Pumili ng pag-uusap upang magsimulang mag-message.",
    msgTypeMessage: "Mag-type ng mensahe...",
    profileStatus: "Katayuan ng Profile",
    profileActivelySeeking: "Aktibong naghahanap ng mga oportunidad",
    profileCompletion: "Pagkakumpleto ng Profile",
    profileStats: "Mga Estadistika",
    profileRating: "Rating",
    profileCompletedJobs: "Mga Natapos na Trabaho",
    profileSkills: "Mga Kasanayan",
    profileAddSkill: "Magdagdag ng Kasanayan",
    profileChangeCover: "Palitan ang Cover",
    profileSetLocation: "Itakda ang kasalukuyang lokasyon",
    profileMessage: "Mensahe",
    profileContact: "Kontak",
    profileAbout: "Tungkol sa Akin",
    profileWorkExperience: "Karanasan sa Trabaho",
    profileMyPhotos: "Aking mga Larawan",
    profileAddPhoto: "Magdagdag ng Larawan",
    profileReviews: "Mga Review at Rating",
    mobHome: "Home",
    mobJobs: "Mga Listahan",
    mobMessages: "Mga Mensahe",
    mobProfile: "Profile",
    modalPostNewJob: "Mag-post ng Bagong Trabaho",
    modalCreateJobPost: "Gumawa ng job post na naaayon sa estilo ng iyong listings page.",
    modalJobTitle: "Titulo ng Trabaho",
    modalEmployerBadge: "Badge ng Employer",
    modalIndividual: "Indibidwal",
    modalCompany: "Kompanya",
    modalJobType: "Uri ng Trabaho",
    modalLocation: "Lokasyon",
    modalDuration: "Tagal",
    modalPay: "Saklaw ng Sahod",
    modalUrgent: "Urgent na Tag",
    modalYes: "Oo",
    modalNo: "Hindi",
    modalStatus: "Katayuan",
    modalSkills: "Mga Kasanayan (paghiwalayin gamit ang kuwit)",
    modalCancel: "Kanselahin",
    modalPostJob: "I-post ang Trabaho",
  }
};

function applyTranslations(lang) {
  if (!translations[lang]) {
    lang = 'en';
  }

  document.documentElement.lang = lang === 'tl' ? 'fil' : lang;

  document.querySelectorAll(
    '[data-i18n]'
  ).forEach(
    element => {

      /*
        IMPORTANT:
        Never translate a REAL person's
        name currently displayed in chat.
      */
      if (
        element.id === "chat-name" &&
        element.dataset.dynamicName === "true"
      ) {

        return;

      }


      const key =
        element.getAttribute(
          "data-i18n"
        );


      const translation =
        translations[lang]?.[key];


      if (
        translation === undefined
      ) {

        return;

      }


      if (
        element.tagName === "INPUT" ||
        element.tagName === "TEXTAREA"
      ) {

        element.placeholder =
          translation;

      } else {

        element.textContent =
          translation;

      }

    }
  );
}

function initLanguage() {
  const urlParams = new URLSearchParams(window.location.search);
  const urlLang = urlParams.get('lang');
  const storedLang = localStorage.getItem('preferredLanguage');

  let selectedLang = 'en';

  // First priority: language sent by the employer login redirect
  if (urlLang && translations[urlLang]) {
    selectedLang = urlLang;
  }

  // Second priority: language saved from the index page
  else if (storedLang && translations[storedLang]) {
    selectedLang = storedLang;
  }

  // Keep all pages synchronized
  localStorage.setItem('preferredLanguage', selectedLang);

  applyTranslations(selectedLang);
  updateActiveDashboardLanguage(selectedLang);

  // Remove the language parameter without refreshing the page
  if (urlLang) {
    const cleanUrl =
      window.location.pathname +
      window.location.hash;

    window.history.replaceState({}, document.title, cleanUrl);
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initLanguage);
} else {
  initLanguage();
}

/* ══════════════════════════════════════
EXPOSE EMPLOYER JOB FUNCTIONS
══════════════════════════════════════ */

window.selectEmployerJobRole =
  selectEmployerJobRole;

window.filterJobPostings =
  filterJobPostings;