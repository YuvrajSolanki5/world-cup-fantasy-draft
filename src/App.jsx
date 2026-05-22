import React, { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  ArrowDown,
  ArrowLeftRight,
  ArrowUp,
  BarChart3,
  BookOpen,
  Bot,
  CheckCircle2,
  ChevronDown,
  Clock,
  Coins,
  Copy,
  Gavel,
  Globe2,
  LayoutDashboard,
  Link2,
  ListPlus,
  Lock,
  LogOut,
  Mail,
  Pause,
  Play,
  Plus,
  RefreshCw,
  Save,
  Search,
  Send,
  Settings,
  ShieldCheck,
  SkipForward,
  SlidersHorizontal,
  Star,
  Target,
  Trash2,
  Trophy,
  Upload,
  UserPlus,
} from "./icons.jsx";

const STORAGE_KEY = "wc-fantasy-draft-workspace-v5";

const POSITION_SLOTS = [
  "GK",
  "GK",
  "GK",
  "DEF",
  "DEF",
  "DEF",
  "DEF",
  "DEF",
  "DEF",
  "DEF",
  "DEF",
  "MID",
  "MID",
  "MID",
  "MID",
  "MID",
  "MID",
  "MID",
  "MID",
  "FWD",
  "FWD",
  "FWD",
  "FWD",
  "FWD",
  "FWD",
  "FWD",
];

const WORLD_CUP_TEAMS = [
  ["ARG", "Argentina", "#75aadb", "#f6c453", "A"],
  ["BRA", "Brazil", "#f8e547", "#179b55", "B"],
  ["ENG", "England", "#f7f7f7", "#d30f28", "C"],
  ["FRA", "France", "#1f4fa3", "#ed2939", "D"],
  ["POR", "Portugal", "#006f4e", "#da291c", "E"],
  ["ESP", "Spain", "#c60b1e", "#ffc400", "B"],
  ["GER", "Germany", "#ffffff", "#111111", "F"],
  ["NED", "Netherlands", "#ff6c2f", "#1d4ed8", "A"],
  ["BEL", "Belgium", "#111111", "#ffd90c", "E"],
  ["USA", "United States", "#1f4fa3", "#bf0d3e", "D"],
  ["MEX", "Mexico", "#006847", "#ce1126", "A"],
  ["URU", "Uruguay", "#7ec8e3", "#111111", "F"],
  ["CRO", "Croatia", "#ffffff", "#d21f3c", "C"],
  ["MAR", "Morocco", "#c1272d", "#006233", "B"],
  ["JPN", "Japan", "#f7f7f7", "#bc002d", "E"],
  ["SEN", "Senegal", "#00853f", "#fdef42", "D"],
  ["KOR", "Korea Republic", "#ffffff", "#c60c30", "C"],
  ["AUS", "Australia", "#ffcd00", "#007a3d", "F"],
  ["CAN", "Canada", "#ffffff", "#d52b1e", "B"],
  ["GHA", "Ghana", "#fcd116", "#006b3f", "A"],
  ["COL", "Colombia", "#fcd116", "#003893", "C"],
  ["ECU", "Ecuador", "#ffdd00", "#034ea2", "E"],
  ["SUI", "Switzerland", "#d52b1e", "#ffffff", "D"],
  ["DEN", "Denmark", "#c60c30", "#ffffff", "F"],
  ["SWE", "Sweden", "#006aa7", "#fecc00", "A"],
  ["NOR", "Norway", "#ba0c2f", "#00205b", "B"],
  ["POL", "Poland", "#ffffff", "#dc143c", "C"],
  ["TUN", "Tunisia", "#e70013", "#ffffff", "D"],
  ["EGY", "Egypt", "#ce1126", "#ffffff", "E"],
  ["NGA", "Nigeria", "#008753", "#ffffff", "F"],
  ["CMR", "Cameroon", "#007a5e", "#ce1126", "A"],
  ["QAT", "Qatar", "#8a1538", "#ffffff", "B"],
  ["KSA", "Saudi Arabia", "#006c35", "#ffffff", "C"],
  ["IRN", "IR Iran", "#239f40", "#da0000", "D"],
  ["NZL", "New Zealand", "#111827", "#c8102e", "E"],
  ["PAR", "Paraguay", "#d52b1e", "#0038a8", "F"],
  ["CHI", "Chile", "#d52b1e", "#0039a6", "A"],
  ["PER", "Peru", "#ffffff", "#d91023", "B"],
  ["RSA", "South Africa", "#007749", "#ffb612", "C"],
  ["CIV", "Cote d'Ivoire", "#f77f00", "#009e60", "D"],
  ["TUR", "Turkiye", "#e30a17", "#ffffff", "E"],
  ["AUT", "Austria", "#ed2939", "#ffffff", "F"],
  ["CZE", "Czechia", "#d7141a", "#11457e", "A"],
  ["SCO", "Scotland", "#005eb8", "#ffffff", "B"],
  ["PAN", "Panama", "#005293", "#d21034", "C"],
  ["CRC", "Costa Rica", "#002b7f", "#ce1126", "D"],
  ["JAM", "Jamaica", "#009b3a", "#fed100", "E"],
  ["HND", "Honduras", "#00bce4", "#ffffff", "F"],
];

const STAR_NAMES = {
  Argentina: ["Lionel Messi", "Emiliano Martinez", "Lautaro Martinez", "Julian Alvarez", "Enzo Fernandez"],
  Brazil: ["Vinicius Jr.", "Neymar", "Alisson Becker", "Raphinha", "Endrick"],
  England: ["Jude Bellingham", "Harry Kane", "Bukayo Saka", "Phil Foden", "Declan Rice"],
  France: ["Kylian Mbappe", "Ousmane Dembele", "Antoine Griezmann", "Aurelien Tchouameni", "William Saliba"],
  Portugal: ["Cristiano Ronaldo", "Bruno Fernandes", "Bernardo Silva", "Rafael Leao", "Ruben Dias"],
  Spain: ["Lamine Yamal", "Pedri", "Rodri", "Nico Williams", "Dani Olmo"],
  Germany: ["Jamal Musiala", "Florian Wirtz", "Kai Havertz", "Joshua Kimmich", "Antonio Rudiger"],
  Netherlands: ["Virgil van Dijk", "Frenkie de Jong", "Xavi Simons", "Cody Gakpo", "Denzel Dumfries"],
  Belgium: ["Kevin De Bruyne", "Romelu Lukaku", "Thibaut Courtois", "Jeremy Doku", "Youri Tielemans"],
  "United States": ["Christian Pulisic", "Weston McKennie", "Tyler Adams", "Gio Reyna", "Antonee Robinson"],
  Mexico: ["Santiago Gimenez", "Edson Alvarez", "Hirving Lozano", "Luis Chavez", "Guillermo Ochoa"],
  Uruguay: ["Federico Valverde", "Darwin Nunez", "Ronald Araujo", "Manuel Ugarte", "Jose Maria Gimenez"],
  Croatia: ["Luka Modric", "Josko Gvardiol", "Mateo Kovacic", "Andrej Kramaric", "Dominik Livakovic"],
  Morocco: ["Achraf Hakimi", "Yassine Bounou", "Hakim Ziyech", "Sofyan Amrabat", "Youssef En-Nesyri"],
  Japan: ["Takefusa Kubo", "Kaoru Mitoma", "Wataru Endo", "Daichi Kamada", "Zion Suzuki"],
  Senegal: ["Sadio Mane", "Kalidou Koulibaly", "Ismaila Sarr", "Nicolas Jackson", "Edouard Mendy"],
  "Korea Republic": ["Son Heung-min", "Kim Min-jae", "Lee Kang-in", "Hwang Hee-chan", "Lee Jae-sung"],
  Australia: ["Mathew Ryan", "Jackson Irvine", "Craig Goodwin", "Harry Souttar", "Riley McGree"],
};

const GK_STAR_NAMES = new Set([
  "Alisson Becker",
  "Thibaut Courtois",
  "Yassine Bounou",
  "Guillermo Ochoa",
  "Dominik Livakovic",
  "Zion Suzuki",
  "Edouard Mendy",
  "Mathew Ryan",
  "Emiliano Martinez",
]);

const DEF_STAR_NAMES = new Set([
  "William Saliba",
  "Ruben Dias",
  "Antonio Rudiger",
  "Virgil van Dijk",
  "Denzel Dumfries",
  "Achraf Hakimi",
  "Kim Min-jae",
  "Antonee Robinson",
  "Ronald Araujo",
  "Jose Maria Gimenez",
  "Josko Gvardiol",
  "Kalidou Koulibaly",
  "Harry Souttar",
]);

const MID_STAR_NAMES = new Set([
  "Enzo Fernandez",
  "Jude Bellingham",
  "Declan Rice",
  "Antoine Griezmann",
  "Aurelien Tchouameni",
  "Bruno Fernandes",
  "Bernardo Silva",
  "Pedri",
  "Rodri",
  "Dani Olmo",
  "Jamal Musiala",
  "Florian Wirtz",
  "Joshua Kimmich",
  "Frenkie de Jong",
  "Xavi Simons",
  "Kevin De Bruyne",
  "Youri Tielemans",
  "Weston McKennie",
  "Tyler Adams",
  "Gio Reyna",
  "Edson Alvarez",
  "Luis Chavez",
  "Federico Valverde",
  "Manuel Ugarte",
  "Luka Modric",
  "Mateo Kovacic",
  "Sofyan Amrabat",
  "Wataru Endo",
  "Daichi Kamada",
  "Jackson Irvine",
  "Riley McGree",
]);

const FWD_STAR_NAMES = new Set([
  "Lionel Messi",
  "Lautaro Martinez",
  "Julian Alvarez",
  "Vinicius Jr.",
  "Neymar",
  "Raphinha",
  "Endrick",
  "Harry Kane",
  "Bukayo Saka",
  "Phil Foden",
  "Kylian Mbappe",
  "Ousmane Dembele",
  "Cristiano Ronaldo",
  "Rafael Leao",
  "Lamine Yamal",
  "Nico Williams",
  "Kai Havertz",
  "Cody Gakpo",
  "Romelu Lukaku",
  "Jeremy Doku",
  "Santiago Gimenez",
  "Hirving Lozano",
  "Darwin Nunez",
  "Andrej Kramaric",
  "Hakim Ziyech",
  "Youssef En-Nesyri",
  "Takefusa Kubo",
  "Kaoru Mitoma",
  "Sadio Mane",
  "Ismaila Sarr",
  "Nicolas Jackson",
  "Son Heung-min",
  "Hwang Hee-chan",
  "Craig Goodwin",
]);

function inferStarPosition(name, starIndex) {
  if (GK_STAR_NAMES.has(name)) return "GK";
  if (DEF_STAR_NAMES.has(name)) return "DEF";
  if (MID_STAR_NAMES.has(name)) return "MID";
  if (FWD_STAR_NAMES.has(name)) return "FWD";
  return starIndex === 0 ? "FWD" : "MID";
}

const DEFAULT_SCORING = {
  start: 1,
  goalGK: 10,
  goalDEF: 8,
  goalMID: 6,
  goalFWD: 5,
  assist: 3,
  cleanSheetGK: 5,
  cleanSheetDEF: 4,
  penaltySave: 5,
  save: 1,
  yellow: -1,
  red: -3,
};

const SCORING_LABELS = {
  start: "Started or appeared",
  goalGK: "Goal by goalkeeper",
  goalDEF: "Goal by defender",
  goalMID: "Goal by midfielder",
  goalFWD: "Goal by forward",
  assist: "Assist",
  cleanSheetGK: "Goalkeeper clean sheet",
  cleanSheetDEF: "Defender clean sheet",
  penaltySave: "Penalty save",
  save: "Goalkeeper save",
  yellow: "Yellow card",
  red: "Red card",
};

const EMPTY_PLAYER_STATS = {
  appearances: 0,
  starts: 0,
  minutes: 0,
  goals: 0,
  assists: 0,
  cleanSheets: 0,
  saves: 0,
  penaltySaves: 0,
  yellowCards: 0,
  redCards: 0,
  apiRating: 0,
};

const STAT_COLUMNS = [
  ["rating", "Rating"],
  ["expected", "Proj"],
  ["points", "Pts"],
  ["appearances", "Apps"],
  ["minutes", "Min"],
  ["goals", "G"],
  ["assists", "A"],
  ["cleanSheets", "CS"],
  ["saves", "Saves"],
  ["yellowCards", "YC"],
  ["redCards", "RC"],
];

const DEFAULT_STATS_API = {
  provider: "Demo Stats API",
  apiSportsKey: "",
  leagueId: "1",
  season: "2026",
  dateFrom: "2026-06-11",
  dateTo: "2026-07-19",
  lastSyncAt: "",
  lastSyncSource: "",
};

const DEFAULT_SETTINGS = {
  draftType: "Snake Draft",
  format: "Head to Head",
  visibility: "Private",
  startMode: "Manual",
  scheduledAt: "",
  worldCupStartDate: "2026-06-11",
  maxManagers: 12,
  squadSize: 15,
  starters: 11,
  bench: 4,
  pickTimer: 45,
  budget: 100,
  mockDraft: true,
  autoDraftEnabled: true,
  tradeReview: "Manager approval",
  waivers: "Rolling waivers",
  statsApi: DEFAULT_STATS_API,
  scoring: DEFAULT_SCORING,
};

const BOT_NAMES = [
  "North Stand FC",
  "Golden Boot Room",
  "Penalty Merchants",
  "Clean Sheet Union",
  "Midfield Engine",
  "Last Pick Legends",
  "Group Stage Giants",
  "Counter Press Crew",
  "Extra Time XI",
  "Set Piece Lab",
  "VAR Survivors",
];

