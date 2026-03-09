import './styles.css';
import * as tts from '../src';
import {
  createElement,
  Download,
  Sparkles,
  Volume2,
  Loader2,
  RefreshCcw,
} from 'lucide';
// @ts-ignore-next-line
import Worker from './worker.ts?worker';

type Language = 'en' | 'eu' | 'es' | 'fr';

const DEFAULT_TEXTS: Record<Language, string> = {
  en: 'Hello! This is a sample message generated with the Maider voice. Type the text you want and press listen.',
  eu: 'Kaixo! Hau Maider ahotsarekin sortutako proba mezua da. Idatzi nahi duzun testua eta entzuteko sakatu.',
  es: 'Hola. Este es un mensaje de prueba generado con la voz de Maider. Escribe el texto que quieras y pulsa para escuchar.',
  fr: "Bonjour. Ceci est un message d'exemple généré avec la voix de Maider. Saisissez le texte que vous souhaitez et appuyez pour écouter.",
};
const VOICE_ID = 'eu-maider-medium';
const STORAGE_LANGUAGE_KEY = 'basque_piper_tts_language';
const SUPPORTED_LANGUAGES: Language[] = ['en', 'eu', 'es', 'fr'];
const LANGUAGE_LABELS: Record<Language, string> = {
  en: 'EN',
  eu: 'EU',
  es: 'ES',
  fr: 'FR',
};

