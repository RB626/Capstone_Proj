import { initializeApp } from "firebase/app";
import { getAI, getGenerativeModel, GoogleAIBackend } from "@firebase/ai";

const firebaseConfig = {
  apiKey: "AIzaSyDnEkuV1HsfZWhhqVCFKPc5o-PjfoCUGTk",
  authDomain: "bluecollarconnect-fc60d.firebaseapp.com",
  projectId: "bluecollarconnect-fc60d",
  appId: "1:1234567890:web:abcdef1234567890"
};

const app = initializeApp(firebaseConfig);

const ai = getAI(app, {
  backend: new GoogleAIBackend()
});

const model = getGenerativeModel(ai, {
  model: "gemini-2.5-flash"
});

function collectAllCards() {
  return Array.from(
    document.querySelectorAll("#page-home .job-card, #job-items-list .job-card")
  );
}

function getCardData(card) {
  const title = card.querySelector(".job-title")?.textContent?.trim() || "";
  const employer = card.querySelector(".employer-name")?.textContent?.trim() || "";

  const skills = Array.from(card.querySelectorAll(".skill-tag, .jobs-skill-tag"))
    .map(el => el.textContent?.trim() || "")
    .filter(Boolean);

  const metaValues = Array.from(card.querySelectorAll(".meta-val-row, .job-meta-item"))
    .map(el => el.textContent?.trim() || "")
    .filter(Boolean);

  const fullText = `${title} ${employer} ${skills.join(" ")} ${metaValues.join(" ")}`.toLowerCase();

  return {
    title,
    employer,
    skills,
    metaValues,
    fullText
  };
}

async function rewriteSearchQuery(query) {
  const prompt = `
You are a smart search assistant for a blue-collar jobs app.

Analyze the search query and return JSON only with this exact structure:
{
  "keywords": ["..."],
  "jobType": ["..."],
  "location": ["..."],
  "synonyms": ["..."]
}

Rules:
- Expand the query into related blue-collar job terms
- Infer job type when possible
- Infer location keywords if present
- Add practical synonyms
- Keep the arrays short and useful
- Return JSON only

Query: ${query}
  `;

  const result = await model.generateContent(prompt);
  const text = result.response.text().trim();

  try {
    return JSON.parse(text);
  } catch (error) {
    console.error("AI search parse failed:", error, text);
    return {
      keywords: [query],
      jobType: [],
      location: [],
      synonyms: []
    };
  }
}

function normalizeTerms(values) {
  return (values || [])
    .map(v => String(v).toLowerCase().trim())
    .filter(Boolean);
}

async function runAIHeaderSearch(query) {
  const cards = collectAllCards();

  if (!query.trim()) {
    cards.forEach(card => {
      card.style.display = "";
      card.style.order = "0";
    });
    return;
  }

  const parsed = await rewriteSearchQuery(query);

  const keywords = normalizeTerms(parsed.keywords);
  const jobTypes = normalizeTerms(parsed.jobType);
  const locations = normalizeTerms(parsed.location);
  const synonyms = normalizeTerms(parsed.synonyms);

  const allTerms = [...keywords, ...jobTypes, ...locations, ...synonyms];

  cards.forEach(card => {
    const data = getCardData(card);

    let score = 0;

    keywords.forEach(term => {
      if (data.fullText.includes(term)) score += 25;
    });

    jobTypes.forEach(term => {
      if (data.fullText.includes(term)) score += 20;
    });

    locations.forEach(term => {
      if (data.fullText.includes(term)) score += 18;
    });

    synonyms.forEach(term => {
      if (data.fullText.includes(term)) score += 12;
    });

    // exact title boost
    if (keywords.some(term => data.title.toLowerCase().includes(term))) {
      score += 20;
    }

    // exact employer/location boost
    if (locations.some(term => data.fullText.includes(term))) {
      score += 10;
    }

    const matched = allTerms.length > 0 && score > 0;

    card.style.display = matched ? "" : "none";
    card.style.order = String(1000 - score);

    const matchFill = card.querySelector(".match-fill");
    if (matchFill) {
      const width = Math.max(15, Math.min(score, 100));
      matchFill.style.width = `${width}%`;
    }
  });

  const visibleCards = cards
    .filter(card => card.style.display !== "none")
    .sort((a, b) => Number(a.style.order || 0) - Number(b.style.order || 0));

  const homeContainer = document.querySelector("#page-home .jobs-list");
  const savedContainer = document.querySelector("#job-items-list");

  visibleCards.forEach(card => {
    if (card.closest("#page-home") && homeContainer) {
      homeContainer.appendChild(card);
    } else if (card.closest("#job-items-list") && savedContainer) {
      savedContainer.appendChild(card);
    }
  });
}

export function initAIHeaderSearch() {
  console.log("AI SEARCH STARTED");

  const input = document.querySelector(".search-bar input");

  if (!input) {
    console.error("SEARCH INPUT NOT FOUND");
    return;
  }

  console.log("SEARCH INPUT FOUND");

  let timer = null;

  input.addEventListener("input", () => {
    console.log("TYPING:", input.value);

    clearTimeout(timer);

    timer = setTimeout(() => {
      console.log("RUNNING AI SEARCH");
      runAIHeaderSearch(input.value);
    }, 450);
  });
}