const TACTICS = ["Value", "Stars", "Balanced", "Defence", "Attack"];

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function makeId(prefix) {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}`;
}

function makeInviteCode() {
  return Math.random().toString(36).slice(2, 8).toUpperCase();
}

function formatTimer(seconds) {
  const safe = Math.max(0, Number(seconds) || 0);
  return `${Math.floor(safe / 60)}:${String(safe % 60).padStart(2, "0")}`;
}

function normalizeName(value) {
  return String(value || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function getAuctionBudget(settings) {
  return settings.draftType === "Auction Draft" ? clamp(Number(settings.budget) || 100, 50, 500) : 0;
}

function getManagerBudgetLabel(league, manager) {
  return league.settings.draftType === "Auction Draft" ? ` - $${manager.budget}` : "";
}

function getReadableTextColor(hex) {
  const clean = String(hex || "").replace("#", "");
  if (clean.length !== 6) return "#ffffff";
  const red = parseInt(clean.slice(0, 2), 16);
  const green = parseInt(clean.slice(2, 4), 16);
  const blue = parseInt(clean.slice(4, 6), 16);
  const luminance = (0.299 * red + 0.587 * green + 0.114 * blue) / 255;
  return luminance > 0.6 ? "#071225" : "#ffffff";
}

function getWorldCupStartDate(league) {
  return league?.settings?.worldCupStartDate || DEFAULT_SETTINGS.worldCupStartDate;
}

function hasWorldCupStarted(league, now = new Date()) {
  if (!league) return false;
  const startDate = getWorldCupStartDate(league);
  if (!startDate) return league.status === "live";
  return now >= new Date(`${startDate}T00:00:00`);
}

function canOpenDraft(league) {
  return Boolean(league && league.status !== "live" && !hasWorldCupStarted(league));
}

function canOpenLeaguePages(league) {
  return Boolean(league);
}

function restartLeagueDraftState(league, message = "Draft restarted. Waiting for the commissioner to start.") {
  return {
    ...league,
    status: "lobby",
    managers: league.managers.map((manager) => ({
      ...manager,
      budget: getAuctionBudget(league.settings),
      squad: [],
      starters: [],
    })),
    draft: {
      ...league.draft,
      log: [],
      paused: false,
      nominatedPlayerId: "",
      highBid: 0,
      highBidderEmail: "",
      order: league.managers.map((manager) => manager.email),
      message,
    },
    activity: [{ id: makeId("activity"), text: "Draft restarted", createdAt: new Date().toISOString() }, ...league.activity],
  };
}

function encodeInvitePayload(league) {
  const snapshot = {
    name: league.name,
    inviteCode: league.inviteCode,
    ownerEmail: league.ownerEmail,
    settings: {
      ...league.settings,
      statsApi: { ...DEFAULT_STATS_API, ...(league.settings.statsApi || {}), apiSportsKey: "" },
    },
    managers: league.managers
      .filter((manager) => manager.isBot || manager.email === league.ownerEmail)
      .map((manager) => ({
        email: manager.email,
        teamName: manager.teamName,
        isBot: manager.isBot,
        tactic: manager.tactic,
        waiverRank: manager.waiverRank,
      })),
  };

  return window.btoa(window.encodeURIComponent(JSON.stringify(snapshot)));
}

function decodeInvitePayload(value) {
  if (!value) return null;

  try {
    return JSON.parse(window.decodeURIComponent(window.atob(value)));
  } catch {
    return null;
  }
}

function getInviteFromUrl() {
  if (typeof window === "undefined") return null;
  const params = new URLSearchParams(window.location.search);
  const code = params.get("join")?.trim().toUpperCase();
  if (!code) return null;
  return {
    code,
    payload: decodeInvitePayload(params.get("league")),
    key: `${code}:${params.get("league") || ""}`,
  };
}

function clearInviteFromUrl() {
  if (typeof window === "undefined") return;
  const url = new URL(window.location.href);
  url.searchParams.delete("join");
  url.searchParams.delete("league");
  window.history.replaceState({}, "", `${url.pathname}${url.search}${url.hash}`);
}

function makeInviteUrl(league) {
  if (typeof window === "undefined") return "";
  const url = new URL(window.location.origin + window.location.pathname);
  url.searchParams.set("join", league.inviteCode);
  url.searchParams.set("league", encodeInvitePayload(league));
  return url.toString();
}

function rehydrateInvitedLeague(payload) {
  if (!payload?.inviteCode) return null;
  const cleanSettings = {
    ...DEFAULT_SETTINGS,
    ...(payload.settings || {}),
    scoring: { ...DEFAULT_SCORING, ...(payload.settings?.scoring || {}) },
    statsApi: { ...DEFAULT_STATS_API, ...(payload.settings?.statsApi || {}) },
  };
  const budget = getAuctionBudget(cleanSettings);
  const managers = (payload.managers?.length ? payload.managers : [])
    .slice(0, cleanSettings.maxManagers)
    .map((manager, index) => ({
      ...makeManager(manager.email || `bot${index + 1}@draft.local`, manager.teamName, budget, Boolean(manager.isBot), index),
      tactic: manager.tactic || TACTICS[index % TACTICS.length],
      waiverRank: manager.waiverRank || index + 1,
    }));

  return {
    id: makeId("league"),
    name: payload.name || "Invited World Cup League",
    inviteCode: payload.inviteCode,
    ownerEmail: payload.ownerEmail || managers[0]?.email || "",
    status: "lobby",
    createdAt: new Date().toISOString(),
    settings: cleanSettings,
    managers,
    draft: {
      order: managers.map((manager) => manager.email),
      log: [],
      paused: false,
      nominatedPlayerId: "",
      highBid: 0,
      highBidderEmail: "",
      message: "Joined from invite link. Waiting for the commissioner to start the draft.",
    },
    trades: [],
    waivers: [],
    activity: [{ id: makeId("activity"), text: "League imported from invite link", createdAt: new Date().toISOString() }],
  };
}

function joinLeagueByInvite(db, invite, currentUserEmail, teamName = "My XI") {
  const code = invite?.code?.trim().toUpperCase();
  if (!code) return { db, leagueId: "", message: "Invite link is missing a code." };

  let leagues = db.leagues;
  let target = leagues.find((league) => league.inviteCode === code);
  let imported = false;

  if (!target && invite.payload) {
    target = rehydrateInvitedLeague(invite.payload);
    if (target) {
      imported = true;
      leagues = [...leagues, target];
    }
  }

  if (!target) return { db, leagueId: "", message: "No local league was found for that invite code." };

  if (target.managers.some((manager) => manager.email === currentUserEmail)) {
    return { db: { ...db, leagues }, leagueId: target.id, message: "You are already in that league." };
  }

  if (target.managers.length >= target.settings.maxManagers) {
    return { db: { ...db, leagues }, leagueId: target.id, message: "That league is full." };
  }

  const manager = makeManager(currentUserEmail, teamName, getAuctionBudget(target.settings), false, target.managers.length);
  const updatedLeagues = leagues.map((league) =>
    league.id === target.id
      ? {
          ...league,
          managers: [...league.managers, manager],
          draft: { ...league.draft, order: [...league.draft.order, manager.email] },
          activity: [{ id: makeId("activity"), text: `${manager.teamName} joined the league`, createdAt: new Date().toISOString() }, ...league.activity],
        }
      : league
  );

  return {
    db: { ...db, leagues: updatedLeagues },
    leagueId: target.id,
    message: imported ? "Invite imported and joined. In a real deployment this would sync through the backend." : "Joined league from invite.",
  };
}

function generateWorldCupPool() {
  let id = 1;

  return WORLD_CUP_TEAMS.flatMap(([code, country, primary, secondary, group]) => {
    const stars = STAR_NAMES[country] || [];

    return POSITION_SLOTS.map((pos, index) => {
      const positionOrdinal = POSITION_SLOTS.slice(0, index).filter((slot) => slot === pos).length;
      const seededName = stars
        .map((name, starIndex) => ({ name, pos: inferStarPosition(name, starIndex) }))
        .filter((star) => star.pos === pos)[positionOrdinal]?.name;
      const premium = seededName ? 10 - Math.min(positionOrdinal, 4) : Math.max(0, 6 - Math.floor(index / 3));
      const baseRating = pos === "FWD" ? 78 : pos === "MID" ? 76 : pos === "DEF" ? 73 : 72;
      const rating = clamp(baseRating + premium + Math.floor(Math.random() * 7), 60, 99);
      const expected = Math.round(rating * (pos === "FWD" ? 1.92 : pos === "MID" ? 1.72 : pos === "DEF" ? 1.48 : 1.35));
      const price = clamp(Math.round((rating - 58) / 2.2), 5, 30);

      return {
        id: id++,
        name: seededName || `${country} ${pos} ${index + 1}`,
        country,
        code,
        group,
        pos,
        club: seededName ? "International" : "Final squad slot",
        rating,
        expected,
        price,
        points: 0,
        stats: { ...EMPTY_PLAYER_STATS },
        news: seededName ? "Projected starter" : "Roster placeholder",
        selectedBy: "",
        colors: [primary, secondary],
      };
    });
  });
}

const FALLBACK_POOL = generateWorldCupPool();

function getEmptyDb() {
  return {
    accounts: [],
    currentUserEmail: "",
    leagues: [],
    playerPool: FALLBACK_POOL,
  };
}

function normalizeDb(input) {
  const empty = getEmptyDb();
  const playerPool = Array.isArray(input?.playerPool) && input.playerPool.length ? input.playerPool : FALLBACK_POOL;
  const leagues = Array.isArray(input?.leagues) ? input.leagues : empty.leagues;

  return {
    ...empty,
    ...input,
    accounts: Array.isArray(input?.accounts)
      ? input.accounts.map((account) => ({ email: account.email, displayName: account.displayName || account.teamName || account.email }))
      : empty.accounts,
    leagues: leagues.map((league) => ({
      ...league,
      settings: {
        ...DEFAULT_SETTINGS,
        ...(league.settings || {}),
        statsApi: { ...DEFAULT_STATS_API, ...(league.settings?.statsApi || {}) },
        scoring: { ...DEFAULT_SCORING, ...(league.settings?.scoring || {}) },
      },
      activity: Array.isArray(league.activity) ? league.activity : [],
      trades: Array.isArray(league.trades) ? league.trades : [],
      waivers: Array.isArray(league.waivers) ? league.waivers : [],
      draft: {
        order: league.draft?.order || league.managers?.map((manager) => manager.email) || [],
        log: league.draft?.log || [],
        paused: Boolean(league.draft?.paused),
        nominatedPlayerId: league.draft?.nominatedPlayerId || "",
        highBid: league.draft?.highBid || 0,
        highBidderEmail: league.draft?.highBidderEmail || "",
        message: league.draft?.message || "Waiting for the commissioner to start the draft.",
      },
      managers: (league.managers || []).map((manager, index) => ({
        ...manager,
        budget: league.settings?.draftType === "Auction Draft" ? manager.budget ?? getAuctionBudget(league.settings) : 0,
        squad: Array.isArray(manager.squad) ? manager.squad : [],
        starters: Array.isArray(manager.starters) ? manager.starters : [],
        watchlist: Array.isArray(manager.watchlist) ? manager.watchlist : [],
        queue: Array.isArray(manager.queue) ? manager.queue : [],
        waiverRank: manager.waiverRank || index + 1,
      })),
    })),
    playerPool: playerPool.map((player) => ({
      ...player,
      points: Number(player.points) || 0,
      stats: { ...EMPTY_PLAYER_STATS, ...(player.stats || {}) },
    })),
  };
}

function loadDb() {
  if (typeof window === "undefined") return getEmptyDb();

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? normalizeDb(JSON.parse(raw)) : getEmptyDb();
  } catch {
    return getEmptyDb();
  }
}

function saveDb(db) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
}

async function authRequest(mode, payload) {
  const response = await fetch(`/api/auth/${mode}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(payload),
  });
  const contentType = response.headers.get("content-type") || "";
  if (!contentType.includes("application/json")) throw new Error("Secure auth API is not available in local dev.");
  const data = await response.json();
  if (!response.ok || !data.ok) throw new Error(data.error || "Secure auth failed.");
  return data.user;
}

async function readApiJson(response, unavailableMessage) {
  const contentType = response.headers.get("content-type") || "";
  if (!contentType.includes("application/json")) throw new Error(unavailableMessage);
  const data = await response.json();
  if (!response.ok || !data.ok) throw new Error(data.error || unavailableMessage);
  return data;
}

function canUseLocalInviteFallback(error) {
  const message = String(error?.message || error || "");
  return /Remote league API is not available|Failed to fetch|NetworkError/i.test(message);
}

function stripLeagueSecrets(league) {
  return {
    ...league,
    settings: {
      ...league.settings,
      statsApi: { ...DEFAULT_STATS_API, ...(league.settings?.statsApi || {}), apiSportsKey: "" },
    },
  };
}

async function fetchRemoteLeagues() {
  const response = await fetch("/api/leagues", { credentials: "include" });
  const data = await readApiJson(response, "Remote league API is not available in local dev.");
  return Array.isArray(data.leagues) ? data.leagues : [];
}

async function saveRemoteLeague(league) {
  const response = await fetch("/api/leagues", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ league: stripLeagueSecrets(league) }),
  });
  return readApiJson(response, "Remote league API is not available in local dev.");
}

async function joinRemoteLeague(inviteCode, teamName) {
  const response = await fetch("/api/leagues/join", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ inviteCode, teamName }),
  });
  const data = await readApiJson(response, "Remote league API is not available in local dev.");
  return data.league;
}

function mergeRemoteLeagues(db, remoteLeagues) {
  if (!Array.isArray(remoteLeagues) || remoteLeagues.length === 0) return db;
  const byId = new Map(db.leagues.map((league) => [league.id, league]));
  remoteLeagues.forEach((league) => {
    if (league?.id) byId.set(league.id, league);
  });
  const leagues = [...byId.values()];
  if (JSON.stringify(leagues) === JSON.stringify(db.leagues)) return db;
  return normalizeDb({ ...db, leagues });
}

function upsertLocalAccount(accounts, user) {
  const cleanEmail = user.email.trim().toLowerCase();
  const cleanUser = { email: cleanEmail, displayName: user.displayName || user.teamName || cleanEmail.split("@")[0] };
  return accounts.some((account) => account.email === cleanEmail)
    ? accounts.map((account) => (account.email === cleanEmail ? { ...account, ...cleanUser, password: undefined } : account))
    : [...accounts, cleanUser];
}

function makeManager(email, teamName, budget = 0, isBot = false, seed = 0) {
  return {
    email,
    teamName: teamName || `${email.split("@")[0]}'s XI`,
    budget: Number(budget) || 0,
    squad: [],
    starters: [],
    watchlist: [],
    queue: [],
    isBot,
    tactic: TACTICS[seed % TACTICS.length],
    waiverRank: seed + 1,
  };
}

function makeLeague({ leagueName, teamName, ownerEmail, settings }) {
  const id = makeId("league");
  const inviteCode = makeInviteCode();
  const cleanSettings = {
    ...DEFAULT_SETTINGS,
    ...settings,
    maxManagers: clamp(Number(settings.maxManagers) || 12, 2, 24),
    squadSize: clamp(Number(settings.squadSize) || 15, 11, 26),
    starters: clamp(Number(settings.starters) || 11, 6, 15),
    bench: clamp(Number(settings.bench) || 4, 0, 15),
    pickTimer: clamp(Number(settings.pickTimer) || 45, 10, 180),
    budget: getAuctionBudget(settings),
    statsApi: { ...DEFAULT_STATS_API, ...(settings.statsApi || {}) },
    scoring: { ...DEFAULT_SCORING, ...(settings.scoring || {}) },
  };
  const managers = [makeManager(ownerEmail, teamName || "My XI", getAuctionBudget(cleanSettings))];

  if (cleanSettings.mockDraft) {
    const botCount = Math.min(cleanSettings.maxManagers - 1, 7);
    for (let index = 0; index < botCount; index += 1) {
      managers.push(makeManager(`bot${index + 1}@draft.local`, BOT_NAMES[index], getAuctionBudget(cleanSettings), true, index));
    }
  }

  return {
    id,
    name: leagueName || "World Cup League",
    inviteCode,
    ownerEmail,
    status: "lobby",
    createdAt: new Date().toISOString(),
    settings: cleanSettings,
    managers,
    draft: {
      order: managers.map((manager) => manager.email),
      log: [],
      paused: false,
      nominatedPlayerId: "",
      highBid: 0,
      highBidderEmail: "",
      message: "Waiting for the commissioner to start the draft.",
    },
    trades: [],
    waivers: [],
    activity: [
      {
        id: makeId("activity"),
        text: "League created",
        createdAt: new Date().toISOString(),
      },
    ],
  };
}

function draftProgress(league) {
  const drafted = league?.draft?.log?.length || 0;
  const total = (league?.managers?.length || 0) * (league?.settings?.squadSize || 0);
  return { drafted, total, percent: total ? Math.round((drafted / total) * 100) : 0 };
}

function getCurrentPicker(league) {
  if (!league || !league.managers.length) return null;
  const picksMade = league.draft.log.length;
  const roundIndex = Math.floor(picksMade / league.managers.length);
  const pickInRound = picksMade % league.managers.length;
  const order = league.draft.order.length ? league.draft.order : league.managers.map((m) => m.email);
  const snakeOrder = roundIndex % 2 === 0 ? order : [...order].reverse();
  const email = snakeOrder[pickInRound];

  return {
    email,
    round: roundIndex + 1,
    pick: picksMade + 1,
    pickInRound: pickInRound + 1,
    manager: league.managers.find((manager) => manager.email === email),
  };
}

function getAvailablePlayers(players, league) {
  const drafted = new Set(league?.draft?.log?.map((entry) => entry.playerId) || []);
  return players.filter((player) => !drafted.has(player.id));
}

function managerScore(manager, players, mode = "expected") {
  const key = mode === "live" ? "points" : "expected";
  return (manager.squad || []).reduce((sum, id) => {
    const player = players.find((candidate) => candidate.id === id);
    return sum + (player?.[key] || 0);
  }, 0);
}

