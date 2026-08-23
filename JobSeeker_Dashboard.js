let selectedJobType = "all";
let selectedJobRole = "all";


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
let activeConversationId = null;
let unsubscribeActiveMessages = null;
let unsubscribeActiveParticipant = null;


function setJobTypeFilter(type) {
  selectedJobType = type;
  filterJobItems();
}

/* ══════════════════════════════════════
   AVATAR DROPDOWN
══════════════════════════════════════ */
function toggleDropdown() {
  const dd = document.getElementById('avatarDropdown');
  dd.classList.toggle('open');
}

// Close dropdown when clicking outside
document.addEventListener('click', function (event) {
  const wrap = document.getElementById('avatarWrap');
  const dropdown = document.getElementById('avatarDropdown');

  if (wrap && !wrap.contains(event.target)) {
    dropdown?.classList.remove('open');

    document.getElementById('languageMenu')?.classList.remove('open');
    document.getElementById('languageChevron')?.classList.remove('open');
    document
      .getElementById('languageToggleBtn')
      ?.setAttribute('aria-expanded', 'false');
  }
});

/* ══════════════════════════════════════
JOB CATEGORY DROPDOWN
══════════════════════════════════════ */

function buildJobCategoryMenu() {

  const menu =
    document.getElementById(
      "jobCategoryMenu"
    );

  if (!menu) return;


  menu.innerHTML = "";


  /* Reset / show everything */
  const allButton =
    document.createElement(
      "button"
    );

  allButton.type =
    "button";

  allButton.className =
    "job-category-all-btn";

  allButton.innerHTML = `
    <span data-i18n="jobsAllCategories">
      All Categories
    </span>
  `;

  allButton.addEventListener(
    "click",
    event => {

      event.preventDefault();
      event.stopPropagation();

      selectJobCategoryRole(
        "all",
        "Job Category"
      );

    }
  );

  menu.appendChild(
    allButton
  );


  blueCollarJobCategories.forEach(
    category => {

      const group =
        document.createElement(
          "div"
        );

      group.className =
        "job-category-group";


      const categoryButton =
        document.createElement(
          "button"
        );

      categoryButton.type =
        "button";

      categoryButton.className =
        "job-category-group-btn";

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
          aria-hidden="true"
        >
          <polyline
            points="9 18 15 12 9 6"
          ></polyline>
        </svg>
      `;


      const submenu =
        document.createElement(
          "div"
        );

      submenu.className =
        "job-category-submenu";


      category.roles.forEach(
        role => {

          const roleButton =
            document.createElement(
              "button"
            );

          roleButton.type =
            "button";

          roleButton.className =
            "job-category-role-btn";

          roleButton.dataset.roleId =
            role.id;

          roleButton.textContent =
            role.label;


          roleButton.addEventListener(
            "click",
            event => {

              event.preventDefault();
              event.stopPropagation();

              selectJobCategoryRole(
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


      categoryButton.addEventListener(
        "click",
        event => {

          event.preventDefault();
          event.stopPropagation();


          const isOpen =
            group.classList.contains(
              "open"
            );


          /*
            Close the other categories so
            only one submenu is expanded.
          */
          document
            .querySelectorAll(
              ".job-category-group.open"
            )
            .forEach(
              openGroup => {

                if (
                  openGroup !== group
                ) {
                  openGroup.classList.remove(
                    "open"
                  );
                }

              }
            );


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

function toggleJobCategoryDropdown(
  event
) {

  if (event) {
    event.preventDefault();
    event.stopPropagation();
  }


  const wrap =
    document.getElementById(
      "jobCategoryDropdownWrap"
    );

  const button =
    document.getElementById(
      "jobCategoryDropdownBtn"
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

function closeJobCategoryDropdown() {

  const wrap =
    document.getElementById(
      "jobCategoryDropdownWrap"
    );

  const button =
    document.getElementById(
      "jobCategoryDropdownBtn"
    );


  wrap?.classList.remove(
    "open"
  );


  button?.setAttribute(
    "aria-expanded",
    "false"
  );

}

function selectJobCategoryRole(
  roleId,
  roleLabel
) {

  selectedJobRole =
    roleId;


  const label =
    document.getElementById(
      "jobCategoryDropdownLabel"
    );


  if (label) {

    if (
      roleId === "all"
    ) {

      label.textContent =
        "Job Category";

      label.setAttribute(
        "data-i18n",
        "jobsCategory"
      );

    } else {

      /*
        Selected occupations are dynamic,
        so remove the default translation key.
      */
      label.removeAttribute(
        "data-i18n"
      );

      label.textContent =
        roleLabel;

    }

  }


  document
    .querySelectorAll(
      ".job-category-role-btn"
    )
    .forEach(button => {

      button.classList.toggle(
        "active",
        button.dataset.roleId ===
        roleId
      );

    });


  closeJobCategoryDropdown();


  /*
    Use your EXISTING filtering
    system after selection.
  */
  filterJobItems();

}

function normalizeJobCategoryText(
  value
) {

  return String(
    value || ""
  )
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();

}

function findBlueCollarRole(
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

function jobMatchesSelectedRole(
  card
) {

  if (
    selectedJobRole === "all"
  ) {
    return true;
  }


  const role =
    findBlueCollarRole(
      selectedJobRole
    );


  if (!role) {
    return true;
  }


  /*
    Your existing cards already save
    title + employer + location + skills
    inside data-title.
  */
  const jobText =
    normalizeJobCategoryText(
      card.dataset.title || ""
    );


  return role.keywords.some(
    keyword => {

      const normalizedKeyword =
        normalizeJobCategoryText(
          keyword
        );


      return jobText.includes(
        normalizedKeyword
      );

    }
  );

}

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

function applyTheme(theme) {
  const isDark = theme === 'dark';
  document.body.classList.toggle('dark-mode', isDark);
  document.documentElement.style.colorScheme = isDark ? 'dark' : 'light';
  localStorage.setItem('bcc-theme', isDark ? 'dark' : 'light');
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
const pages = ['home', 'jobs', 'messages', 'profile', 'employer-profile'];

function showPage(page) {
  // Update page panels
  pages.forEach(p => {
    document.getElementById('page-' + p).classList.toggle('active', p === page);
  });

  // Update sidebar nav items
  pages.forEach(p => {
    const el = document.getElementById('nav-' + p);
    if (el) el.classList.toggle('active', p === page);
  });

  // Update mobile nav items
  pages.forEach(p => {
    const el = document.getElementById('mob-' + p);
    if (el) el.classList.toggle('active', p === page);
  });

  // Scroll to top
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
}

/* ══════════════════════════════════════
   JOBS PAGE — filter logic
══════════════════════════════════════ */
let activeJobType = 'all';

function setJobTab(btn, type) {
  document.querySelectorAll('.type-tab').forEach(t => t.classList.remove('active'));
  btn.classList.add('active');
  activeJobType = type;
  filterJobItems();
}

function filterJobItems() {

  const searchInput =
    document.querySelector(
      ".job-search-input"
    );

  const typeSelect =
    document.querySelector(
      ".job-type-dropdown"
    );

  const cards =
    document.querySelectorAll(
      "#job-items-list .job-card"
    );


  const q =
    searchInput
      ? searchInput.value
        .toLowerCase()
        .trim()
      : "";


  const selectedType =
    typeSelect
      ? typeSelect.value
        .toLowerCase()
        .trim()
        .replace(
          /[\s-]+/g,
          ""
        )
      : "all";


  cards.forEach(
    card => {

      const titleText =
        (
          card.dataset.title ||
          ""
        ).toLowerCase();


      const typeText =
        (
          card.dataset.type ||
          ""
        ).toLowerCase();


      /*
        Existing search filter.
      */
      const matchesSearch =
        !q ||
        titleText.includes(q);


      /*
        Existing All Jobs /
        Full-time / Part-time /
        Contract filter.
      */
      const matchesType =
        selectedType === "all" ||
        typeText ===
        selectedType;


      /*
        NEW blue-collar occupation
        filter.
      */
      const matchesRole =
        jobMatchesSelectedRole(
          card
        );


      card.style.display =
        matchesSearch &&
          matchesType &&
          matchesRole
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
    buildJobCategoryMenu
  );

} else {

  buildJobCategoryMenu();

}

document.addEventListener(
  "click",
  event => {

    const wrap =
      document.getElementById(
        "jobCategoryDropdownWrap"
      );


    if (
      wrap &&
      !wrap.contains(
        event.target
      )
    ) {

      closeJobCategoryDropdown();

    }

  }
);

document.addEventListener(
  "keydown",
  event => {

    if (
      event.key ===
      "Escape"
    ) {

      closeJobCategoryDropdown();

    }

  }
);

/* ══════════════════════════════════════
   MESSAGES
══════════════════════════════════════ */
async function openConv(el, convId) {
  document.querySelectorAll('.conv-item').forEach(c => c.classList.remove('active'));
  el.classList.add('active');
  const badge = el.querySelector('.unread-dot');
  if (badge) badge.remove();

  activeConversationId = convId;

  const fallbackName = el.dataset.name || "Conversation";
  const fallbackAvatar = el.dataset.avatar || "https://ui-avatars.com/api/?name=?&background=e5e7eb&color=9ca3af";
  const chatName =
    document.getElementById(
      "chat-name"
    );


  if (
    chatName
  ) {

    chatName.dataset.dynamicName =
      "true";


    chatName.textContent =
      fallbackName;

  }
  document.getElementById('chat-status').textContent = "Loading...";
  document.getElementById('chat-avatar').src = fallbackAvatar;
  document.querySelector('.chat-header-online').style.display = 'none';

  if (window.listenToConversationMessages) {
    window.listenToConversationMessages(convId);
  }

  if (unsubscribeActiveParticipant) {
    unsubscribeActiveParticipant();
    unsubscribeActiveParticipant = null;
  }

  try {
    const convSnap = await getDoc(doc(db, "conversations", convId));
    if (!convSnap.exists() || !auth.currentUser) {
      document.getElementById('chat-status').textContent = "Offline";
      return;
    }

    const convData = convSnap.data();
    const otherId = convData.participantIds.find(id => id !== auth.currentUser.uid);
    if (!otherId) {
      document.getElementById('chat-status').textContent = "Participant not found";
      return;
    }

    const participantRef = doc(db, "employers", otherId);
    unsubscribeActiveParticipant = onSnapshot(participantRef, (participantSnap) => {
      if (participantSnap.exists()) {
        const participantData = participantSnap.data();
        const name = participantData.name || "Employer";
        const avatar = participantData.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=fbbf24&color=ffffff`;
        const liveChatName =
          document.getElementById(
            "chat-name"
          );


        if (
          liveChatName
        ) {

          liveChatName.dataset.dynamicName =
            "true";


          liveChatName.textContent =
            name;

        }
        document.getElementById('chat-status').textContent = "Active recently";
        document.getElementById('chat-avatar').src = avatar;
      } else {
        document.getElementById('chat-status').textContent = "Offline";
      }
    }, (error) => {
      console.error("Participant listener error:", error);
      document.getElementById('chat-status').textContent = "Error loading status";
    });
  } catch (error) {
    console.error("Failed to open conversation details:", error);
    document.getElementById('chat-status').textContent = "Failed to load";
  }

  const shell = document.querySelector('.msg-shell');
  if (window.innerWidth < 900 && shell) {
    shell.classList.add('chat-open');
  }
  const msgs = document.getElementById('chat-messages');
  setTimeout(() => { msgs.scrollTop = msgs.scrollHeight; }, 100);
}