const translations = {
  en: {
    headerTag: 'Basque voice demo',
    title: 'Basque Piper TTS',
    subtitle:
      'Generate natural Basque speech with Basque Piper TTS models. Customize the text, pick a voice, then listen or export the audio.',
    voiceBadge: 'Voice: Maider (female)',
    languageBadge: 'Language: Euskara',
    references: 'References:',
    referencePiper: 'Piper project',
    referenceItzune: 'Itzune TTS',
    referenceHitz: 'HiTZ Aholab TTS',
    textLabel: 'Text',
    helper: 'Basque input recommended for the best results.',
    generate: 'Generate',
    reset: 'Reset text',
    flush: 'Clear storage',
    statusIdle: 'Idle',
    statusReady: 'Model ready',
    statusDownloading: 'Downloading',
    statusDownloadingDetail: 'Fetching model assets',
    statusGenerating: 'Generating',
    statusGeneratingDetail: 'Synthesizing audio',
    downloadingLabel: 'Downloading model...',
    generatingLabel: 'Generating...',
    latestRender: 'Latest render',
    renderNone: 'No audio yet',
    download: 'Download audio',
    storedVoices: 'Stored voices',
    renderReady: 'Ready to play',
    renderError: 'Something went wrong',
    statusError: 'Error',
    unknownError: 'Unknown error',
    statusReadyLabel: 'Ready',
    statusReadyDetail: 'Audio generated',
    statusPreparing: 'Preparing',
    languageToggleLabel: 'Language',
    charCount: (count: number) => `${count} character${count === 1 ? '' : 's'}`,
    progressComplete: (pct: number) => `${Math.round(pct)}% complete`,
  },
  eu: {
    headerTag: 'Euskarazko ahots demoa',
    title: 'Piper TTS Euskaraz',
    subtitle:
      'Euskarazko ahots naturalak sortu Basque Piper TTS modeloekin. Pertsonalizatu testua, aukeratu ahotsa eta entzun edo esportatu audioa.',
    voiceBadge: 'Ahotsa: Maider (emakumea)',
    languageBadge: 'Hizkuntza: Euskara',
    references: 'Erreferentziak:',
    referencePiper: 'Piper proiektua',
    referenceItzune: 'Itzune TTS',
    referenceHitz: 'HiTZ Aholab TTS',
    textLabel: 'Testua',
    helper: 'Emaitza onenak lortzeko, euskarazko testua gomendatzen da.',
    generate: 'Sortu',
    reset: 'Berrezarri testua',
    flush: 'Biltegia garbitu',
    statusIdle: 'Zain',
    statusReady: 'Eredua prest',
    statusDownloading: 'Deskargatzen',
    statusDownloadingDetail: 'Ereduaren fitxategiak deskargatzen',
    statusGenerating: 'Sortzen',
    statusGeneratingDetail: 'Audioa sortzen',
    downloadingLabel: 'Eredua deskargatzen...',
    generatingLabel: 'Sortzen...',
    latestRender: 'Azken sortzea',
    renderNone: 'Audioarik ez oraindik',
    download: 'Deskargatu audioa',
    storedVoices: 'Gordetako ahotsak',
    renderReady: 'Entzuteko prest',
    renderError: 'Zerbait gaizki joan da',
    statusError: 'Errorea',
    unknownError: 'Errore ezezaguna',
    statusReadyLabel: 'Prest',
    statusReadyDetail: 'Audioa sortuta',
    statusPreparing: 'Prestatzen',
    languageToggleLabel: 'Hizkuntza',
    charCount: (count: number) => `${count} karaktere`,
    progressComplete: (pct: number) => `${Math.round(pct)}% osatuta`,
  },
  es: {
    headerTag: 'Demo de voz en euskera',
    title: 'Basque Piper TTS',
    subtitle:
      'Genera voz natural en euskera con los modelos Basque Piper TTS. Personaliza el texto, elige una voz y luego escucha o exporta el audio.',
    voiceBadge: 'Voz: Maider (femenina)',
    languageBadge: 'Idioma: Euskera',
    references: 'Referencias:',
    referencePiper: 'Proyecto Piper',
    referenceItzune: 'Itzune TTS',
    referenceHitz: 'HiTZ Aholab TTS',
    textLabel: 'Texto',
    helper: 'Se recomienda texto en euskera para mejores resultados.',
    generate: 'Generar',
    reset: 'Restablecer texto',
    flush: 'Limpiar almacenamiento',
    statusIdle: 'En espera',
    statusReady: 'Modelo listo',
    statusDownloading: 'Descargando',
    statusDownloadingDetail: 'Descargando archivos del modelo',
    statusGenerating: 'Generando',
    statusGeneratingDetail: 'Sintetizando audio',
    downloadingLabel: 'Descargando modelo...',
    generatingLabel: 'Generando...',
    latestRender: 'Último resultado',
    renderNone: 'Sin audio aún',
    download: 'Descargar audio',
    storedVoices: 'Voces almacenadas',
    renderReady: 'Listo para reproducir',
    renderError: 'Algo salió mal',
    statusError: 'Error',
    unknownError: 'Error desconocido',
    statusReadyLabel: 'Listo',
    statusReadyDetail: 'Audio generado',
    statusPreparing: 'Preparando',
    languageToggleLabel: 'Idioma',
    charCount: (count: number) => `${count} carácter${count === 1 ? '' : 'es'}`,
    progressComplete: (pct: number) => `${Math.round(pct)}% completado`,
  },
  fr: {
    headerTag: 'Démo de voix basque',
    title: 'Basque Piper TTS',
    subtitle:
      "Générez une voix basque naturelle avec les modèles Basque Piper TTS. Personnalisez le texte, choisissez une voix, puis écoutez ou exportez l'audio.",
    voiceBadge: 'Voix : Maider (féminine)',
    languageBadge: 'Langue : basque',
    references: 'Références :',
    referencePiper: 'Projet Piper',
    referenceItzune: 'Itzune TTS',
    referenceHitz: 'HiTZ Aholab TTS',
    textLabel: 'Texte',
    helper: 'Le texte en basque est recommandé pour de meilleurs résultats.',
    generate: 'Générer',
    reset: 'Réinitialiser le texte',
    flush: 'Vider le stockage',
    statusIdle: 'Inactif',
    statusReady: 'Modèle prêt',
    statusDownloading: 'Téléchargement',
    statusDownloadingDetail: 'Récupération des fichiers du modèle',
    statusGenerating: 'Génération',
    statusGeneratingDetail: 'Synthèse audio',
    downloadingLabel: 'Téléchargement du modèle...',
    generatingLabel: 'Génération...',
    latestRender: 'Dernier rendu',
    renderNone: "Pas d'audio pour l'instant",
    download: "Télécharger l'audio",
    storedVoices: 'Voix stockées',
    renderReady: 'Prêt à écouter',
    renderError: 'Une erreur est survenue',
    statusError: 'Erreur',
    unknownError: 'Erreur inconnue',
    statusReadyLabel: 'Prêt',
    statusReadyDetail: 'Audio généré',
    statusPreparing: 'Préparation',
    languageToggleLabel: 'Langue',
    charCount: (count: number) => `${count} caractère${count > 1 ? 's' : ''}`,
    progressComplete: (pct: number) => `${Math.round(pct)}% terminé`,
  },
} as const;