function pickLineup(manager, players, starters = 11) {
  return (manager.squad || [])
    .map((id) => players.find((player) => player.id === id))
    .filter(Boolean)
    .sort((a, b) => b.expected - a.expected)
    .slice(0, starters);
}

function calculateFantasyPoints(player, scoring) {
  const stats = { ...EMPTY_PLAYER_STATS, ...(player.stats || {}) };
  const goalKey = player.pos === "GK" ? "goalGK" : player.pos === "DEF" ? "goalDEF" : player.pos === "MID" ? "goalMID" : "goalFWD";

  return (
    stats.appearances * scoring.start +
    stats.goals * scoring[goalKey] +
    stats.assists * scoring.assist +
    (["GK", "DEF"].includes(player.pos)
      ? stats.cleanSheets * (player.pos === "GK" ? scoring.cleanSheetGK : scoring.cleanSheetDEF)
      : 0) +
    stats.penaltySaves * scoring.penaltySave +
    stats.saves * scoring.save +
    stats.yellowCards * scoring.yellow +
    stats.redCards * scoring.red
  );
}

function makeDemoStats(player) {
  const starBoost = player.news === "Projected starter" ? 1 : 0;
  const appearances = player.rating > 76 ? 1 : 0;
  const minutes = appearances ? clamp(55 + Math.round((player.rating - 70) * 2.2), 18, 96) : 0;
  const goals = appearances && player.pos === "FWD" && player.rating > 84 ? 1 + (player.rating > 92 ? 1 : 0) : appearances && player.pos === "MID" && player.rating > 88 ? 1 : 0;
  const assists = appearances && ["MID", "FWD"].includes(player.pos) && player.rating > 82 ? 1 : 0;
  const cleanSheets = appearances && ["GK", "DEF"].includes(player.pos) && player.rating > 81 ? 1 : 0;
  const saves = appearances && player.pos === "GK" ? 2 + (player.rating % 5) : 0;
  const yellowCards = appearances && player.rating % 13 === 0 ? 1 : 0;

  return {
    appearances,
    starts: appearances && minutes >= 60 ? 1 : 0,
    minutes,
    goals,
    assists: assists + starBoost,
    cleanSheets,
    saves,
    penaltySaves: appearances && player.pos === "GK" && player.rating > 90 ? 1 : 0,
    yellowCards,
    redCards: 0,
    apiRating: appearances ? Number((6.2 + (player.rating - 70) / 18).toFixed(1)) : 0,
  };
}

function mergeStats(base, incoming) {
  return Object.keys(EMPTY_PLAYER_STATS).reduce(
    (stats, key) => ({ ...stats, [key]: (Number(base?.[key]) || 0) + (Number(incoming?.[key]) || 0) }),
    {}
  );
}

function matchPlayerStatRecord(player, records) {
  const byNameCountry = `${normalizeName(player.name)}|${normalizeName(player.country)}`;
  return records.get(byNameCountry) || records.get(normalizeName(player.name));
}

function applyStatRecordsToPlayers(players, records, scoring) {
  return players.map((player) => {
    const importedStats = matchPlayerStatRecord(player, records);
    const stats = importedStats ? { ...EMPTY_PLAYER_STATS, ...importedStats } : { ...EMPTY_PLAYER_STATS };
    return {
      ...player,
      stats,
      points: calculateFantasyPoints({ ...player, stats }, scoring),
      news: importedStats ? "Stats synced" : player.news,
    };
  });
}

function aggregateDemoStats(players) {
  const records = new Map();
  players.forEach((player) => {
    const stats = makeDemoStats(player);
    records.set(`${normalizeName(player.name)}|${normalizeName(player.country)}`, stats);
    records.set(normalizeName(player.name), stats);
  });
  return records;
}

function aggregateDemoPayload(payload) {
  const records = new Map();
  (payload.players || []).forEach((item) => {
    const stats = { ...EMPTY_PLAYER_STATS, ...(item.stats || {}) };
    records.set(`${normalizeName(item.name)}|${normalizeName(item.country)}`, stats);
    records.set(normalizeName(item.name), stats);
  });
  return records;
}

function addRecord(records, name, country, stats) {
  const byNameCountry = `${normalizeName(name)}|${normalizeName(country)}`;
  const byName = normalizeName(name);
  records.set(byNameCountry, mergeStats(records.get(byNameCountry), stats));
  records.set(byName, mergeStats(records.get(byName), stats));
}

function aggregateApiFootballFixtures(payload) {
  const records = new Map();

  (payload.response || []).forEach((fixture) => {
    const homeName = fixture.teams?.home?.name;
    const awayName = fixture.teams?.away?.name;
    const homeGoals = Number(fixture.goals?.home) || 0;
    const awayGoals = Number(fixture.goals?.away) || 0;

    (fixture.players || []).forEach((teamBlock) => {
      const teamName = teamBlock.team?.name || "";
      const conceded = teamName === homeName ? awayGoals : teamName === awayName ? homeGoals : 0;

      (teamBlock.players || []).forEach((entry) => {
        const firstLine = entry.statistics?.[0] || {};
        const minutes = Number(firstLine.games?.minutes) || 0;
        const position = firstLine.games?.position || "";
        const cleanSheet = minutes >= 60 && conceded === 0 && ["G", "D", "GK", "DEF"].includes(position);

        addRecord(records, entry.player?.name, teamName, {
          appearances: minutes > 0 ? 1 : 0,
          starts: firstLine.games?.substitute === false ? 1 : 0,
          minutes,
          goals: Number(firstLine.goals?.total) || 0,
          assists: Number(firstLine.goals?.assists) || 0,
          cleanSheets: cleanSheet ? 1 : 0,
          saves: Number(firstLine.goals?.saves) || 0,
          penaltySaves: Number(firstLine.penalty?.saved) || 0,
          yellowCards: Number(firstLine.cards?.yellow) || 0,
          redCards: Number(firstLine.cards?.red) || 0,
          apiRating: Number(firstLine.games?.rating) || 0,
        });
      });
    });
  });

  return records;
}

async function fetchMatchStatRecords(settings, players) {
  const api = { ...DEFAULT_STATS_API, ...(settings.statsApi || {}) };

  if (api.provider === "API-Football") {
    if (!api.apiSportsKey) throw new Error("Add an API-Football key in Settings before syncing from API-Football.");
    const fixtureUrl = new URL("https://v3.football.api-sports.io/fixtures");
    fixtureUrl.searchParams.set("league", api.leagueId || "1");
    fixtureUrl.searchParams.set("season", api.season || "2026");
    fixtureUrl.searchParams.set("status", "FT");
    if (api.dateFrom) fixtureUrl.searchParams.set("from", api.dateFrom);
    if (api.dateTo) fixtureUrl.searchParams.set("to", api.dateTo);

    const fixtureResponse = await fetch(fixtureUrl, { headers: { "x-apisports-key": api.apiSportsKey } });
    if (!fixtureResponse.ok) throw new Error(`API-Football fixtures request failed (${fixtureResponse.status}).`);
    const fixturePayload = await fixtureResponse.json();
    const fixtureIds = (fixturePayload.response || []).slice(0, 20).map((fixture) => fixture.fixture?.id).filter(Boolean);
    if (!fixtureIds.length) return { records: new Map(), source: "API-Football", count: 0 };

    const detailsUrl = new URL("https://v3.football.api-sports.io/fixtures");
    detailsUrl.searchParams.set("ids", fixtureIds.join("-"));
    const detailsResponse = await fetch(detailsUrl, { headers: { "x-apisports-key": api.apiSportsKey } });
    if (!detailsResponse.ok) throw new Error(`API-Football details request failed (${detailsResponse.status}).`);
    const detailsPayload = await detailsResponse.json();
    return { records: aggregateApiFootballFixtures(detailsPayload), source: "API-Football", count: fixtureIds.length };
  }

  const demoResponse = await fetch("/demo-match-stats.json");
  if (demoResponse.ok) {
    const demoPayload = await demoResponse.json();
    return { records: aggregateDemoPayload(demoPayload), source: "Demo Stats API", count: demoPayload.matches?.length || 1 };
  }

  return { records: aggregateDemoStats(players), source: "Generated Demo Stats API", count: 1 };
}

async function syncStatsForLeague({ selectedLeague, db, setDb, setNotice }) {
  if (!selectedLeague) return;

  try {
    const { records, source, count } = await fetchMatchStatRecords(selectedLeague.settings, db.playerPool);
    setDb((old) => ({
      ...old,
      playerPool: applyStatRecordsToPlayers(old.playerPool, records, selectedLeague.settings.scoring),
      leagues: old.leagues.map((league) =>
        league.id === selectedLeague.id
          ? {
              ...league,
              settings: {
                ...league.settings,
                statsApi: {
                  ...DEFAULT_STATS_API,
                  ...(league.settings.statsApi || {}),
                  lastSyncAt: new Date().toISOString(),
                  lastSyncSource: source,
                },
              },
              activity: [{ id: makeId("activity"), text: `Stats synced from ${source}`, createdAt: new Date().toISOString() }, ...league.activity].slice(0, 30),
            }
          : league
      ),
    }));
    setNotice(`${source} synced ${records.size} player stat keys from ${count} match batch${count === 1 ? "" : "es"}.`);
  } catch (error) {
    setNotice(error.message || "Could not sync match stats.");
  }
}

function Kit({ player, size = "md" }) {
  const [primary, secondary] = player.colors || ["#1f2937", "#e5e7eb"];
  return (
    <span
      className={`kit kit-${size}`}
      style={{ "--kit-primary": primary, "--kit-secondary": secondary, "--kit-text": getReadableTextColor(primary) }}
    >
      <span>{player.code}</span>
    </span>
  );
}

function PosBadge({ pos }) {
  return <span className={`pos pos-${pos}`}>{pos}</span>;
}

function Button({ children, variant = "primary", size = "md", icon: Icon, className = "", ...props }) {
  return (
    <button className={`button button-${variant} button-${size} ${className}`} {...props}>
      {Icon ? <Icon size={16} /> : null}
      <span>{children}</span>
    </button>
  );
}

function IconButton({ label, icon: Icon, variant = "ghost", ...props }) {
  return (
    <button className={`icon-button icon-button-${variant}`} aria-label={label} title={label} {...props}>
      <Icon size={16} />
    </button>
  );
}

function Field({ label, children, hint }) {
  return (
    <label className="field">
      <span>{label}</span>
      {children}
      {hint ? <small>{hint}</small> : null}
    </label>
  );
}