function closeChat() {
  // Mobile: go back to conversation list
  const shell = document.querySelector('.msg-shell');
  if (shell) shell.classList.remove('chat-open');
}

async function sendMessage() {
  const input = document.getElementById('chat-input');
  const text = input.value.trim();
  if (!text) return;

  if (window.sendRealtimeMessage) {
    await window.sendRealtimeMessage(text);
    input.value = '';
  } else {
    alert("Messaging not initialized.");
  }
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
    jobsCategory: "Job Category",
    jobsAllCategories: "All Categories",
    sidebarHome: "Home",
    sidebarJobs: "Jobs",
    sidebarMessages: "Messages",
    sidebarPortfolio: "Portfolio",
    profileCardViews: "Profile Views",
    profileCardApps: "Applications",
    profileCardOpen: "Open for Work",
    homeJobsNearYou: "Available Jobs Near You",
    jobsFindJobs: "Find Jobs",
    jobsAvailable: "jobs available in your area",
    jobsSaved: "Saved Jobs",
    jobsSearchPlaceholder: "Search by job title, co...",
    jobsAll: "All Jobs",
    jobsFullTime: "Full-time",
    jobsPartTime: "Part-time",
    jobsContract: "Contract",
    msgSearch: "Search conversations...",
    msgSelectConvo: "Select a Conversation",
    msgStartMessaging: "Select a conversation to start messaging.",
    msgTypeMessage: "Type a message...",
    profileStatus: "Profile Status",
    profileOpenForWork: "Open for Work",
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
    profileAddExperience: "Add Experience",
    profileMyPhotos: "My Photos",
    profileAddPhoto: "Add Photo",
    profileReviews: "Reviews & Ratings",
    mobHome: "Home",
    mobJobs: "Jobs",
    mobMessages: "Messages",
    mobProfile: "Profile",
  },
  war: {
    searchPlaceholder: "Pamiling hin trabaho, abilidad, o lokasyon...",
    ddViewProfile: "Kitaa an Profile",
    ddDarkMode: "Dark Mode",
    ddLanguages: "Mga Pinulongan",
    ddSettings: "Mga Setting",
    ddHelp: "Bulig & Suporta",
    ddLogout: "Pag-log Out",
    jobsCategory: "Klase han Trabaho",
    jobsAllCategories: "Ngatanan nga Kategorya",
    sidebarHome: "Panimalay",
    sidebarJobs: "Mga Trabaho",
    sidebarMessages: "Mga Mensahe",
    sidebarPortfolio: "Portfolio",
    profileCardViews: "Mga Pagkita han Profile",
    profileCardApps: "Mga Aplikasyon",
    profileCardOpen: "Abierto para Trabaho",
    homeJobsNearYou: "Mga Trabaho nga Harani ha Imo",
    jobsFindJobs: "Pamiling hin Trabaho",
    jobsAvailable: "nga trabaho an available ha imo lugar",
    jobsSaved: "Mga Naisave nga Trabaho",
    jobsSearchPlaceholder: "Pamiling base ha titulo han trabaho...",
    jobsAll: "Ngatanan nga Trabaho",
    jobsFullTime: "Full-time",
    jobsPartTime: "Part-time",
    jobsContract: "Kontrata",
    msgSearch: "Pamiling hin mga istorya...",
    msgSelectConvo: "Pagpili hin Istorya",
    msgStartMessaging: "Pagpili hin istorya para magtikang pag-mensahe.",
    msgTypeMessage: "Pagsurat hin mensahe...",
    profileStatus: "Status han Profile",
    profileOpenForWork: "Abierto para Trabaho",
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
    profileAddExperience: "Pagdugang hin Karanasan",
    profileMyPhotos: "Akon Mga Litrato",
    profileAddPhoto: "Pagdugang hin Litrato",
    profileReviews: "Mga Repaso & Rating",
    mobHome: "Panimalay",
    mobJobs: "Mga Trabaho",
    mobMessages: "Mga Mensahe",
    mobProfile: "Profile",
  }, tl: {
    searchPlaceholder: "Maghanap ng trabaho, kasanayan, o lokasyon...",

    ddViewProfile: "Tingnan ang Profile",
    ddDarkMode: "Dark Mode",
    ddLanguages: "Mga Wika",
    ddSettings: "Mga Setting",
    ddHelp: "Tulong at Suporta",
    ddLogout: "Mag-log Out",
    jobsCategory: "Kategorya ng Trabaho",
    jobsAllCategories: "Lahat ng Kategorya",

    sidebarHome: "Home",
    sidebarJobs: "Mga Trabaho",
    sidebarMessages: "Mga Mensahe",
    sidebarPortfolio: "Portfolio",

    profileCardViews: "Mga Pagtingin sa Profile",
    profileCardApps: "Mga Aplikasyon",
    profileCardOpen: "Bukas para sa Trabaho",

    homeJobsNearYou: "Mga Trabahong Malapit sa Iyo",

    jobsFindJobs: "Maghanap ng Trabaho",
    jobsAvailable: "trabahong available sa iyong lugar",
    jobsSaved: "Mga Naka-save na Trabaho",
    jobsSearchPlaceholder: "Maghanap ayon sa titulo ng trabaho...",
    jobsAll: "Lahat ng Trabaho",
    jobsFullTime: "Full-time",
    jobsPartTime: "Part-time",
    jobsContract: "Kontrata",

    msgSearch: "Maghanap ng mga pag-uusap...",
    msgSelectConvo: "Pumili ng Pag-uusap",
    msgStartMessaging: "Pumili ng pag-uusap upang magsimulang mag-message.",
    msgTypeMessage: "Mag-type ng mensahe...",

    profileStatus: "Katayuan ng Profile",
    profileOpenForWork: "Bukas para sa Trabaho",
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
    profileAddExperience: "Magdagdag ng Karanasan",
    profileMyPhotos: "Aking mga Larawan",
    profileAddPhoto: "Magdagdag ng Larawan",
    profileReviews: "Mga Review at Rating",

    mobHome: "Home",
    mobJobs: "Mga Trabaho",
    mobMessages: "Mga Mensahe",
    mobProfile: "Profile",
  }
};