const worker = new Worker();

// required for e2e
Object.assign(window, { tts });

document.querySelector('#app')!.innerHTML = `
  <main class="min-h-screen bg-ink-950 text-white">
    <div class="pointer-events-none absolute inset-0 bg-hero-glow opacity-90"></div>
    <div class="relative mx-auto flex min-h-screen max-w-6xl flex-col gap-10 px-6 py-12">
      <header class="flex flex-col gap-6">
        <div class="flex flex-wrap items-center justify-between gap-4">
          <div class="inline-flex w-fit items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white/70">
            <span class="inline-flex h-2 w-2 rounded-full bg-violet-400 shadow-glow"></span>
            <span data-i18n="headerTag"></span>
          </div>
          <div class="flex flex-wrap items-center gap-3">
            <img
              class="h-10 w-10 rounded-full border border-white/20"
              src="https://avatars.githubusercontent.com/u/185958299?s=400&u=ed950f6733b82e4ab46c02cc7b454bfcb3b43bc2&v=4"
              alt="Itzune logo"
              loading="lazy"
            />
            <a
              class="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-2 text-xs font-semibold text-white/70 transition hover:text-violet-200"
              href="https://github.com/itzune"
              target="_blank"
              rel="noreferrer"
            >
              GitHub
            </a>
            <a
              class="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-2 text-xs font-semibold text-white/70 transition hover:text-violet-200"
              href="https://huggingface.co/itzune"
              target="_blank"
              rel="noreferrer"
            >
              Hugging Face
            </a>
            <div class="lang-toggle" role="group" data-i18n-aria="languageToggleLabel">
              <button class="lang-option" type="button" data-lang="en">EN</button>
              <button class="lang-option" type="button" data-lang="eu">EU</button>
              <button class="lang-option" type="button" data-lang="es">ES</button>
              <button class="lang-option" type="button" data-lang="fr">FR</button>
            </div>
          </div>
        </div>
        <div class="flex flex-col gap-4">
          <h1 class="font-display text-4xl font-semibold text-white sm:text-5xl lg:text-6xl" data-i18n="title"></h1>
          <p class="max-w-2xl text-base text-white/70 sm:text-lg" data-i18n="subtitle"></p>
        </div>
        <div class="flex flex-wrap items-center gap-3">
          <span class="rounded-full border border-violet-400/40 bg-violet-500/15 px-4 py-1 text-sm text-violet-200" data-i18n="voiceBadge"></span>
          <span class="rounded-full border border-white/10 bg-white/5 px-4 py-1 text-sm text-white/70" data-i18n="languageBadge"></span>
        </div>
        <div class="flex flex-wrap items-center gap-4 text-sm text-white/60">
          <span data-i18n="references"></span>
          <a class="text-white/80 underline-offset-4 transition hover:text-violet-200 hover:underline" href="https://github.com/OHF-Voice/piper1-gpl" target="_blank" rel="noreferrer" data-i18n="referencePiper"></a>
          <a class="text-white/80 underline-offset-4 transition hover:text-violet-200 hover:underline" href="https://huggingface.co/collections/itzune/tts" target="_blank" rel="noreferrer" data-i18n="referenceItzune"></a>
          <a class="text-white/80 underline-offset-4 transition hover:text-violet-200 hover:underline" href="https://huggingface.co/collections/HiTZ/tts" target="_blank" rel="noreferrer" data-i18n="referenceHitz"></a>
        </div>
      </header>

      <section class="grid gap-6 lg:grid-cols-[minmax(0,_1.3fr)_minmax(0,_0.7fr)]">
        <div class="glass-card flex flex-col gap-6 rounded-3xl p-6 sm:p-8">
          <div class="flex flex-col gap-2">
            <label for="prompt" class="text-sm font-semibold uppercase tracking-[0.2em] text-white/60" data-i18n="textLabel"></label>
            <textarea id="prompt" rows="7" class="control-ring w-full rounded-2xl border border-white/10 bg-ink-900/80 px-4 py-3 text-base text-white/90 placeholder:text-white/40"></textarea>
            <div class="flex flex-wrap items-center justify-between gap-3 text-sm text-white/50">
              <span id="helper" data-i18n="helper"></span>
              <span id="charCount">0 characters</span>
            </div>
          </div>

          <div class="flex flex-wrap items-center gap-3">
            <button id="generate" class="button-primary" type="button">
              <span id="generateIcon"></span>
              <span id="generateLabel" data-i18n="generate"></span>
            </button>
            <button id="reset" class="button-secondary" type="button">
              <span id="resetIcon"></span>
              <span data-i18n="reset"></span>
            </button>
            <button id="flush" class="button-secondary" type="button">
              <span id="flushIcon"></span>
              <span data-i18n="flush"></span>
            </button>
          </div>

          <div class="flex flex-col gap-3">
            <div class="flex items-center justify-between text-sm text-white/70">
              <span id="statusLabel">Idle</span>
              <span id="statusDetail">Model ready</span>
            </div>
            <div class="h-2 w-full overflow-hidden rounded-full bg-white/10">
              <div id="progressBar" class="h-full w-0 rounded-full bg-gradient-to-r from-violet-400 via-violet-500 to-blush-500 transition-all"></div>
            </div>
          </div>
        </div>

        <div class="flex flex-col gap-6">
          <div class="glass-card flex flex-col gap-4 rounded-3xl p-6">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2 text-sm font-semibold text-white/80">
                <span id="audioIcon"></span>
                <span data-i18n="latestRender"></span>
              </div>
              <span id="renderState" class="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/60"></span>
            </div>
            <audio id="player" class="w-full" controls></audio>
            <button id="download" class="button-secondary" type="button" disabled>
              <span id="downloadIcon"></span>
              <span data-i18n="download"></span>
            </button>
          </div>

          <div class="glass-card flex flex-col gap-4 rounded-3xl p-6">
            <div class="flex items-center justify-between">
              <div class="text-sm font-semibold text-white/80" data-i18n="storedVoices"></div>
              <span id="storedCount" class="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/60">0</span>
            </div>
            <ul id="stored" class="space-y-2 text-sm text-white/60"></ul>
          </div>
        </div>
      </section>
    </div>
  </main>
`;