function Stat({ label, value, tone = "" }) {
  return (
    <div className={`stat ${tone}`}>
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function HelpTip({ text }) {
  return (
    <span className="help-tip" tabIndex={0} data-tip={text} aria-label={text}>
      ?
    </span>
  );
}

function AuthScreen({ db, setDb, setNotice, pendingInvite }) {
  const [mode, setMode] = useState("signup");
  const [email, setEmail] = useState(db.currentUserEmail || "");
  const [password, setPassword] = useState("");
  const [teamName, setTeamName] = useState("My XI");

  const submit = async () => {
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !password) {
      setNotice("Enter an email and password.");
      return;
    }
    if (password.length < 8) {
      setNotice("Password must be at least 8 characters.");
      return;
    }

    const existing = db.accounts.find((account) => account.email === cleanEmail);
    const userPayload = { email: cleanEmail, password, displayName: teamName || "My XI" };

    try {
      const secureUser = await authRequest(mode === "signup" ? "register" : "login", userPayload);
      setDb((old) => ({
        ...old,
        accounts: upsertLocalAccount(old.accounts, secureUser),
        currentUserEmail: secureUser.email,
      }));
      setNotice("Signed in with secure server auth.");
      return;
    } catch (error) {
      if (!String(error.message).includes("not available")) {
        setNotice(error.message);
        return;
      }
    }

    if (mode === "signup") {
      if (existing) {
        setNotice("That local account already exists. Try signing in.");
        return;
      }

      setDb((old) => ({
        ...old,
        accounts: upsertLocalAccount(old.accounts, { email: cleanEmail, displayName: teamName || "My XI" }),
        currentUserEmail: cleanEmail,
      }));
      setNotice("Local beta profile created. Secure password hashing is used after Cloudflare deployment.");
      return;
    }

    if (!existing) {
      setNotice("No local profile found. Sign up first, or deploy the Cloudflare auth API for real login.");
      return;
    }

    setDb((old) => ({ ...old, currentUserEmail: cleanEmail }));
    setNotice("Signed in to local beta profile.");
  };

  const useDemo = () => {
    const demoEmail = "demo@draft.local";
    const exists = db.accounts.some((account) => account.email === demoEmail);
    setDb((old) => ({
      ...old,
      accounts: exists ? upsertLocalAccount(old.accounts, { email: demoEmail, displayName: "Demo XI" }) : [...old.accounts, { email: demoEmail, displayName: "Demo XI" }],
      currentUserEmail: demoEmail,
    }));
    setNotice("Demo account loaded.");
  };

  return (
    <main className="auth-page">
      <section className="auth-visual">
        <div className="stadium-scene" aria-hidden="true">
          <span className="scene-ball" />
          <span className="scene-net" />
        </div>
        <div className="auth-overlay">
          <div className="brand-lockup">
            <Trophy size={28} />
            <div>
              <span>World Cup</span>
              <strong>Draft Room</strong>
            </div>
          </div>
          <div className="auth-kpis">
            <Stat label="Players" value={FALLBACK_POOL.length.toLocaleString()} />
            <Stat label="Countries" value={WORLD_CUP_TEAMS.length} />
            <Stat label="Draft modes" value="2" />
          </div>
        </div>
      </section>

      <section className="auth-panel">
        <div className="auth-card">
          <div className="auth-header">
            <span className="eyebrow">Local prototype</span>
            <h1>Welcome to Draft Room</h1>
            <p>Build leagues, invite managers, draft squads, and test the full fantasy workflow in your browser.</p>
            {pendingInvite ? <p className="invite-note">Sign in to join league code {pendingInvite.code}.</p> : null}
          </div>

          <div className="segmented" role="tablist" aria-label="Authentication mode">
            <button className={mode === "signup" ? "active" : ""} onClick={() => setMode("signup")}>
              Sign Up
            </button>
            <button className={mode === "login" ? "active" : ""} onClick={() => setMode("login")}>
              Sign In
            </button>
          </div>

          <Field label="Email">
            <div className="input-icon">
              <Mail size={16} />
              <input value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@email.com" />
            </div>
          </Field>
          <Field label="Password">
            <div className="input-icon">
              <Lock size={16} />
              <input
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                type="password"
                placeholder={mode === "signup" ? "Create a prototype password" : "Enter your password"}
              />
            </div>
          </Field>
          {mode === "signup" ? (
            <Field label="Default team name">
              <input value={teamName} onChange={(event) => setTeamName(event.target.value)} />
            </Field>
          ) : null}

          <Button onClick={submit} className="full-width">
            {mode === "signup" ? "Create Account" : "Sign In"}
          </Button>
          <Button onClick={useDemo} variant="secondary" className="full-width" icon={Play}>
            Use Demo Account
          </Button>
          <p className="privacy-note">Local beta mode stores only profiles. Deployed beta uses hashed passwords and HttpOnly sessions.</p>
        </div>
      </section>
    </main>
  );
}

function AppShell({ currentUser, activeView, setActiveView, selectedLeague, setSelectedLeagueId, leagues, logout, resetEverything }) {
  const hasLeague = canOpenLeaguePages(selectedLeague);
  const draftVisible = canOpenDraft(selectedLeague);
  const isCommissioner = selectedLeague?.ownerEmail === currentUser.email;
  const nav = [
    ["dashboard", "Dashboard", LayoutDashboard],
    ["create", "Create", UserPlus],
    ["public", "Public", Globe2],
    ...(hasLeague && draftVisible ? [["draft", "Draft", Gavel]] : []),
    ...(hasLeague ? [["stats", "Stats", BarChart3], ...(isCommissioner ? [["settings", "Settings", Settings]] : []), ["rules", "Rules", BookOpen]] : []),
  ];

  return (
    <header className="app-header">
      <div className="brand" onClick={() => setActiveView("dashboard")}>
        <div className="brand-mark">
          <Trophy size={22} />
        </div>
        <div>
          <span>World Cup</span>
          <strong>Draft Room</strong>
        </div>
      </div>

      <nav className="nav-tabs">
        {nav.map(([id, label, Icon]) => (
          <button key={id} aria-label={label} className={activeView === id ? "active" : ""} onClick={() => setActiveView(id)}>
            <Icon size={16} />
            <span>{label}</span>
          </button>
        ))}
      </nav>

      <div className="header-actions">
        {leagues.length ? (
          <select value={selectedLeague?.id || ""} onChange={(event) => setSelectedLeagueId(event.target.value)} aria-label="Select league">
            <option value="">Select league</option>
            {leagues.map((league) => (
              <option key={league.id} value={league.id}>
                {league.name}
              </option>
            ))}
          </select>
        ) : null}
        <span className="user-pill">{currentUser.email}</span>
        <IconButton label="Log out" icon={LogOut} onClick={logout} />
        <IconButton label="Reset local data" icon={RefreshCw} onClick={resetEverything} />
      </div>
    </header>
  );
}

function Dashboard({ db, currentUserEmail, selectedLeague, setSelectedLeagueId, setActiveView, setNotice, updateLeague }) {
  const myLeagues = db.leagues.filter((league) => league.managers.some((manager) => manager.email === currentUserEmail));
  const league = selectedLeague || myLeagues[0];
  const managers = league?.managers || [];
  const progress = league ? draftProgress(league) : { drafted: 0, total: 0, percent: 0 };
  const standingsMode = league?.status === "live" ? "live" : "expected";
  const standings = league ? [...managers].sort((a, b) => managerScore(b, db.playerPool, standingsMode) - managerScore(a, db.playerPool, standingsMode)) : [];

  const copyInvite = async (targetLeague) => {
    const invite = makeInviteUrl(targetLeague);
    await navigator.clipboard?.writeText(invite);
    setNotice("Invite link copied.");
  };

  const seedPublicLeague = () => {
    const publicLeague = makeLeague({
      leagueName: "Global Warm-Up League",
      teamName: "Guest XI",
      ownerEmail: currentUserEmail,
      settings: { ...DEFAULT_SETTINGS, visibility: "Public", draftType: "Snake Draft", mockDraft: true },
    });
    updateLeague(() => publicLeague, publicLeague.id, true);
    setSelectedLeagueId(publicLeague.id);
    setNotice("Public-style league added to your dashboard.");
  };

  return (
    <main className="page dashboard-grid">
      <section className="page-title">
        <span className="eyebrow">{league?.ownerEmail === currentUserEmail ? "Commissioner console" : "League hub"}</span>
        <h1>Your Leagues</h1>
      </section>

      <section className="league-list">
        {myLeagues.length === 0 ? (
          <div className="empty-state">
            <Trophy size={38} />
            <h2>No leagues yet</h2>
            <p>Create a private competition or join a public lobby to start drafting.</p>
            <div className="inline-actions">
              <Button onClick={() => setActiveView("create")} icon={UserPlus}>
                Create League
              </Button>
              <Button onClick={seedPublicLeague} variant="secondary" icon={Globe2}>
                Try Public Lobby
              </Button>
            </div>
          </div>
        ) : (
          myLeagues.map((item) => {
            const itemProgress = draftProgress(item);
            return (
              <article
                className={`league-card ${league?.id === item.id ? "selected" : ""}`}
                key={item.id}
                onClick={() => setSelectedLeagueId(item.id)}
              >
                <div className="league-card-header">
                  <div>
                    <span className="eyebrow">{item.settings.visibility}</span>
                    <h2>{item.name}</h2>
                    <p>{item.inviteCode}</p>
                  </div>
                  <span className={`status status-${item.status}`}>{item.status}</span>
                </div>

                <div className="progress-bar" aria-label={`${itemProgress.percent}% drafted`}>
                  <span style={{ width: `${itemProgress.percent}%` }} />
                </div>

                <div className="card-stats">
                  <Stat label="Managers" value={`${item.managers.length}/${item.settings.maxManagers}`} />
                  <Stat label="Drafted" value={`${itemProgress.drafted}/${itemProgress.total}`} />
                  <Stat label="Mode" value={item.settings.draftType.replace(" Draft", "")} />
                </div>

                <div className="invite-row">
                  <input readOnly value={makeInviteUrl(item)} onClick={(event) => event.currentTarget.select()} />
                  <Button onClick={(event) => { event.stopPropagation(); copyInvite(item); }} variant="secondary" size="sm" icon={Copy}>
                    Copy
                  </Button>
                </div>

                <div className="inline-actions">
                  {canOpenDraft(item) ? (
                    <Button onClick={(event) => { event.stopPropagation(); setSelectedLeagueId(item.id); setActiveView("draft"); }} icon={Gavel}>
                      Draft
                    </Button>
                  ) : (
                    <Button onClick={(event) => { event.stopPropagation(); setSelectedLeagueId(item.id); setActiveView("stats"); }} icon={BarChart3}>
                      Stats
                    </Button>
                  )}
                  {item.ownerEmail === currentUserEmail ? (
                    <Button onClick={(event) => { event.stopPropagation(); setSelectedLeagueId(item.id); setActiveView("settings"); }} variant="secondary" icon={SlidersHorizontal}>
                      Settings
                    </Button>
                  ) : null}
                </div>
              </article>
            );
          })
        )}
      </section>

      <aside className="dashboard-side">
        <section className="panel hero-panel">
          <div className="stadium-card-visual" aria-hidden="true">
            <span />
            <span />
            <span />
          </div>
          <div>
            <span className="eyebrow">Live room preview</span>
            <h2>{league ? league.name : "Create a league to unlock the room"}</h2>
            <p>{league ? league.draft.message : "Create or join a league to unlock draft, settings, rules, stats, scoring and trades."}</p>
          </div>
        </section>

        {league ? (
          <>
            <section className="panel">
              <div className="panel-header">
                <div>
                  <span className="eyebrow">Draft health</span>
                  <h2>Checklist</h2>
                </div>
                {progress.percent === 100 ? <CheckCircle2 size={22} /> : <AlertTriangle size={22} />}
              </div>
              <ul className="checklist">
                <li className={league.managers.length >= 2 ? "done" : ""}>At least two managers joined</li>
                <li className={league.draft.order.length === league.managers.length ? "done" : ""}>Draft order created</li>
                <li className={league.settings.squadSize >= league.settings.starters ? "done" : ""}>Squad rules valid</li>
                <li className={league.settings.pickTimer >= 10 ? "done" : ""}>Pick timer set</li>
              </ul>
            </section>

            <section className="panel">
              <div className="panel-header">
                <div>
                  <span className="eyebrow">Projected table</span>
                  <h2>Standings</h2>
                </div>
                <BarChart3 size={20} />
              </div>
              <div className="standings-list">
                {standings.slice(0, 6).map((manager, index) => (
                  <div key={manager.email} className="standing-row">
                    <strong>{index + 1}</strong>
                  <span>{manager.teamName}</span>
                    <b>{managerScore(manager, db.playerPool, league.status === "live" ? "live" : "expected")}</b>
                  </div>
                ))}
              </div>
            </section>
          </>
        ) : null}
      </aside>
    </main>
  );
}

function CreateLeague({ currentUserEmail, setDb, setSelectedLeagueId, setActiveView, setNotice }) {
  const [leagueName, setLeagueName] = useState("League of Champions");
  const [teamName, setTeamName] = useState("Team XI");
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [joinCode, setJoinCode] = useState("");

  const setSetting = (key, value) => setSettings((old) => ({ ...old, [key]: value }));

  const createLeague = () => {
    if (!currentUserEmail) return;

    const league = makeLeague({ leagueName, teamName, ownerEmail: currentUserEmail, settings });
    setDb((old) => ({ ...old, leagues: [...old.leagues, league] }));
    setSelectedLeagueId(league.id);
    setActiveView("draft");
    setNotice(`League created. Invite code: ${league.inviteCode}.`);
  };

  const joinByCode = () => {
    const clean = joinCode.trim().toUpperCase();
    if (!clean) {
      setNotice("Enter an invite code.");
      return;
    }

    setDb((old) => {
      const target = old.leagues.find((league) => league.inviteCode === clean);
      if (!target) {
        setNotice("No local league found with that invite code.");
        return old;
      }

      if (target.managers.some((manager) => manager.email === currentUserEmail)) {
        setSelectedLeagueId(target.id);
        setActiveView(canOpenDraft(target) ? "draft" : "stats");
        setNotice("You are already in that league.");
        return old;
      }

      if (target.managers.length >= target.settings.maxManagers) {
        setNotice("That league is full.");
        return old;
      }

      const manager = makeManager(currentUserEmail, teamName, getAuctionBudget(target.settings), false, target.managers.length);
      setSelectedLeagueId(target.id);
      setActiveView(canOpenDraft(target) ? "draft" : "stats");
      setNotice("Joined league.");
      return {
        ...old,
        leagues: old.leagues.map((league) =>
          league.id === target.id
            ? {
                ...league,
                managers: [...league.managers, manager],
                draft: { ...league.draft, order: [...league.draft.order, manager.email] },
              }
            : league
        ),
      };
    });
  };

  return (
    <main className="page create-layout">
      <section className="create-form panel">
        <span className="eyebrow">League setup</span>
        <h1>Create League</h1>

        <Field label="Name">
          <input value={leagueName} onChange={(event) => setLeagueName(event.target.value)} />
        </Field>

        <fieldset className="choice-group">
          <legend>
            Draft Type <HelpTip text="Snake uses turn order. Auction gives each manager a budget and nominations." />
          </legend>
          {["Snake Draft", "Auction Draft"].map((option) => (
            <label key={option}>
              <input type="radio" checked={settings.draftType === option} onChange={() => setSetting("draftType", option)} />
              <span>{option}</span>
            </label>
          ))}
        </fieldset>

        <fieldset className="choice-group">
          <legend>
            Format <HelpTip text="Head to Head schedules weekly matchups. Classic ranks total points." />
          </legend>
          {["Head to Head", "Classic"].map((option) => (
            <label key={option}>
              <input type="radio" checked={settings.format === option} onChange={() => setSetting("format", option)} />
              <span>{option}</span>
            </label>
          ))}
        </fieldset>

        <fieldset className="choice-group">
          <legend>
            Visibility <HelpTip text="Public leagues appear in the public lobby. Private leagues require the invite code." />
          </legend>
          {["Public", "Private"].map((option) => (
            <label key={option}>
              <input type="radio" checked={settings.visibility === option} onChange={() => setSetting("visibility", option)} />
              <span>{option}</span>
            </label>
          ))}
        </fieldset>

        <fieldset className="choice-group">
          <legend>
            How Draft Starts <HelpTip text="Manual starts from commissioner controls. Scheduled starts at the selected time." />
          </legend>
          {["Manual", "Scheduled"].map((option) => (
            <label key={option}>
              <input type="radio" checked={settings.startMode === option} onChange={() => setSetting("startMode", option)} />
              <span>{option}</span>
            </label>
          ))}
        </fieldset>

        {settings.startMode === "Scheduled" ? (
          <Field label="Scheduled draft time">
            <input type="datetime-local" value={settings.scheduledAt} onChange={(event) => setSetting("scheduledAt", event.target.value)} />
          </Field>
        ) : null}

        <div className="form-grid">
          <Field label="Maximum number of teams">
            <input type="number" min="2" max="24" value={settings.maxManagers} onChange={(event) => setSetting("maxManagers", event.target.value)} />
          </Field>
          <Field label="Squad size">
            <input type="number" min="11" max="26" value={settings.squadSize} onChange={(event) => setSetting("squadSize", event.target.value)} />
          </Field>
          <Field label="Starters">
            <input type="number" min="6" max="15" value={settings.starters} onChange={(event) => setSetting("starters", event.target.value)} />
          </Field>
          <Field label="Pick timer seconds">
            <input type="number" min="10" max="180" value={settings.pickTimer} onChange={(event) => setSetting("pickTimer", event.target.value)} />
          </Field>
          {settings.draftType === "Auction Draft" ? (
            <Field label="Auction budget">
              <input type="number" min="50" max="500" value={settings.budget} onChange={(event) => setSetting("budget", event.target.value)} />
            </Field>
          ) : null}
          <Field label="Trade review">
            <select value={settings.tradeReview} onChange={(event) => setSetting("tradeReview", event.target.value)}>
              <option>Manager approval</option>
              <option>Commissioner approval</option>
              <option>Instant trades</option>
            </select>
          </Field>
        </div>

        <label className="mock-card">
          <input type="checkbox" checked={settings.mockDraft} onChange={(event) => setSetting("mockDraft", event.target.checked)} />
          <span>
            <strong>Mock Draft</strong>
            <small>Fill empty seats with bot managers so you can test the full draft.</small>
          </span>
          <Bot size={20} />
        </label>

        <Field label="Your team name">
          <input value={teamName} onChange={(event) => setTeamName(event.target.value)} />
        </Field>

        <Button onClick={createLeague} icon={UserPlus}>
          Create League
        </Button>
      </section>

      <aside className="create-aside">
        <section className="panel">
          <div className="panel-header">
            <div>
              <span className="eyebrow">Join existing</span>
              <h2>Invite Code</h2>
            </div>
            <Link2 size={20} />
          </div>
          <Field label="Code">
            <input value={joinCode} onChange={(event) => setJoinCode(event.target.value.toUpperCase())} placeholder="ABC123" />
          </Field>
          <Button onClick={joinByCode} variant="secondary" icon={UserPlus}>
            Join League
          </Button>
        </section>

        <section className="panel feature-list">
          <span className="eyebrow">Included features</span>
          <h2>Draft-site basics</h2>
          <ul>
            <li>Invite links and public/private visibility</li>
            <li>Snake or auction-style room configuration</li>
            <li>Auto-pick queue, watchlist, bot mock draft</li>
            <li>Squad validation, projected standings, scoring rules</li>
            <li>Trades, waivers, CSV player import, activity log</li>
          </ul>
        </section>
      </aside>
    </main>
  );
}

function PublicLeagues({ db, currentUserEmail, setDb, setSelectedLeagueId, setActiveView, setNotice }) {
  const publicLeagues = db.leagues.filter((league) => league.settings.visibility === "Public");

  const templates = [
    ["World Cup Open Classic", "Classic", "Snake Draft", 5, 12],
    ["Auction Warm-Up", "Head to Head", "Auction Draft", 7, 12],
    ["Beginners Mock Room", "Classic", "Snake Draft", 4, 10],
  ];

  const joinLeague = (targetLeague) => {
    setDb((old) => {
      const fresh = old.leagues.find((league) => league.id === targetLeague.id);
      if (!fresh) return old;
      if (fresh.managers.some((manager) => manager.email === currentUserEmail)) {
        setSelectedLeagueId(fresh.id);
        setActiveView(canOpenDraft(fresh) ? "draft" : "stats");
        setNotice("You are already in this league.");
        return old;
      }
      if (fresh.managers.length >= fresh.settings.maxManagers) {
        setNotice("That league is full.");
        return old;
      }
      const manager = makeManager(currentUserEmail, "Public XI", getAuctionBudget(fresh.settings), false, fresh.managers.length);
      setSelectedLeagueId(fresh.id);
      setActiveView(canOpenDraft(fresh) ? "draft" : "stats");
      setNotice("Joined public league.");
      return {
        ...old,
        leagues: old.leagues.map((league) =>
          league.id === fresh.id
            ? { ...league, managers: [...league.managers, manager], draft: { ...league.draft, order: [...league.draft.order, manager.email] } }
            : league
        ),
      };
    });
  };

  const createFromTemplate = ([name, format, draftType, managers, maxManagers]) => {
    const league = makeLeague({
      leagueName: name,
      teamName: "Public XI",
      ownerEmail: currentUserEmail,
      settings: { ...DEFAULT_SETTINGS, visibility: "Public", format, draftType, maxManagers, mockDraft: true },
    });
    const trimmedManagers = league.managers.slice(0, managers);
    const created = {
      ...league,
      managers: trimmedManagers,
      draft: { ...league.draft, order: trimmedManagers.map((manager) => manager.email) },
    };
    setDb((old) => ({ ...old, leagues: [...old.leagues, created] }));
    setSelectedLeagueId(created.id);
    setActiveView("draft");
    setNotice("Public lobby created and joined.");
  };

  return (
    <main className="page">
      <section className="page-title">
        <span className="eyebrow">Find a room</span>
        <h1>Join Public League</h1>
      </section>

      <div className="public-grid">
        {publicLeagues.map((league) => (
          <article className="panel public-card" key={league.id}>
            <div className="league-card-header">
              <div>
                <span className="eyebrow">{league.settings.format}</span>
                <h2>{league.name}</h2>
                <p>{league.settings.draftType}</p>
              </div>
              <Globe2 size={22} />
            </div>
            <div className="card-stats">
              <Stat label="Managers" value={`${league.managers.length}/${league.settings.maxManagers}`} />
              <Stat label="Timer" value={`${league.settings.pickTimer}s`} />
              <Stat label="Squad" value={league.settings.squadSize} />
            </div>
            <Button onClick={() => joinLeague(league)} icon={UserPlus}>
              Join
            </Button>
          </article>
        ))}

        {templates.map((template) => (
          <article className="panel public-card muted" key={template[0]}>
            <div className="league-card-header">
              <div>
                <span className="eyebrow">Template lobby</span>
                <h2>{template[0]}</h2>
                <p>{template[1]} - {template[2]}</p>
              </div>
              <Plus size={22} />
            </div>
            <div className="card-stats">
              <Stat label="Managers" value={`${template[3]}/${template[4]}`} />
              <Stat label="Status" value="Open" />
              <Stat label="Type" value={template[2].replace(" Draft", "")} />
            </div>
            <Button onClick={() => createFromTemplate(template)} variant="secondary" icon={Globe2}>
              Create Local Copy
            </Button>
          </article>
        ))}
      </div>
    </main>
  );
}

function DraftRoom({ db, selectedLeague, currentUserEmail, setDb, setNotice, setActiveView }) {
  const [query, setQuery] = useState("");
  const [position, setPosition] = useState("ALL");
  const [country, setCountry] = useState("ALL");
  const [ownerFilter, setOwnerFilter] = useState("Unowned");
  const [sortBy, setSortBy] = useState("rating");
  const [tab, setTab] = useState("players");
  const [timerLeft, setTimerLeft] = useState(selectedLeague?.settings.pickTimer || 45);
  const [bidAmount, setBidAmount] = useState(1);

  const league = selectedLeague;
  const playerPool = db.playerPool;
  const currentPicker = getCurrentPicker(league);
  const myManager = league?.managers.find((manager) => manager.email === currentUserEmail);
  const isCommissioner = league?.ownerEmail === currentUserEmail;
  const isAuction = league?.settings.draftType === "Auction Draft";
  const availablePlayers = useMemo(() => getAvailablePlayers(playerPool, league), [playerPool, league]);
  const draftedIds = useMemo(() => new Set((league?.draft.log || []).map((entry) => entry.playerId)), [league]);
  const progress = league ? draftProgress(league) : { drafted: 0, total: 0, percent: 0 };

  const updateLeague = (updater) => {
    if (!league) return;
    setDb((old) => ({
      ...old,
      leagues: old.leagues.map((candidate) => (candidate.id === league.id ? updater(candidate) : candidate)),
    }));
  };

  const playerById = (id) => playerPool.find((player) => player.id === Number(id));

  const visiblePlayers = useMemo(() => {
    const owned = new Map();
    league?.managers.forEach((manager) => manager.squad.forEach((id) => owned.set(id, manager.teamName)));

    return playerPool
      .filter((player) => position === "ALL" || player.pos === position)
      .filter((player) => country === "ALL" || player.country === country)
      .filter((player) => `${player.name} ${player.country} ${player.club} ${player.code}`.toLowerCase().includes(query.toLowerCase()))
      .filter((player) => {
        if (ownerFilter === "All") return true;
        if (ownerFilter === "Owned") return owned.has(player.id);
        if (ownerFilter === "Watchlist") return myManager?.watchlist.includes(player.id);
        return !owned.has(player.id);
      })
      .sort((a, b) => {
        if (sortBy === "expected") return b.expected - a.expected;
        if (sortBy === "points") return b.points - a.points;
        if (sortBy === "goals") return (b.stats?.goals || 0) - (a.stats?.goals || 0);
        if (sortBy === "price") return b.price - a.price;
        if (sortBy === "value") return b.expected / b.price - a.expected / a.price;
        if (sortBy === "country") return a.country.localeCompare(b.country);
        return b.rating - a.rating;
      })
      .slice(0, 140)
      .map((player) => ({ ...player, ownerName: owned.get(player.id) || "" }));
  }, [playerPool, position, country, query, ownerFilter, sortBy, league, myManager]);

  const makePick = (playerId, managerEmail = currentPicker?.email, source = "manual", priceOverride = 0) => {
    const player = playerById(playerId);
    if (!league || !player || !managerEmail) return false;
    let pickedTeamName = "";
    let blockedReason = "";

    updateLeague((current) => {
      const currentDraftedIds = new Set((current.draft.log || []).map((entry) => entry.playerId));
      if (currentDraftedIds.has(player.id)) {
        blockedReason = `${player.name} has already been picked.`;
        return current;
      }

      const manager = current.managers.find((candidate) => candidate.email === managerEmail);
      if (!manager) return current;
      if (manager.squad.length >= current.settings.squadSize) {
        blockedReason = `${manager.teamName} already has a full squad.`;
        return current;
      }

      const auctionDraft = current.settings.draftType === "Auction Draft";
      const pickCost = auctionDraft ? Math.max(priceOverride || player.price, 1) : 0;
      if (auctionDraft && manager.budget < pickCost) {
        blockedReason = "That manager does not have enough budget.";
        return current;
      }

      const nextLog = [
        ...current.draft.log,
        {
          id: makeId("pick"),
          playerId: player.id,
          managerEmail,
          source,
          price: pickCost,
          createdAt: new Date().toISOString(),
        },
      ];
      const maxPicks = current.managers.length * current.settings.squadSize;
      const nextStatus = nextLog.length >= maxPicks ? "complete" : current.status;
      pickedTeamName = manager.teamName;

      return {
        ...current,
        status: nextStatus,
        managers: current.managers.map((candidate) => {
          if (candidate.email !== managerEmail) {
            return {
              ...candidate,
              queue: candidate.queue.filter((id) => id !== player.id),
              watchlist: candidate.watchlist.filter((id) => id !== player.id),
            };
          }

          const nextSquad = [...candidate.squad, player.id];
          return {
            ...candidate,
            budget: auctionDraft ? candidate.budget - pickCost : candidate.budget,
            squad: nextSquad,
            starters: pickLineup({ ...candidate, squad: nextSquad }, playerPool, current.settings.starters).map((picked) => picked.id),
            queue: candidate.queue.filter((id) => id !== player.id),
            watchlist: candidate.watchlist.filter((id) => id !== player.id),
          };
        }),
        draft: {
          ...current.draft,
          log: nextLog,
          nominatedPlayerId: "",
          highBid: 0,
          highBidderEmail: "",
          message: `${player.name} drafted by ${manager.teamName}.`,
        },
        activity: [
          { id: makeId("activity"), text: `${manager.teamName} picked ${player.name}`, createdAt: new Date().toISOString() },
          ...current.activity,
        ].slice(0, 30),
      };
    });

    if (!pickedTeamName) {
      if (blockedReason) setNotice(blockedReason);
      return false;
    }

    setTimerLeft(league.settings.pickTimer);
    setNotice(`${player.name} picked by ${pickedTeamName}.`);
    return true;
  };

  const bestAvailableForManager = (manager) => {
    const queuePick = (manager.queue || []).map(playerById).find((player) => player && !draftedIds.has(player.id));
    if (queuePick) return queuePick;

    const needs = ["GK", "DEF", "MID", "FWD"].sort((a, b) => {
      const countA = manager.squad.map(playerById).filter((player) => player?.pos === a).length;
      const countB = manager.squad.map(playerById).filter((player) => player?.pos === b).length;
      return countA - countB;
    });
    const preferred = needs[0];
    return [...availablePlayers]
      .sort((a, b) => {
        const tacticBonusA = manager.tactic === "Attack" && a.pos === "FWD" ? 9 : manager.tactic === "Defence" && ["GK", "DEF"].includes(a.pos) ? 8 : 0;
        const tacticBonusB = manager.tactic === "Attack" && b.pos === "FWD" ? 9 : manager.tactic === "Defence" && ["GK", "DEF"].includes(b.pos) ? 8 : 0;
        const needBonusA = a.pos === preferred ? 8 : 0;
        const needBonusB = b.pos === preferred ? 8 : 0;
        return b.rating + tacticBonusB + needBonusB - (a.rating + tacticBonusA + needBonusA);
      })[0];
  };

  const autoPickForCurrent = () => {
    if (!league || league.status !== "drafting" || league.draft.paused || !currentPicker?.manager) return;
    const player = bestAvailableForManager(currentPicker.manager);
    if (player) makePick(player.id, currentPicker.email, currentPicker.manager.isBot ? "bot" : "auto");
  };

  useEffect(() => {
    if (!league || league.status !== "drafting" || league.draft.paused) return;
    setTimerLeft(league.settings.pickTimer);
  }, [league?.draft.log.length, league?.status, league?.draft.paused, league?.settings.pickTimer]);

  useEffect(() => {
    if (!league || league.status !== "drafting" || league.draft.paused) return undefined;

    const interval = window.setInterval(() => {
      setTimerLeft((old) => {
        if (old <= 1) {
          window.setTimeout(autoPickForCurrent, 0);
          return league.settings.pickTimer;
        }
        return old - 1;
      });
    }, 1000);

    return () => window.clearInterval(interval);
  }, [league?.status, league?.draft.paused, league?.draft.log.length, currentPicker?.email]);

  useEffect(() => {
    if (!league || league.status !== "drafting" || league.draft.paused || !currentPicker?.manager?.isBot) return undefined;
    const timeout = window.setTimeout(autoPickForCurrent, 800);
    return () => window.clearTimeout(timeout);
  }, [league?.status, league?.draft.paused, league?.draft.log.length, currentPicker?.email]);

  if (!league) {
    return (
      <main className="page">
        <div className="empty-state">
          <Gavel size={40} />
          <h1>No league selected</h1>
          <p>Create or join a league before opening the draft room.</p>
          <Button onClick={() => setActiveView("create")} icon={UserPlus}>
            Create League
          </Button>
        </div>
      </main>
    );
  }

  if (!canOpenDraft(league)) {
    return (
      <main className="page">
        <div className="empty-state">
          <BarChart3 size={40} />
          <h1>Draft room closed</h1>
          <p>The World Cup start date has arrived or test mode is live, so draft tools are hidden and live stats are now open.</p>
          <Button onClick={() => setActiveView("stats")} icon={BarChart3}>
            Open Stats
          </Button>
        </div>
      </main>
    );
  }

  const inviteLink = makeInviteUrl(league);
  const selectedPlayer = playerById(league.draft.nominatedPlayerId);
  const highBidder = league.managers.find((manager) => manager.email === league.draft.highBidderEmail);
  const myPlayers = (myManager?.squad || []).map(playerById).filter(Boolean);

  const startDraft = () => {
    updateLeague((current) => ({
      ...current,
      status: "drafting",
      draft: { ...current.draft, order: current.managers.map((manager) => manager.email), paused: false, message: "Draft started." },
      activity: [{ id: makeId("activity"), text: "Draft started", createdAt: new Date().toISOString() }, ...current.activity],
    }));
    setTimerLeft(league.settings.pickTimer);
  };

  const togglePause = () => {
    updateLeague((current) => ({
      ...current,
      draft: { ...current.draft, paused: !current.draft.paused, message: current.draft.paused ? "Draft resumed." : "Draft paused." },
    }));
  };

  const addToList = (playerId, listName) => {
    if (!myManager) return;
    const player = playerById(playerId);
    let changed = false;
    updateLeague((current) => ({
      ...current,
      managers: current.managers.map((manager) => {
        if (manager.email !== currentUserEmail) return manager;
        const list = manager[listName] || [];
        if (list.includes(playerId)) return manager;
        changed = true;
        return { ...manager, [listName]: [...list, playerId] };
      }),
    }));
    setNotice(changed ? `${player?.name || "Player"} added to ${listName === "queue" ? "pre-draft queue" : "watchlist"}.` : `${player?.name || "Player"} is already in that list.`);
  };

  const removeFromList = (playerId, listName) => {
    updateLeague((current) => ({
      ...current,
      managers: current.managers.map((manager) =>
        manager.email === currentUserEmail ? { ...manager, [listName]: manager[listName].filter((id) => id !== playerId) } : manager
      ),
    }));
  };

  const moveQueue = (playerId, delta) => {
    updateLeague((current) => ({
      ...current,
      managers: current.managers.map((manager) => {
        if (manager.email !== currentUserEmail) return manager;
        const queue = [...manager.queue];
        const index = queue.indexOf(playerId);
        const nextIndex = clamp(index + delta, 0, queue.length - 1);
        queue.splice(index, 1);
        queue.splice(nextIndex, 0, playerId);
        return { ...manager, queue };
      }),
    }));
  };

  const nominate = (playerId) => {
    const player = playerById(playerId);
    if (!player) return;
    setBidAmount(player.price);
    updateLeague((current) => ({
      ...current,
      draft: {
        ...current.draft,
        nominatedPlayerId: player.id,
        highBid: player.price,
        highBidderEmail: currentUserEmail,
        message: `${player.name} nominated.`,
      },
    }));
    setNotice(`${player.name} nominated.`);
  };

  const placeBid = () => {
    if (!selectedPlayer || !myManager) return;
    const bid = Number(bidAmount) || 0;
    if (bid <= league.draft.highBid) {
      setNotice("Bid must beat the current high bid.");
      return;
    }
    if (bid > myManager.budget) {
      setNotice("Bid is above your remaining budget.");
      return;
    }
    updateLeague((current) => ({
      ...current,
      draft: {
        ...current.draft,
        highBid: bid,
        highBidderEmail: currentUserEmail,
        message: `${myManager.teamName} bid $${bid} for ${selectedPlayer.name}.`,
      },
    }));
  };

  const sellNominated = () => {
    if (!selectedPlayer || !league.draft.highBidderEmail) return;
    makePick(selectedPlayer.id, league.draft.highBidderEmail, "auction", league.draft.highBid);
  };

  const syncScores = () => {
    syncStatsForLeague({ selectedLeague: league, db, setDb, setNotice });
  };

  const completeDraft = () => {
    updateLeague((current) => ({ ...current, status: "complete", draft: { ...current.draft, message: "Draft marked complete." } }));
    setNotice("Draft marked complete.");
  };

  const restartDraft = () => {
    const shouldRestart = window.confirm("Restart this draft? This clears all picks and squads, but keeps managers, queues, watchlists and settings.");
    if (!shouldRestart) return;
    updateLeague((current) => restartLeagueDraftState(current));
    setNotice("Draft restarted.");
  };

  const startWorldCup = () => {
    updateLeague((current) => ({
      ...current,
      status: "live",
      draft: { ...current.draft, paused: true, message: "World Cup mode is live. Draft room closed." },
      activity: [{ id: makeId("activity"), text: "World Cup mode started", createdAt: new Date().toISOString() }, ...current.activity],
    }));
    setActiveView("stats");
    setNotice("World Cup started. Draft page is now hidden and live stats are open.");
  };

  return (
    <main className="draft-page">
      <section className="draft-topbar">
        <div className="invite-banner">
          <Link2 size={20} />
          <div>
            <strong>Invite friends</strong>
            <span>Share this link with managers to invite them to the league.</span>
          </div>
          <input readOnly value={inviteLink} onClick={(event) => event.currentTarget.select()} />
          <Button onClick={() => { navigator.clipboard?.writeText(inviteLink); setNotice("Invite link copied."); }} variant="secondary" icon={Copy}>
            Copy
          </Button>
        </div>

        <div className="room-toolbar">
          <div>
            <span className="eyebrow">{league.settings.draftType}</span>
            <h1>{league.name}</h1>
          </div>
          <div className="inline-actions">
            {league.status === "lobby" && isCommissioner ? (
              <Button onClick={startDraft} icon={Play}>
                Start Draft
              </Button>
            ) : null}
            {league.status === "drafting" && isCommissioner ? (
              <>
                <Button onClick={togglePause} variant="secondary" icon={league.draft.paused ? Play : Pause}>
                  {league.draft.paused ? "Resume" : "Pause"}
                </Button>
                <Button onClick={autoPickForCurrent} variant="secondary" icon={SkipForward}>
                  Force Pick
                </Button>
              </>
            ) : null}
            {isCommissioner ? (
              <Button onClick={syncScores} variant="secondary" icon={BarChart3}>
                Sync Scores
              </Button>
            ) : null}
            {isCommissioner && league.status !== "complete" ? (
              <Button onClick={completeDraft} variant="secondary" icon={CheckCircle2}>
                End Draft
              </Button>
            ) : null}
            {isCommissioner && (league.draft.log.length > 0 || league.status !== "lobby") ? (
              <Button onClick={restartDraft} variant="secondary" icon={RefreshCw}>
                Restart Draft
              </Button>
            ) : null}
            {isCommissioner && league.status === "complete" ? (
              <Button onClick={startWorldCup} icon={Play}>
                Start World Cup / Test
              </Button>
            ) : null}
          </div>
        </div>

        <div className="team-strip">
          <article className="status-card large">
            <span>{league.status === "drafting" ? "On the clock" : "Draft status"}</span>
            <strong>{league.status === "drafting" ? currentPicker?.manager?.teamName || "Waiting" : league.draft.message}</strong>
            <small>
              {league.status === "drafting"
                ? `Round ${currentPicker.round}, pick ${currentPicker.pick} - ${formatTimer(timerLeft)}`
                : `${progress.drafted}/${progress.total} players drafted`}
            </small>
          </article>
          {league.managers.map((manager) => (
            <article className={`status-card ${currentPicker?.email === manager.email ? "active" : ""}`} key={manager.email}>
              <span>{manager.isBot ? "Bot manager" : manager.email === currentUserEmail ? "You" : "Manager"}</span>
              <strong>{manager.teamName}</strong>
              <small>{manager.squad.length}/{league.settings.squadSize}{getManagerBudgetLabel(league, manager)}</small>
            </article>
          ))}
        </div>
      </section>

      <section className="draft-content">
        <section className="panel player-board">
          <div className="panel-header">
            <div>
              <span className="eyebrow">{visiblePlayers.length} shown</span>
              <h2>Players</h2>
            </div>
            <div className="table-tabs">
              {["players", "board", "activity"].map((item) => (
                <button className={tab === item ? "active" : ""} onClick={() => setTab(item)} key={item}>
                  {item}
                </button>
              ))}
            </div>
          </div>

          {tab === "players" ? (
            <>
              {league.status === "lobby" ? (
                <div className="draft-hint">
                  Pre-draft is open: add players to your Auto Pick List now. When your turn comes, queued players are picked first.
                </div>
              ) : null}
              <div className="filters">
                <div className="search-box">
                  <Search size={16} />
                  <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search player, country, club..." />
                </div>
                <select value={ownerFilter} onChange={(event) => setOwnerFilter(event.target.value)}>
                  <option>Unowned</option>
                  <option>Owned</option>
                  <option>All</option>
                  <option>Watchlist</option>
                </select>
                <select value={position} onChange={(event) => setPosition(event.target.value)}>
                  <option>ALL</option>
                  <option>GK</option>
                  <option>DEF</option>
                  <option>MID</option>
                  <option>FWD</option>
                </select>
                <select value={country} onChange={(event) => setCountry(event.target.value)}>
                  <option>ALL</option>
                  {WORLD_CUP_TEAMS.map(([code, countryName]) => (
                    <option key={code} value={countryName}>
                      {code} - {countryName}
                    </option>
                  ))}
                </select>
                <select value={sortBy} onChange={(event) => setSortBy(event.target.value)}>
                  <option value="rating">Rating</option>
                  <option value="expected">Projected</option>
                  <option value="points">Points</option>
                  <option value="goals">Goals</option>
                  <option value="value">Value</option>
                  {isAuction ? <option value="price">Price</option> : null}
                  <option value="country">Country</option>
                </select>
              </div>

              <div className={`players-table ${isAuction ? "auction-columns" : "snake-columns"}`} role="table">
                <div className="table-head" role="row">
                  <span>Name</span>
                  <span>Pos</span>
                  {STAT_COLUMNS.map(([, label]) => <span key={label}>{label}</span>)}
                  {isAuction ? <span>Price</span> : null}
                  <span>Owner</span>
                  <span>Actions</span>
                </div>
                {visiblePlayers.map((player) => {
                  const owned = Boolean(player.ownerName);
                  const isMyTurn = currentPicker?.email === currentUserEmail || league.settings.draftType === "Auction Draft";
                  return (
                    <div className={`table-row ${owned ? "owned" : ""}`} key={player.id} role="row">
                      <div className="player-cell">
                        <Kit player={player} />
                        <div>
                          <strong>{player.name}</strong>
                          <small>{player.country} - {player.news}</small>
                        </div>
                      </div>
                      <span><PosBadge pos={player.pos} /></span>
                      {STAT_COLUMNS.map(([key]) => (
                        <span key={key}>{key in (player.stats || {}) ? player.stats?.[key] || 0 : player[key] || 0}</span>
                      ))}
                      {isAuction ? <span>${player.price}</span> : null}
                      <span>{player.ownerName || "-"}</span>
                      <span className="row-actions">
                        {!owned && league.settings.draftType === "Auction Draft" ? (
                          <IconButton label="Nominate player" icon={Gavel} onClick={() => nominate(player.id)} />
                        ) : null}
                        {!owned && league.settings.draftType !== "Auction Draft" ? (
                          <IconButton
                            label={league.status === "drafting" ? "Pick player" : "Queue pre-draft pick"}
                            icon={league.status === "drafting" ? Target : ListPlus}
                            disabled={league.status === "drafting" && !isMyTurn}
                            onClick={() => (league.status === "drafting" ? makePick(player.id) : addToList(player.id, "queue"))}
                          />
                        ) : null}
                        {!owned ? <IconButton label="Add to auto-pick list" icon={ListPlus} onClick={() => addToList(player.id, "queue")} /> : null}
                        {!owned ? <IconButton label="Watch player" icon={Star} onClick={() => addToList(player.id, "watchlist")} /> : null}
                      </span>
                    </div>
                  );
                })}
              </div>
            </>
          ) : null}

          {tab === "board" ? (
            <DraftBoard league={league} playerById={playerById} />
          ) : null}

          {tab === "activity" ? (
            <ActivityPanel league={league} playerById={playerById} />
          ) : null}
        </section>

        <aside className="draft-side">
          {league.settings.draftType === "Auction Draft" ? (
            <section className="panel auction-panel">
              <div className="panel-header">
                <div>
                  <span className="eyebrow">Auction room</span>
                  <h2>Nominated Player</h2>
                </div>
                <Gavel size={20} />
              </div>
              {selectedPlayer ? (
                <>
                  <div className="auction-player">
                    <Kit player={selectedPlayer} size="lg" />
                    <div>
                      <h3>{selectedPlayer.name}</h3>
                      <p>{selectedPlayer.country} - {selectedPlayer.pos}</p>
                    </div>
                  </div>
                  <div className="card-stats">
                    <Stat label="High bid" value={`$${league.draft.highBid}`} />
                    <Stat label="Bidder" value={highBidder?.teamName || "-"} />
                  </div>
                  <div className="bid-row">
                    <input type="number" value={bidAmount} onChange={(event) => setBidAmount(event.target.value)} />
                    <Button onClick={placeBid} variant="secondary" icon={Coins}>
                      Bid
                    </Button>
                    {isCommissioner ? (
                      <Button onClick={sellNominated} icon={CheckCircle2}>
                        Sell
                      </Button>
                    ) : null}
                  </div>
                </>
              ) : (
                <p className="muted-copy">Nominate a player from the table to open bidding.</p>
              )}
            </section>
          ) : null}

          <AutoPickPanel
            manager={myManager}
            playerById={playerById}
            draftedIds={draftedIds}
            removeFromList={removeFromList}
            moveQueue={moveQueue}
            makePick={makePick}
            canPick={league.status === "drafting" && currentPicker?.email === currentUserEmail}
          />

          <YourTeamPanel league={league} manager={myManager} playerById={playerById} updateLeague={updateLeague} currentUserEmail={currentUserEmail} />
        </aside>
      </section>
    </main>
  );
}

function DraftBoard({ league, playerById }) {
  const rounds = [];
  const managers = league.managers;
  const maxRounds = Math.ceil((league.settings.squadSize * managers.length) / Math.max(1, managers.length));

  for (let round = 1; round <= maxRounds; round += 1) {
    rounds.push(round);
  }

  return (
    <div className="draft-board">
      {rounds.map((round) => {
        const entries = league.draft.log.filter((_, index) => Math.floor(index / managers.length) + 1 === round);
        return (
          <section className="round-row" key={round}>
            <h3>Round {round}</h3>
            <div className="round-picks">
              {managers.map((manager, index) => {
                const orderedIndex = round % 2 === 1 ? index : managers.length - 1 - index;
                const entry = entries[orderedIndex];
                const player = playerById(entry?.playerId);
                return (
                  <div className={`pick-tile ${player ? "filled" : ""}`} key={`${round}-${manager.email}`}>
                    <small>Pick {(round - 1) * managers.length + orderedIndex + 1}</small>
                    {player ? (
                      <>
                        <strong>{player.name}</strong>
                        <span>{player.code} - {player.pos}</span>
                      </>
                    ) : (
                      <span>Waiting</span>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        );
      })}
    </div>
  );
}

function ActivityPanel({ league, playerById }) {
  const log = [
    ...league.draft.log.map((entry) => {
      const player = playerById(entry.playerId);
      const manager = league.managers.find((candidate) => candidate.email === entry.managerEmail);
      return {
        id: entry.id,
        text: `${manager?.teamName || "Manager"} picked ${player?.name || "Unknown player"}`,
        createdAt: entry.createdAt,
      };
    }),
    ...league.activity,
  ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  return (
    <div className="activity-list">
      {log.slice(0, 40).map((item) => (
        <div className="activity-item" key={item.id}>
          <Clock size={15} />
          <span>{item.text}</span>
          <small>{new Date(item.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</small>
        </div>
      ))}
    </div>
  );
}

function AutoPickPanel({ manager, playerById, draftedIds, removeFromList, moveQueue, makePick, canPick }) {
  const queue = (manager?.queue || []).map(playerById).filter(Boolean).filter((player) => !draftedIds.has(player.id));

  return (
    <section className="panel">
      <div className="panel-header">
        <div>
          <span className="eyebrow">Queue</span>
          <h2>Auto Pick List</h2>
        </div>
        <ListPlus size={20} />
      </div>
      <p className="muted-copy">This is your pre-draft pick list. The draft clock will take the first available player from here before choosing automatically.</p>
      <div className="queue-list">
        {queue.length === 0 ? <p className="muted-copy">Add players from the table to build your queue.</p> : null}
        {queue.map((player, index) => (
          <div className="queue-item" key={player.id}>
            <span className="queue-index">{index + 1}</span>
            <Kit player={player} />
            <div>
              <strong>{player.name}</strong>
              <small>{player.pos}, {player.code}</small>
            </div>
            <div className="queue-actions">
              <IconButton label="Move up" icon={ArrowUp} onClick={() => moveQueue(player.id, -1)} />
              <IconButton label="Move down" icon={ArrowDown} onClick={() => moveQueue(player.id, 1)} />
              <IconButton label="Remove" icon={Trash2} onClick={() => removeFromList(player.id, "queue")} />
              <IconButton label="Pick now" icon={Target} disabled={!canPick} onClick={() => makePick(player.id)} />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function YourTeamPanel({ league, manager, playerById, updateLeague, currentUserEmail }) {
  const [collapsed, setCollapsed] = useState(false);
  const players = (manager?.squad || []).map(playerById).filter(Boolean);
  const starters = pickLineup(manager || { squad: [] }, players, league.settings.starters);
  const counts = players.reduce((acc, player) => ({ ...acc, [player.pos]: (acc[player.pos] || 0) + 1 }), {});

  const toggleStarter = (playerId) => {
    updateLeague((current) => ({
      ...current,
      managers: current.managers.map((candidate) => {
        if (candidate.email !== currentUserEmail) return candidate;
        const has = candidate.starters.includes(playerId);
        if (has) return { ...candidate, starters: candidate.starters.filter((id) => id !== playerId) };
        if (candidate.starters.length >= current.settings.starters) return candidate;
        return { ...candidate, starters: [...candidate.starters, playerId] };
      }),
    }));
  };

  return (
    <section className="panel team-panel">
      <div className="panel-header">
        <div>
          <span className="eyebrow">{players.length}/{league.settings.squadSize} selected</span>
          <h2>Your Team</h2>
        </div>
        <IconButton label={collapsed ? "Expand team" : "Collapse team"} icon={ChevronDown} onClick={() => setCollapsed((old) => !old)} />
      </div>
      {!collapsed ? (
        <>
          <div className="squad-counts">
            {["GK", "DEF", "MID", "FWD"].map((pos) => (
              <Stat key={pos} label={pos} value={counts[pos] || 0} />
            ))}
          </div>
          <div className="pitch">
            {starters.length === 0 ? <span>No players picked yet</span> : null}
            {starters.map((player) => (
              <button className={`pitch-player pitch-${player.pos}`} key={player.id} onClick={() => toggleStarter(player.id)}>
                <Kit player={player} size="sm" />
                <b>{player.name.split(" ").slice(-1)[0]}</b>
              </button>
            ))}
          </div>
          <div className="squad-list">
            {players.map((player) => (
              <div className="squad-row" key={player.id}>
                <Kit player={player} />
                <div>
                  <strong>{player.name}</strong>
                  <small>{player.pos} - {player.country}</small>
                </div>
                <span>{player.points || player.expected}</span>
              </div>
            ))}
          </div>
        </>
      ) : null}
    </section>
  );
}

function SettingsPage({ selectedLeague, currentUserEmail, setDb, setNotice, setActiveView }) {
  const [csvText, setCsvText] = useState("name,country,pos,club,price,rating\n");

  if (!selectedLeague) {
    return (
      <main className="page">
        <div className="empty-state">
          <Settings size={38} />
          <h1>No league selected</h1>
          <p>Create a league before editing settings.</p>
          <Button onClick={() => setActiveView("create")} icon={UserPlus}>
            Create League
          </Button>
        </div>
      </main>
    );
  }

  const isCommissioner = selectedLeague.ownerEmail === currentUserEmail;
  const statsApi = { ...DEFAULT_STATS_API, ...(selectedLeague.settings.statsApi || {}) };

  if (!isCommissioner) {
    return (
      <main className="page">
        <div className="empty-state">
          <Lock size={38} />
          <h1>Commissioner only</h1>
          <p>Only the league creator can change draft settings, scoring, API keys, and admin controls.</p>
          <Button onClick={() => setActiveView("rules")} icon={BookOpen}>
            View Rules
          </Button>
        </div>
      </main>
    );
  }

  const updateSettings = (key, value) => {
    setDb((old) => ({
      ...old,
      leagues: old.leagues.map((league) => {
        if (league.id !== selectedLeague.id) return league;
        const nextSettings = { ...league.settings, [key]: value };
        const nextBudget = getAuctionBudget(nextSettings);
        return {
          ...league,
          settings: nextSettings,
          managers: key === "draftType" || key === "budget"
            ? league.managers.map((manager) => ({ ...manager, budget: nextBudget }))
            : league.managers,
        };
      }),
    }));
  };

  const updateScoring = (key, value) => {
    setDb((old) => ({
      ...old,
      leagues: old.leagues.map((league) =>
        league.id === selectedLeague.id
          ? { ...league, settings: { ...league.settings, scoring: { ...league.settings.scoring, [key]: Number(value) } } }
          : league
      ),
    }));
  };

  const updateStatsApi = (key, value) => {
    setDb((old) => ({
      ...old,
      leagues: old.leagues.map((league) =>
        league.id === selectedLeague.id
          ? { ...league, settings: { ...league.settings, statsApi: { ...DEFAULT_STATS_API, ...(league.settings.statsApi || {}), [key]: value } } }
          : league
      ),
    }));
  };

  const importCsvPlayers = () => {
    const rows = csvText.split("\n").map((line) => line.trim()).filter(Boolean).slice(1);
    const imported = rows.map((row, index) => {
      const [name, country, pos, club, price, rating] = row.split(",").map((value) => value?.trim());
      const team = WORLD_CUP_TEAMS.find(([, teamName]) => teamName.toLowerCase() === String(country).toLowerCase());
      const code = team?.[0] || "INT";
      const colors = team ? [team[2], team[3]] : ["#111827", "#e5e7eb"];
      const safePos = ["GK", "DEF", "MID", "FWD"].includes(pos) ? pos : "MID";
      const safeRating = clamp(Number(rating) || 75, 50, 99);
      return {
        id: index + 1,
        name: name || `Imported Player ${index + 1}`,
        country: country || "International",
        code,
        group: team?.[4] || "-",
        pos: safePos,
        club: club || "Final squad",
        price: Number(price) || 10,
        rating: safeRating,
        expected: Math.round(safeRating * 1.6),
        points: 0,
        stats: { ...EMPTY_PLAYER_STATS },
        news: "Imported",
        selectedBy: "",
        colors,
      };
    });

    if (!imported.length) {
      setNotice("Paste at least one CSV row first.");
      return;
    }

    setDb((old) => ({ ...old, playerPool: imported }));
    setNotice(`Imported ${imported.length} players.`);
  };

  const updateLeagueState = (updater, notice, nextView) => {
    setDb((old) => ({
      ...old,
      leagues: old.leagues.map((league) => (league.id === selectedLeague.id ? updater(league) : league)),
    }));
    if (notice) setNotice(notice);
    if (nextView) setActiveView(nextView);
  };

  const markDraftComplete = () => {
    updateLeagueState(
      (league) => ({ ...league, status: "complete", draft: { ...league.draft, paused: true, message: "Draft marked complete." } }),
      "Draft marked complete.",
      "draft"
    );
  };

  const startWorldCupTest = () => {
    updateLeagueState(
      (league) => ({
        ...league,
        status: "live",
        draft: { ...league.draft, paused: true, message: "World Cup mode is live. Draft room closed." },
        activity: [{ id: makeId("activity"), text: "World Cup mode started", createdAt: new Date().toISOString() }, ...league.activity],
      }),
      "World Cup test mode started. Draft page is hidden and Stats is open.",
      "stats"
    );
  };

  const reopenDraftRoom = () => {
    const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
    updateLeagueState(
      (league) => ({
        ...league,
        status: "complete",
        settings: {
          ...league.settings,
          worldCupStartDate: hasWorldCupStarted(league) ? tomorrow : getWorldCupStartDate(league),
        },
        draft: { ...league.draft, paused: true, message: "Draft room reopened for beta testing." },
        activity: [{ id: makeId("activity"), text: "Draft room reopened for beta testing", createdAt: new Date().toISOString() }, ...league.activity],
      }),
      "Draft room reopened for beta testing.",
      "draft"
    );
  };

  const restartDraftFromSettings = () => {
    const shouldRestart = window.confirm("Restart this draft? This clears all picks and squads, but keeps managers, queues, watchlists and settings.");
    if (!shouldRestart) return;
    updateLeagueState((league) => restartLeagueDraftState(league), "Draft restarted.", "draft");
  };

  return (
    <main className="page settings-layout">
      <section className="panel">
        <span className="eyebrow">Commissioner</span>
        <h1>Settings</h1>
        {!isCommissioner ? <p className="notice-inline">Only the commissioner can edit league settings.</p> : null}
        <div className="form-grid">
          <Field label="League name">
            <input
              disabled={!isCommissioner}
              value={selectedLeague.name}
              onChange={(event) =>
                setDb((old) => ({
                  ...old,
                  leagues: old.leagues.map((league) => (league.id === selectedLeague.id ? { ...league, name: event.target.value } : league)),
                }))
              }
            />
          </Field>
          <Field label="Draft type">
            <select disabled={!isCommissioner} value={selectedLeague.settings.draftType} onChange={(event) => updateSettings("draftType", event.target.value)}>
              <option>Snake Draft</option>
              <option>Auction Draft</option>
            </select>
          </Field>
          <Field label="Format">
            <select disabled={!isCommissioner} value={selectedLeague.settings.format} onChange={(event) => updateSettings("format", event.target.value)}>
              <option>Head to Head</option>
              <option>Classic</option>
            </select>
          </Field>
          <Field label="Visibility">
            <select disabled={!isCommissioner} value={selectedLeague.settings.visibility} onChange={(event) => updateSettings("visibility", event.target.value)}>
              <option>Private</option>
              <option>Public</option>
            </select>
          </Field>
          <Field label="Max managers">
            <input disabled={!isCommissioner} type="number" value={selectedLeague.settings.maxManagers} onChange={(event) => updateSettings("maxManagers", Number(event.target.value))} />
          </Field>
          <Field label="Squad size">
            <input disabled={!isCommissioner} type="number" value={selectedLeague.settings.squadSize} onChange={(event) => updateSettings("squadSize", Number(event.target.value))} />
          </Field>
          <Field label="Pick timer">
            <input disabled={!isCommissioner} type="number" value={selectedLeague.settings.pickTimer} onChange={(event) => updateSettings("pickTimer", Number(event.target.value))} />
          </Field>
          <Field label="World Cup starts" hint="Draft navigation hides automatically on this date. Use the beta controls below to test early.">
            <input disabled={!isCommissioner} type="date" value={getWorldCupStartDate(selectedLeague)} onChange={(event) => updateSettings("worldCupStartDate", event.target.value)} />
          </Field>
          {selectedLeague.settings.draftType === "Auction Draft" ? (
            <Field label="Auction budget">
              <input disabled={!isCommissioner} type="number" value={selectedLeague.settings.budget} onChange={(event) => updateSettings("budget", getAuctionBudget({ ...selectedLeague.settings, budget: Number(event.target.value) }))} />
            </Field>
          ) : null}
          <Field label="Waivers">
            <select disabled={!isCommissioner} value={selectedLeague.settings.waivers} onChange={(event) => updateSettings("waivers", event.target.value)}>
              <option>Rolling waivers</option>
              <option>Free agency</option>
              <option>Weekly waivers</option>
            </select>
          </Field>
        </div>
      </section>

      <section className="panel">
        <div className="panel-header">
          <div>
            <span className="eyebrow">Beta controls</span>
            <h2>Commissioner Tools</h2>
          </div>
          <ShieldCheck size={20} />
        </div>
        <p className="muted-copy">Only the league creator can run these. They let you test the live-tournament state before {getWorldCupStartDate(selectedLeague)} and recover the room if a test needs a reset.</p>
        <div className="inline-actions control-actions">
          <Button onClick={markDraftComplete} variant="secondary" icon={CheckCircle2}>
            Mark Complete
          </Button>
          <Button onClick={startWorldCupTest} icon={Play}>
            Start World Cup / Test
          </Button>
          <Button onClick={reopenDraftRoom} variant="secondary" icon={Gavel}>
            Reopen Draft Room
          </Button>
          <Button onClick={restartDraftFromSettings} variant="danger" icon={RefreshCw}>
            Restart Draft
          </Button>
        </div>
      </section>

      <section className="panel">
        <div className="panel-header">
          <div>
            <span className="eyebrow">Scoring</span>
            <h2>Rules Matrix</h2>
          </div>
          <Save size={20} />
        </div>
        <div className="scoring-grid">
          {Object.entries(selectedLeague.settings.scoring).map(([key, value]) => (
            <Field label={SCORING_LABELS[key] || key} key={key}>
              <input disabled={!isCommissioner} type="number" value={value} onChange={(event) => updateScoring(key, event.target.value)} />
            </Field>
          ))}
        </div>
      </section>

      <section className="panel">
        <div className="panel-header">
          <div>
            <span className="eyebrow">Match stats</span>
            <h2>Stats API</h2>
          </div>
          <BarChart3 size={20} />
        </div>
        <p className="muted-copy">
          Demo Stats API works without a key. API-Football can pull World Cup 2026 fixture/player stats when you add your API-SPORTS key.
        </p>
        <div className="form-grid">
          <Field label="Provider">
            <select disabled={!isCommissioner} value={statsApi.provider} onChange={(event) => updateStatsApi("provider", event.target.value)}>
              <option>Demo Stats API</option>
              <option>API-Football</option>
            </select>
          </Field>
          <Field label="API-Football key">
            <input disabled={!isCommissioner || statsApi.provider !== "API-Football"} type="password" value={statsApi.apiSportsKey} onChange={(event) => updateStatsApi("apiSportsKey", event.target.value)} placeholder="x-apisports-key" />
          </Field>
          <Field label="API-Football league id">
            <input disabled={!isCommissioner || statsApi.provider !== "API-Football"} value={statsApi.leagueId} onChange={(event) => updateStatsApi("leagueId", event.target.value)} />
          </Field>
          <Field label="Season">
            <input disabled={!isCommissioner || statsApi.provider !== "API-Football"} value={statsApi.season} onChange={(event) => updateStatsApi("season", event.target.value)} />
          </Field>
          <Field label="Date from">
            <input disabled={!isCommissioner || statsApi.provider !== "API-Football"} type="date" value={statsApi.dateFrom} onChange={(event) => updateStatsApi("dateFrom", event.target.value)} />
          </Field>
          <Field label="Date to">
            <input disabled={!isCommissioner || statsApi.provider !== "API-Football"} type="date" value={statsApi.dateTo} onChange={(event) => updateStatsApi("dateTo", event.target.value)} />
          </Field>
        </div>
        {statsApi.lastSyncAt ? <p className="notice-inline">Last synced from {statsApi.lastSyncSource} at {new Date(statsApi.lastSyncAt).toLocaleString()}.</p> : null}
      </section>

      <section className="panel import-panel">
        <div className="panel-header">
          <div>
            <span className="eyebrow">Data tools</span>
            <h2>Official Squad Import</h2>
          </div>
          <Upload size={20} />
        </div>
        <p className="muted-copy">Paste CSV once final squads are available. Header: name,country,pos,club,price,rating.</p>
        <textarea value={csvText} onChange={(event) => setCsvText(event.target.value)} />
        <Button onClick={importCsvPlayers} disabled={!isCommissioner} icon={Upload}>
          Import CSV
        </Button>
      </section>
    </main>
  );
}

function RulesPage({ selectedLeague }) {
  const settings = selectedLeague?.settings || DEFAULT_SETTINGS;
  const rules = [
    ["Draft", `${settings.draftType} with ${settings.pickTimer}s per pick.`],
    ["Roster", `${settings.squadSize} total players, ${settings.starters} starters and ${settings.bench} bench targets.`],
    ["Lineups", "Managers can set starters before simulated matchdays and view projected standings."],
    ["Auto-pick", "Queued players are selected first when a manager times out."],
    ["Trades", `${settings.tradeReview}; trades unlock after the draft is complete or World Cup mode starts.`],
    ["Waivers", settings.waivers],
  ];

  return (
    <main className="page rules-layout">
      <section className="panel">
        <span className="eyebrow">League guide</span>
        <h1>Rules</h1>
        <div className="rules-list">
          {rules.map(([title, body]) => (
            <article key={title}>
              <h2>{title}</h2>
              <p>{body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="panel">
        <div className="panel-header">
          <div>
            <span className="eyebrow">Points</span>
            <h2>Scoring</h2>
          </div>
          <BookOpen size={20} />
        </div>
        <div className="rules-scoring">
          {Object.entries(settings.scoring).map(([key, value]) => (
            <div key={key}>
              <span>{SCORING_LABELS[key] || key}</span>
              <strong>{value}</strong>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

function StatsPage({ db, selectedLeague, currentUserEmail, setDb, setNotice, setActiveView }) {
  const [query, setQuery] = useState("");
  const [position, setPosition] = useState("ALL");
  const [country, setCountry] = useState("ALL");
  const [sortBy, setSortBy] = useState("points");

  if (!selectedLeague) {
    return (
      <main className="page">
        <div className="empty-state">
          <BarChart3 size={38} />
          <h1>No league selected</h1>
          <p>Join a league before viewing live stats.</p>
          <Button onClick={() => setActiveView("create")} icon={UserPlus}>
            Join or Create
          </Button>
        </div>
      </main>
    );
  }

  const owned = new Map();
  const isCommissioner = selectedLeague.ownerEmail === currentUserEmail;
  selectedLeague.managers.forEach((manager) => manager.squad.forEach((id) => owned.set(id, manager.teamName)));
  const standings = [...selectedLeague.managers].sort((a, b) => managerScore(b, db.playerPool, "live") - managerScore(a, db.playerPool, "live"));
  const myManager = selectedLeague.managers.find((manager) => manager.email === currentUserEmail);
  const myPlayers = (myManager?.squad || []).map((id) => db.playerPool.find((player) => player.id === id)).filter(Boolean);
  const topPlayers = db.playerPool
    .filter((player) => position === "ALL" || player.pos === position)
    .filter((player) => country === "ALL" || player.country === country)
    .filter((player) => `${player.name} ${player.country} ${player.code}`.toLowerCase().includes(query.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === "goals") return (b.stats?.goals || 0) - (a.stats?.goals || 0);
      if (sortBy === "assists") return (b.stats?.assists || 0) - (a.stats?.assists || 0);
      if (sortBy === "minutes") return (b.stats?.minutes || 0) - (a.stats?.minutes || 0);
      if (sortBy === "rating") return (b.stats?.apiRating || b.rating) - (a.stats?.apiRating || a.rating);
      return b.points - a.points;
    })
    .slice(0, 180);
  const statsApi = { ...DEFAULT_STATS_API, ...(selectedLeague.settings.statsApi || {}) };

  return (
    <main className="page stats-layout">
      <section className="page-title">
        <span className="eyebrow">{selectedLeague.status === "live" ? "World Cup live" : "Pre-tournament"}</span>
        <h1>Stats</h1>
      </section>

      <section className="panel stats-summary">
        <div className="panel-header">
          <div>
            <span className="eyebrow">League table</span>
            <h2>Standings</h2>
          </div>
          {isCommissioner ? (
            <Button onClick={() => syncStatsForLeague({ selectedLeague, db, setDb, setNotice })} icon={BarChart3}>
              Sync / Simulate Match Stats
            </Button>
          ) : null}
        </div>
        <p className="muted-copy">Beta test mode uses the bundled Demo Stats API so scoring can be tested before World Cup matches are actually played.</p>
        <div className="summary-grid">
          <Stat label="Provider" value={statsApi.provider} />
          <Stat label="Last sync" value={statsApi.lastSyncAt ? new Date(statsApi.lastSyncAt).toLocaleDateString() : "Never"} />
          <Stat label="Your points" value={managerScore(myManager || { squad: [] }, db.playerPool, "live")} />
        </div>
        <div className="standings-list">
          {standings.map((manager, index) => (
            <div className="standing-row" key={manager.email}>
              <strong>{index + 1}</strong>
              <span>{manager.teamName}</span>
              <b>{managerScore(manager, db.playerPool, "live")}</b>
            </div>
          ))}
        </div>
      </section>

      <section className="panel player-board stats-board">
        <div className="panel-header">
          <div>
            <span className="eyebrow">Full stat table</span>
            <h2>Players</h2>
          </div>
        </div>
        <div className="filters">
          <div className="search-box">
            <Search size={16} />
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search player, country..." />
          </div>
          <select value={position} onChange={(event) => setPosition(event.target.value)}>
            <option>ALL</option>
            <option>GK</option>
            <option>DEF</option>
            <option>MID</option>
            <option>FWD</option>
          </select>
          <select value={country} onChange={(event) => setCountry(event.target.value)}>
            <option>ALL</option>
            {WORLD_CUP_TEAMS.map(([code, countryName]) => (
              <option key={code} value={countryName}>{code} - {countryName}</option>
            ))}
          </select>
          <select value={sortBy} onChange={(event) => setSortBy(event.target.value)}>
            <option value="points">Points</option>
            <option value="goals">Goals</option>
            <option value="assists">Assists</option>
            <option value="minutes">Minutes</option>
            <option value="rating">API rating</option>
          </select>
        </div>
        <div className="players-table stats-columns" role="table">
          <div className="table-head" role="row">
            <span>Name</span>
            <span>Pos</span>
            {STAT_COLUMNS.map(([, label]) => <span key={label}>{label}</span>)}
            <span>Owner</span>
          </div>
          {topPlayers.map((player) => (
            <div className="table-row" key={player.id} role="row">
              <div className="player-cell">
                <Kit player={player} />
                <div>
                  <strong>{player.name}</strong>
                  <small>{player.country} - {player.news}</small>
                </div>
              </div>
              <span><PosBadge pos={player.pos} /></span>
              {STAT_COLUMNS.map(([key]) => (
                <span key={key}>{key in (player.stats || {}) ? player.stats?.[key] || 0 : player[key] || 0}</span>
              ))}
              <span>{owned.get(player.id) || "-"}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="panel">
        <div className="panel-header">
          <div>
            <span className="eyebrow">Your squad</span>
            <h2>Player Points</h2>
          </div>
          <ShieldCheck size={20} />
        </div>
        <div className="squad-list">
          {myPlayers.length === 0 ? <p className="muted-copy">Draft players first, then their synced points appear here.</p> : null}
          {myPlayers.map((player) => (
            <div className="squad-row" key={player.id}>
              <Kit player={player} />
              <div>
                <strong>{player.name}</strong>
                <small>{player.stats?.goals || 0} G, {player.stats?.assists || 0} A, {player.stats?.minutes || 0} min</small>
              </div>
              <span>{player.points}</span>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

function TradeCenter({ selectedLeague, currentUserEmail, db, setDb, setNotice }) {
  const [offerPlayer, setOfferPlayer] = useState("");
  const [targetManager, setTargetManager] = useState("");
  const [targetPlayer, setTargetPlayer] = useState("");

  if (!selectedLeague) return null;

  const playerById = (id) => db.playerPool.find((player) => player.id === Number(id));
  const myManager = selectedLeague.managers.find((manager) => manager.email === currentUserEmail);
  const otherManagers = selectedLeague.managers.filter((manager) => manager.email !== currentUserEmail);
  const target = selectedLeague.managers.find((manager) => manager.email === targetManager);

  const proposeTrade = () => {
    if (!offerPlayer || !targetManager || !targetPlayer) {
      setNotice("Choose both sides of the trade first.");
      return;
    }

    setDb((old) => ({
      ...old,
      leagues: old.leagues.map((league) =>
        league.id === selectedLeague.id
          ? {
              ...league,
              trades: [
                {
                  id: makeId("trade"),
                  fromEmail: currentUserEmail,
                  toEmail: targetManager,
                  fromPlayerId: Number(offerPlayer),
                  toPlayerId: Number(targetPlayer),
                  status: "pending",
                  createdAt: new Date().toISOString(),
                },
                ...league.trades,
              ],
            }
          : league
      ),
    }));
    setOfferPlayer("");
    setTargetManager("");
    setTargetPlayer("");
    setNotice("Trade proposed.");
  };

  const resolveTrade = (tradeId, status) => {
    setDb((old) => ({
      ...old,
      leagues: old.leagues.map((league) => {
        if (league.id !== selectedLeague.id) return league;
        const trade = league.trades.find((item) => item.id === tradeId);
        if (!trade) return league;

        let managers = league.managers;
        if (status === "accepted") {
          managers = league.managers.map((manager) => {
            if (manager.email === trade.fromEmail) {
              return {
                ...manager,
                squad: manager.squad.map((id) => (id === trade.fromPlayerId ? trade.toPlayerId : id)),
                starters: manager.starters.filter((id) => id !== trade.fromPlayerId),
              };
            }
            if (manager.email === trade.toEmail) {
              return {
                ...manager,
                squad: manager.squad.map((id) => (id === trade.toPlayerId ? trade.fromPlayerId : id)),
                starters: manager.starters.filter((id) => id !== trade.toPlayerId),
              };
            }
            return manager;
          });
        }

        return {
          ...league,
          managers,
          trades: league.trades.map((item) => (item.id === tradeId ? { ...item, status } : item)),
        };
      }),
    }));
    setNotice(`Trade ${status}.`);
  };

  return (
    <section className="panel trade-panel">
      <div className="panel-header">
        <div>
          <span className="eyebrow">Post-draft tools</span>
          <h2>Trades</h2>
        </div>
        <ArrowLeftRight size={20} />
      </div>
      <div className="trade-form">
        <select value={offerPlayer} onChange={(event) => setOfferPlayer(event.target.value)}>
          <option value="">Your player</option>
          {(myManager?.squad || []).map(playerById).filter(Boolean).map((player) => (
            <option key={player.id} value={player.id}>{player.name}</option>
          ))}
        </select>
        <select value={targetManager} onChange={(event) => { setTargetManager(event.target.value); setTargetPlayer(""); }}>
          <option value="">Manager</option>
          {otherManagers.map((manager) => (
            <option key={manager.email} value={manager.email}>{manager.teamName}</option>
          ))}
        </select>
        <select value={targetPlayer} onChange={(event) => setTargetPlayer(event.target.value)}>
          <option value="">Their player</option>
          {(target?.squad || []).map(playerById).filter(Boolean).map((player) => (
            <option key={player.id} value={player.id}>{player.name}</option>
          ))}
        </select>
        <Button onClick={proposeTrade} icon={Send}>
          Propose
        </Button>
      </div>
      <div className="trade-list">
        {selectedLeague.trades.length === 0 ? <p className="muted-copy">No trade offers yet.</p> : null}
        {selectedLeague.trades.map((trade) => (
          <div className="trade-item" key={trade.id}>
            <p>
              <strong>{selectedLeague.managers.find((manager) => manager.email === trade.fromEmail)?.teamName}</strong> offers{" "}
              <b>{playerById(trade.fromPlayerId)?.name}</b> for <b>{playerById(trade.toPlayerId)?.name}</b>
            </p>
            <span className={`status status-${trade.status}`}>{trade.status}</span>
            {trade.toEmail === currentUserEmail && trade.status === "pending" ? (
              <div className="inline-actions">
                <Button size="sm" onClick={() => resolveTrade(trade.id, "accepted")}>Accept</Button>
                <Button size="sm" variant="secondary" onClick={() => resolveTrade(trade.id, "rejected")}>Reject</Button>
              </div>
            ) : null}
          </div>
        ))}
      </div>
    </section>
  );
}

export default function App() {
  const [db, setDb] = useState(loadDb);
  const [notice, setNotice] = useState("Prototype data saves to this browser only.");
  const [activeView, setActiveView] = useState("dashboard");
  const [selectedLeagueId, setSelectedLeagueId] = useState("");
  const [handledInviteKey, setHandledInviteKey] = useState("");
  const [remoteLoadedFor, setRemoteLoadedFor] = useState("");
  const pendingInvite = getInviteFromUrl();

  useEffect(() => saveDb(db), [db]);

  const currentUser = db.accounts.find((account) => account.email === db.currentUserEmail);
  const currentUserEmail = db.currentUserEmail;
  const myLeagues = db.leagues.filter((league) => league.managers.some((manager) => manager.email === currentUserEmail));
  const selectedLeague = db.leagues.find((league) => league.id === selectedLeagueId) || myLeagues[0] || null;

  useEffect(() => {
    if (!selectedLeagueId && myLeagues[0]) setSelectedLeagueId(myLeagues[0].id);
  }, [selectedLeagueId, myLeagues]);

  useEffect(() => {
    if (!currentUser || !pendingInvite || handledInviteKey === pendingInvite.key) return undefined;
    let cancelled = false;

    const handleInvite = async () => {
      try {
        const remoteLeague = await joinRemoteLeague(pendingInvite.code, currentUser.displayName || "My XI");
        if (cancelled) return;
        setDb((old) => mergeRemoteLeagues(old, [remoteLeague]));
        setSelectedLeagueId(remoteLeague.id);
        setActiveView(canOpenDraft(remoteLeague) ? "draft" : "stats");
        setNotice("Joined league from secure beta server.");
        setHandledInviteKey(pendingInvite.key);
        clearInviteFromUrl();
        return;
      } catch (error) {
        if (!pendingInvite.payload || !canUseLocalInviteFallback(error)) {
          if (!cancelled) setNotice(error.message);
          return;
        }
      }

      let result;
      setDb((old) => {
        result = joinLeagueByInvite(old, pendingInvite, currentUserEmail, currentUser.displayName || "My XI");
        return result.db;
      });

      if (cancelled) return;
      if (result.leagueId) {
        const joinedLeague = result.db.leagues.find((league) => league.id === result.leagueId);
        setSelectedLeagueId(result.leagueId);
        setActiveView(canOpenDraft(joinedLeague) ? "draft" : "stats");
      }
      setNotice(result.leagueId ? `${result.message} Local fallback is active because the secure beta server is unavailable.` : result.message);
      setHandledInviteKey(pendingInvite.key);
      clearInviteFromUrl();
    };

    handleInvite();
    return () => {
      cancelled = true;
    };
  }, [currentUserEmail, currentUser?.displayName, handledInviteKey, pendingInvite?.key]);

  useEffect(() => {
    if (!currentUserEmail || remoteLoadedFor === currentUserEmail) return undefined;
    let cancelled = false;

    fetchRemoteLeagues()
      .then((remoteLeagues) => {
        if (cancelled) return;
        setDb((old) => mergeRemoteLeagues(old, remoteLeagues));
        setRemoteLoadedFor(currentUserEmail);
      })
      .catch(() => setRemoteLoadedFor(currentUserEmail));

    return () => {
      cancelled = true;
    };
  }, [currentUserEmail, remoteLoadedFor]);

  useEffect(() => {
    if (!currentUserEmail) return undefined;
    const interval = window.setInterval(() => {
      fetchRemoteLeagues()
        .then((remoteLeagues) => setDb((old) => mergeRemoteLeagues(old, remoteLeagues)))
        .catch(() => {});
    }, 6000);
    return () => window.clearInterval(interval);
  }, [currentUserEmail]);

  useEffect(() => {
    if (!currentUserEmail) return undefined;
    const ownedOrJoined = db.leagues.filter((league) => league.managers.some((manager) => manager.email === currentUserEmail));
    if (!ownedOrJoined.length) return undefined;

    const timer = window.setTimeout(() => {
      Promise.allSettled(ownedOrJoined.map((league) => saveRemoteLeague(league))).catch(() => {});
    }, 900);

    return () => window.clearTimeout(timer);
  }, [currentUserEmail, db.leagues]);

  useEffect(() => {
    if (!canOpenLeaguePages(selectedLeague) && ["draft", "stats", "settings", "rules"].includes(activeView)) {
      setActiveView("dashboard");
      return;
    }
    if (activeView === "settings" && selectedLeague && selectedLeague.ownerEmail !== currentUserEmail) {
      setActiveView("rules");
      return;
    }
    if (!canOpenDraft(selectedLeague) && activeView === "draft") {
      setActiveView("stats");
    }
  }, [activeView, selectedLeague?.id, selectedLeague?.status, selectedLeague?.settings?.worldCupStartDate, currentUserEmail]);

  const logout = () => {
    fetch("/api/auth/logout", { method: "POST", credentials: "include" }).catch(() => {});
    setDb((old) => ({ ...old, currentUserEmail: "" }));
    setNotice("Signed out.");
  };

  const resetEverything = () => {
    const shouldReset = window.confirm("Reset all local accounts, leagues, picks, and settings?");
    if (!shouldReset) return;
    setDb(getEmptyDb());
    setSelectedLeagueId("");
    setActiveView("dashboard");
    setNotice("Local prototype reset.");
  };

  const updateLeague = (updater, leagueId = selectedLeague?.id, insert = false) => {
    setDb((old) => {
      if (insert) return { ...old, leagues: [...old.leagues, updater()] };
      return {
        ...old,
        leagues: old.leagues.map((league) => (league.id === leagueId ? updater(league) : league)),
      };
    });
  };

  if (!currentUser) {
    return <AuthScreen db={db} setDb={setDb} setNotice={setNotice} pendingInvite={pendingInvite} />;
  }

  return (
    <div className="app">
      <AppShell
        currentUser={currentUser}
        activeView={activeView}
        setActiveView={setActiveView}
        selectedLeague={selectedLeague}
        setSelectedLeagueId={setSelectedLeagueId}
        leagues={myLeagues}
        logout={logout}
        resetEverything={resetEverything}
      />

      {notice ? (
        <div className="notice-toast" role="status">
          <CheckCircle2 size={16} />
          <span>{notice}</span>
          <button onClick={() => setNotice("")}>Close</button>
        </div>
      ) : null}

      {activeView === "dashboard" ? (
        <>
          <Dashboard
            db={db}
            currentUserEmail={currentUserEmail}
            selectedLeague={selectedLeague}
            setSelectedLeagueId={setSelectedLeagueId}
            setActiveView={setActiveView}
            setNotice={setNotice}
            updateLeague={updateLeague}
          />
          <div className="page no-top">
            <TradeCenter selectedLeague={selectedLeague} currentUserEmail={currentUserEmail} db={db} setDb={setDb} setNotice={setNotice} />
          </div>
        </>
      ) : null}

      {activeView === "create" ? (
        <CreateLeague
          currentUserEmail={currentUserEmail}
          setDb={setDb}
          setSelectedLeagueId={setSelectedLeagueId}
          setActiveView={setActiveView}
          setNotice={setNotice}
        />
      ) : null}

      {activeView === "public" ? (
        <PublicLeagues
          db={db}
          currentUserEmail={currentUserEmail}
          setDb={setDb}
          setSelectedLeagueId={setSelectedLeagueId}
          setActiveView={setActiveView}
          setNotice={setNotice}
        />
      ) : null}

      {activeView === "draft" ? (
        <DraftRoom
          db={db}
          selectedLeague={selectedLeague}
          currentUserEmail={currentUserEmail}
          setDb={setDb}
          setNotice={setNotice}
          setActiveView={setActiveView}
        />
      ) : null}

      {activeView === "stats" ? (
        <StatsPage
          db={db}
          selectedLeague={selectedLeague}
          currentUserEmail={currentUserEmail}
          setDb={setDb}
          setNotice={setNotice}
          setActiveView={setActiveView}
        />
      ) : null}

      {activeView === "settings" ? (
        <SettingsPage
          selectedLeague={selectedLeague}
          currentUserEmail={currentUserEmail}
          setDb={setDb}
          setNotice={setNotice}
          setActiveView={setActiveView}
        />
      ) : null}

      {activeView === "rules" ? <RulesPage selectedLeague={selectedLeague} /> : null}
    </div>
  );
}