function applyTranslations(lang) {

  if (!translations[lang]) {
    lang = "en";
  }


  document.documentElement.lang =
    lang === "tl"
      ? "fil"
      : lang;


  document
    .querySelectorAll(
      "[data-i18n]"
    )
    .forEach(
      element => {

        /*
          IMPORTANT:

          #chat-name normally contains the
          translatable text:

          "Select a Conversation"

          But once an actual Employer name
          is placed there, translation must
          leave it alone.
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

(function initLanguage() {
  const urlParams = new URLSearchParams(window.location.search);
  const urlLang = urlParams.get('lang');
  const savedLang = localStorage.getItem('preferredLanguage');

  let selectedLang = 'en';

  if (urlLang && translations[urlLang]) {
    selectedLang = urlLang;
  } else if (savedLang && translations[savedLang]) {
    selectedLang = savedLang;
  }

  localStorage.setItem('preferredLanguage', selectedLang);
  applyTranslations(selectedLang);
  updateActiveDashboardLanguage(selectedLang);
})();

/* ══════════════════════════════════════
   EXPOSE HTML EVENT FUNCTIONS
══════════════════════════════════════ */

window.toggleJobCategoryDropdown =
  toggleJobCategoryDropdown;

window.setJobTypeFilter =
  setJobTypeFilter;

window.filterJobItems =
  filterJobItems;