const promptEl = document.getElementById('prompt') as HTMLTextAreaElement | null;
const charCountEl = document.getElementById('charCount');
const statusLabelEl = document.getElementById('statusLabel');
const statusDetailEl = document.getElementById('statusDetail');
const progressBarEl = document.getElementById('progressBar');
const generateButton = document.getElementById('generate') as HTMLButtonElement | null;
const generateLabel = document.getElementById('generateLabel');
const renderStateEl = document.getElementById('renderState');
const playerEl = document.getElementById('player') as HTMLAudioElement | null;
const downloadButton = document.getElementById('download') as HTMLButtonElement | null;
const storedListEl = document.getElementById('stored');
const storedCountEl = document.getElementById('storedCount');

const generateIconEl = document.getElementById('generateIcon');
const resetIconEl = document.getElementById('resetIcon');
const flushIconEl = document.getElementById('flushIcon');
const audioIconEl = document.getElementById('audioIcon');
const downloadIconEl = document.getElementById('downloadIcon');

function mountIcon(container: HTMLElement | null, node: Element) {
  if (!container) return;
  container.innerHTML = '';
  container.appendChild(node);
}

function renderIcon(
  icon: Parameters<typeof createElement>[0],
  attrs: { size?: number; class?: string } = {}
) {
  return createElement(icon, attrs);
}

