const fs = require('fs');
const vm = require('vm');

const html = fs.readFileSync('index.html', 'utf8');

class ClassList {
  constructor() {
    this.items = new Set();
  }

  toggle(name, force) {
    const shouldHave = force === undefined ? !this.items.has(name) : Boolean(force);
    if (shouldHave) this.items.add(name);
    else this.items.delete(name);
  }
}

class Element {
  constructor(id = '', tag = 'div') {
    this.id = id;
    this.tagName = tag.toUpperCase();
    this.hidden = false;
    this.checked = false;
    this.textContent = '';
    this.innerHTML = '';
    this.className = '';
    this.dataset = {};
    this.listeners = {};
    this.width = id === 'hockey-smash-legacy-canvas' ? 720 : 1;
    this.height = id === 'hockey-smash-legacy-canvas' ? 420 : 1;
    this.classList = new ClassList();
    this.style = {
      setProperty: (key, value) => {
        this.style[key] = value;
      },
    };
  }

  addEventListener(type, callback) {
    this.listeners[type] = callback;
  }

  focus() {}

  getContext() {
    return makeCanvasContext();
  }
}

function makeCanvasContext() {
  const gradient = { addColorStop() {} };
  return new Proxy({}, {
    get(target, property) {
      if (property === 'createLinearGradient' || property === 'createRadialGradient') return () => gradient;
      if (property === 'measureText') return () => ({ width: 20 });
      if (property === 'getImageData') return () => ({ data: new Uint8ClampedArray(4) });
      if (property === 'createImageData') return () => ({ data: new Uint8ClampedArray(4) });
      if (property === 'canvas') return { width: 720, height: 420 };
      return target[property] || (() => {});
    },
    set(target, property, value) {
      target[property] = value;
      return true;
    },
  });
}

function runComputerMode(search) {
  const elements = new Map();
  for (const match of html.matchAll(/id="([^"]+)"/g)) {
    elements.set(match[1], new Element(match[1]));
  }

  ['hockey-smash-legacy-play', 'hockey-smash-legacy-summary', 'hockey-smash-legacy-computer', 'hockey-smash-legacy-help-overlay'].forEach((id) => {
    if (elements.has(id)) elements.get(id).hidden = true;
  });

  const actionButtons = [...html.matchAll(/data-action="([^"]+)"/g)].map((match, index) => {
    const element = new Element(`action-${index}`, 'button');
    element.dataset.action = match[1];
    return element;
  });

  const debugButtons = [...html.matchAll(/data-debug-action="([^"]+)"/g)].map((match, index) => {
    const element = new Element(`debug-${index}`, 'button');
    element.dataset.debugAction = match[1];
    return element;
  });

  const storage = new Map();
  const timers = [];
  const document = {
    body: new Element('body', 'body'),
    getElementById: (id) => elements.get(id) || null,
    createElement: (tag) => new Element('', tag),
    querySelectorAll: (selector) => {
      if (selector === '[data-action]') return actionButtons;
      if (selector === '[data-debug-action]') return debugButtons;
      return [];
    },
    addEventListener() {},
  };

  function ImageStub() {
    this.complete = false;
    this.naturalWidth = 0;
    this.addEventListener = () => {};
  }

  const context = {
    window: null,
    document,
    console,
    URLSearchParams,
    Date,
    Math,
    JSON,
    structuredClone: global.structuredClone,
    localStorage: {
      getItem: (key) => (storage.has(key) ? storage.get(key) : null),
      setItem: (key, value) => storage.set(key, String(value)),
      removeItem: (key) => storage.delete(key),
    },
    Image: ImageStub,
    setTimeout: (callback) => {
      timers.push(callback);
      return timers.length;
    },
    clearTimeout: () => {},
  };

  context.window = {
    document,
    location: { search },
    addEventListener() {},
    setTimeout: context.setTimeout,
    clearTimeout: context.clearTimeout,
    localStorage: context.localStorage,
    Image: ImageStub,
    console,
  };
  context.globalThis = context.window;

  vm.createContext(context);
  ['js/games/hockey-smash-data.js', 'js/games/hockey-smash-art.js', 'js/games/hockey-smash.js'].forEach((file) => {
    vm.runInContext(fs.readFileSync(file, 'utf8'), context, { filename: file });
  });

  context.window.RTA_HOCKEY_SMASH_LEGACY.start();
  let guard = 0;
  while (timers.length && guard < 800) {
    timers.shift()();
    guard += 1;
  }

  const report = context.window.RTA_HOCKEY_SMASH_LEGACY.getComputerReport();
  const errors = context.window.RTA_HOCKEY_SMASH_LEGACY.getRuntimeErrors();
  const state = context.window.RTA_HOCKEY_SMASH_LEGACY.getState();

  if (!report.complete || report.failed || errors.length) {
    console.error(JSON.stringify({ search, report, errors, state }, null, 2));
    process.exit(1);
  }

  console.log(`${search}: ${report.passed}/${report.total} checks passed, ending=${state.ending || 'none'}, mode=${report.mode}.`);
}

runComputerMode('?computerMode=1&speed=fast');
runComputerMode('?computerMode=1&speed=fast&debugDeep=1');
