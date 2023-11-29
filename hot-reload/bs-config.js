module.exports = {
  proxy: "localhost:8080", // adjust the port if needed
  server: false,
  files: [
    "public/assets/css/**/*.css",
    "public/assets/js/**/*.js",
    "public/**/*.html",
    "app/**/**/*.php",
    "app/**/*.php, app/*.php",
  ], // watch both back-end and front-end files
  ignore: ["node_modules", "package.json"],
  reloadOnRestart: true,
  middleware: false,
  serveStatic: [],
  ghostMode: {
    clicks: true,
    scroll: true,
    forms: {
      submit: true,
      inputs: true,
      toggles: true,
    },
  },
  logLevel: "info",
  logPrefix: "BS",
  logConnections: false,
  logFileChanges: true,
  logSnippet: true,
  rewriteRules: [],
  open: "local",
  browser: "default",
  cors: true,
  xip: false,
  hostnameSuffix: false,
  reloadOnRestart: false,
  notify: true,
  scrollProportionally: true,
  scrollThrottle: 0,
  scrollRestoreTechnique: "window.name",
  scrollElements: [],
  scrollElementMapping: [],
  reloadDelay: 0,
  reloadDebounce: 0,
  reloadThrottle: 0,
  plugins: [],
  injectChanges: true,
  startPath: null,
  minify: true,
  host: null,
  localOnly: false,
  codeSync: true,
  timestamps: true,
  clientEvents: [
    "scroll",
    "scroll:element",
    "input:text",
    "input:toggles",
    "form:submit",
    "form:reset",
    "click",
  ],
  socket: {
    socketIoOptions: {
      log: false,
    },
    socketIoClientConfig: {
      reconnectionAttempts: 50,
    },
    path: "/browser-sync/socket.io",
    clientPath: "/browser-sync",
    namespace: "/browser-sync",
    clients: {
      heartbeatTimeout: 5000,
    },
  },
  tagNames: {
    less: "link",
    scss: "link",
    css: "link",
    jpg: "img",
    jpeg: "img",
    png: "img",
    svg: "img",
    gif: "img",
    js: "script",
  },
};