mountIcon(generateIconEl, renderIcon(Sparkles, { size: 18 }));
mountIcon(resetIconEl, renderIcon(RefreshCcw, { size: 16 }));
mountIcon(flushIconEl, renderIcon(RefreshCcw, { size: 16 }));
mountIcon(audioIconEl, renderIcon(Volume2, { size: 16 }));
mountIcon(downloadIconEl, renderIcon(Download, { size: 16 }));

type StatusState =
  | { type: 'idle' }
  | { type: 'downloading'; progress?: number }
  | { type: 'generating' }
  | { type: 'ready' }
  | { type: 'error'; message: string }
  | { type: 'preparing'; detail: string };
type RenderState = 'idle' | 'ready' | 'error' | 'generating';

const languageButtons = Array.from(
  document.querySelectorAll<HTMLButtonElement>('.lang-option')
);
let currentLanguage: Language = 'eu';
let generateState: 'idle' | 'downloading' | 'generating' = 'idle';
let renderState: RenderState = 'idle';
let statusState: StatusState = { type: 'idle' };
let audioUrl: string | null = null;
let isGenerating = false;
let isDownloading = false;

function normalizeLanguage(value: string): Language | null {
  const normalized = value.toLowerCase();
  for (const language of SUPPORTED_LANGUAGES) {
    if (normalized === language || normalized.startsWith(`${language}-`)) {
      return language;
    }
  }
  return null;
}

function detectLanguage(): Language {
  try {
    const stored = localStorage.getItem(STORAGE_LANGUAGE_KEY);
    if (stored) {
      const normalized = normalizeLanguage(stored);
      if (normalized) return normalized;
    }
  } catch {
    // Ignore storage errors.
  }

  const browserLanguages =
    typeof navigator !== 'undefined' && Array.isArray(navigator.languages) && navigator.languages.length
      ? navigator.languages
      : [navigator.language];

  for (const language of browserLanguages) {
    const normalized = normalizeLanguage(language);
    if (normalized) return normalized;
  }

  return 'eu';
}

function updateCharCount() {
  if (!promptEl || !charCountEl) return;
  const value = promptEl.value.trim();
  charCountEl.textContent = translations[currentLanguage].charCount(value.length);
}

function setStatusText(label: string, detail: string) {
  if (statusLabelEl) statusLabelEl.textContent = label;
  if (statusDetailEl) statusDetailEl.textContent = detail;
}

function setProgress(value: number) {
  if (!progressBarEl) return;
  const normalized = Math.max(0, Math.min(100, value));
  progressBarEl.style.width = `${normalized}%`;
}

function setButtonsDisabled(disabled: boolean) {
  if (generateButton) generateButton.disabled = disabled;
  if (promptEl) promptEl.disabled = disabled;
}

function applyGenerateState() {
  const t = translations[currentLanguage];
  if (!generateLabel || !generateIconEl) return;

  if (generateState === 'downloading') {
    generateLabel.textContent = t.downloadingLabel;
    mountIcon(generateIconEl, renderIcon(Loader2, { size: 18, class: 'animate-spin' }));
    return;
  }

  if (generateState === 'generating') {
    generateLabel.textContent = t.generatingLabel;
    mountIcon(generateIconEl, renderIcon(Loader2, { size: 18, class: 'animate-spin' }));
    return;
  }

  generateLabel.textContent = t.generate;
  mountIcon(generateIconEl, renderIcon(Sparkles, { size: 18 }));
}

function applyStatus() {
  const t = translations[currentLanguage];
  if (statusState.type === 'downloading') {
    const detail =
      typeof statusState.progress === 'number'
        ? t.progressComplete(statusState.progress)
        : t.statusDownloadingDetail;
    setStatusText(t.statusDownloading, detail);
    return;
  }

  if (statusState.type === 'generating') {
    setStatusText(t.statusGenerating, t.statusGeneratingDetail);
    return;
  }

  if (statusState.type === 'ready') {
    setStatusText(t.statusReadyLabel, t.statusReadyDetail);
    return;
  }

  if (statusState.type === 'error') {
    const detail = statusState.message || t.unknownError;
    setStatusText(t.statusError, detail);
    return;
  }

  if (statusState.type === 'preparing') {
    setStatusText(t.statusPreparing, statusState.detail);
    return;
  }

  setStatusText(t.statusIdle, t.statusReady);
}

function setStatusState(nextState: StatusState) {
  statusState = nextState;
  applyStatus();
}

function setGenerateState(state: 'idle' | 'downloading' | 'generating') {
  generateState = state;
  isDownloading = state === 'downloading';
  isGenerating = state === 'generating';
  const disabled = state !== 'idle';
  setButtonsDisabled(disabled);

  if (state === 'downloading') {
    setStatusState({ type: 'downloading' });
  } else if (state === 'generating') {
    setStatusState({ type: 'generating' });
  } else {
    setStatusState({ type: 'idle' });
  }

  applyGenerateState();
}

function applyRenderState() {
  if (!renderStateEl) return;
  const t = translations[currentLanguage];
  if (renderState === 'ready') {
    renderStateEl.textContent = t.renderReady;
  } else if (renderState === 'error') {
    renderStateEl.textContent = t.renderError;
  } else if (renderState === 'generating') {
    renderStateEl.textContent = t.generatingLabel;
  } else {
    renderStateEl.textContent = t.renderNone;
  }
  renderStateEl.className = 'rounded-full border px-3 py-1 text-xs';
  if (renderState === 'ready') {
    renderStateEl.className += ' border-violet-300/40 bg-violet-500/20 text-violet-100';
  } else if (renderState === 'error') {
    renderStateEl.className += ' border-blush-500/40 bg-blush-500/20 text-blush-200';
  } else {
    renderStateEl.className += ' border-white/10 bg-white/5 text-white/60';
  }
}

function setRenderState(state: RenderState) {
  renderState = state;
  applyRenderState();
}

function setAudio(blob: Blob) {
  if (!playerEl) return;
  if (audioUrl) {
    URL.revokeObjectURL(audioUrl);
  }
  audioUrl = URL.createObjectURL(blob);
  playerEl.src = audioUrl;
  playerEl.load();
  downloadButton?.removeAttribute('disabled');
  setRenderState('ready');
}

function handleError(message: string) {
  setGenerateState('idle');
  setProgress(0);
  setStatusState({ type: 'error', message });
  setRenderState('error');
}

function updateStoredList(voices: string[]) {
  if (!storedListEl) return;
  storedListEl.innerHTML = '';
  for (const voice of voices) {
    const item = document.createElement('li');
    item.className = 'rounded-2xl border border-white/5 bg-white/5 px-3 py-2';
    item.textContent = voice;
    storedListEl.appendChild(item);
  }
  if (storedCountEl) storedCountEl.textContent = `${voices.length}`;
}

function parseProgressMessage(message: string) {
  try {
    const data = JSON.parse(message) as { loaded?: number; total?: number };
    if (typeof data.loaded === 'number' && typeof data.total === 'number') {
      const pct = data.total === 0 ? 0 : (data.loaded / data.total) * 100;
      setGenerateState('downloading');
      setProgress(pct);
      setStatusState({ type: 'downloading', progress: pct });
      return true;
    }
  } catch {
    return false;
  }
  return false;
}

function applyTranslations() {
  const t = translations[currentLanguage];
  document.querySelectorAll<HTMLElement>('[data-i18n]').forEach((element) => {
    const key = element.dataset.i18n as keyof typeof t;
    const value = t[key];
    if (typeof value === 'string') {
      element.textContent = value;
    }
  });

  document.querySelectorAll<HTMLElement>('[data-i18n-aria]').forEach((element) => {
    const key = element.dataset.i18nAria as keyof typeof t;
    const value = t[key];
    if (typeof value === 'string') {
      element.setAttribute('aria-label', value);
    }
  });

  document.title = t.title;
}

function updateLanguageToggle() {
  languageButtons.forEach((button) => {
    const lang = button.dataset.lang as Language | undefined;
    if (!lang) return;
    button.textContent = LANGUAGE_LABELS[lang];
    const isActive = lang === currentLanguage;
    button.classList.toggle('is-active', isActive);
    button.setAttribute('aria-pressed', isActive ? 'true' : 'false');
  });
}

function setLanguage(language: Language, persist = true) {
  currentLanguage = language;
  if (persist) {
    try {
      localStorage.setItem(STORAGE_LANGUAGE_KEY, language);
    } catch {
      // Ignore storage errors.
    }
  }
  document.documentElement.lang = language;
  applyTranslations();
  updateLanguageToggle();
  applyGenerateState();
  applyStatus();
  applyRenderState();
  updateCharCount();
}

function setPromptToDefault() {
  if (!promptEl) return;
  promptEl.value = DEFAULT_TEXTS[currentLanguage];
  updateCharCount();
}

currentLanguage = detectLanguage();
setLanguage(currentLanguage, false);
setPromptToDefault();

updateCharCount();

promptEl?.addEventListener('input', updateCharCount);

document.getElementById('reset')?.addEventListener('click', () => {
  setPromptToDefault();
});

document.getElementById('flush')?.addEventListener('click', () => {
  worker.postMessage({ type: 'flush' });
  setTimeout(() => { window.location.reload() }, 2_000);
});

downloadButton?.addEventListener('click', () => {
  if (!audioUrl) return;
  const anchor = document.createElement('a');
  anchor.href = audioUrl;
  anchor.download = 'maider-output.wav';
  anchor.click();
});

generateButton?.addEventListener('click', () => {
  if (!promptEl) return;
  const text = promptEl.value.trim();
  if (!text) return;
  setGenerateState(isDownloading ? 'downloading' : 'generating');
  setRenderState('generating');
  worker.postMessage({
    type: 'init',
    text,
    voiceId: VOICE_ID,
  });
});

worker.postMessage({ type: 'stored' });
worker.addEventListener('message', (event: MessageEvent) => {
  if (typeof event.data === 'string') {
    if (parseProgressMessage(event.data)) return;
  }

  const payload = event.data as { type?: string; audio?: Blob; message?: string; voiceIds?: string[] };

  if (payload?.type === 'stored' && Array.isArray(payload.voiceIds)) {
    updateStoredList(payload.voiceIds);
    return;
  }

  if (payload?.type === 'error') {
    handleError(payload.message || translations[currentLanguage].unknownError);
    return;
  }

  if (payload?.type === 'result' && payload.audio instanceof Blob) {
    setGenerateState('idle');
    setProgress(100);
    setStatusState({ type: 'ready' });
    setAudio(payload.audio);
    return;
  }

  if (typeof event.data === 'string') {
    if (event.data.includes('Reusing session') || event.data.includes('New session')) {
      setStatusState({ type: 'preparing', detail: event.data });
    }
  }
});

languageButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const language = button.dataset.lang as Language | undefined;
    if (!language || language === currentLanguage) return;
    setLanguage(language);
  });
});
