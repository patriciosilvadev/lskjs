import toPairs from 'lodash/toPairs';
import forEach from 'lodash/forEach';
import isFunction from 'lodash/isFunction';
import get from 'lodash/get';
import Promise from 'bluebird';
import logger from '@lskjs/log';
// import PromiseMap from 'bluebird/js/release/map';
import emitter from './emitter';
// import createLoggerMock from './logger/createLoggerMock';
// import config from './config';

function isClass(v) {
  return isFunction(v);// && /^\s*class\s+/.test(v.toString());
}

const DEBUG = true;

export default class Core {
  name = 'Core';
  constructor(params = {}) {
    Object.assign(this, params);
  }

  createLogger(params) {
    return logger.createLogger({
      name: this.name || 'app',
      src: __DEV__,
      level: 'trace',
      ...get(this, 'config.log', {}),
      ...params,
    });
  }

  emit(...args) {
    this.log ? this.log.trace(`${this.name}`, ...args) : console.log(`${this.name}`, ...args);
    if (this.ee) this.ee.emit(...args);
  }
  on(...args) {
    if (this.ee) {
      this.ee.on(args[0], async (...params) => {
        try {
          await args[1](...params);
        } catch (err) {
          this.log.error(`App.on(${args[0]})`, err);
        }
      }, args[2]);
    }
  }

  async beforeInit() {
    if (!this.ee) this.ee = new emitter();
    if (!this.log) this.log = this.createLogger();
    if (this.log) this.ee.on('*', event => this.log.trace(event));
  }

  async init() {
    // if (!this.log) this.log = this.createLogger();
    this.emit('init');
    this.log.trace(`${this.name}.init()`);
    // if (!this.config) this.config = config;
  }

  getModules() {
    return {};
  }

  getModulesSequence() {
    return toPairs(this.modules || {}).map(([k, v]) => ({ name: k, module: v }));
  }

  broadcastModules(method) {
    this.log.trace(`${this.name}.broadcastModules`, method);
    // console.log('this.getModulesSequence()', this.getModulesSequence());

    return Promise.map(this.getModulesSequence(), (pack) => {
      // this.log.trace(`@@@@ module ${pack.name}.${method}()`, typeof pack.module[method], pack.module);
      if (!(pack.module && isFunction(pack.module[method]))) return null;
      // let res;
      try {
        this.log.trace(`module ${pack.name}.${method}()`);
        return pack.module[method]();
      } catch (err) {
        this.log.error(`module ${pack.name}.${method}() ERROR:`, err);
      }
      return null;
    });
  }

  initModules() {
    this._modules = this.getModules();
    // console.log('@@!!', {modules});
    const modules = {};
    forEach(this._modules, (Module, key) => {
      // const Module = module(ctx);
      if (isClass(Module)) {
        modules[key] = new Module(this);
      } else {
        modules[key] = Module;
      }
      if (!modules[key].name || modules[key].name === 'Core') {
        modules[key].name = key;
      }
    });
    this.modules = modules;
    DEBUG && this.log.trace(`${this.name}.modules`, Object.keys(this.modules));
    // this.log.debug('_modules', Object.keys(this._modules));
    return this.broadcastModules('init');
  }

  run() {
    this.emit('run');
  }

  async startOrRestart() {
    if (this.startCount) {
      return this.restart();
    }
    return this.start();
  }

  async restart() {
    this.log.trace(`${this.name}.restart()`);
    await this.stop();
    if (isFunction(this.onRestart)) {
      this.log.trace(`${this.name}.onRestart()`);
      await this.onRestart();
    }
    await this.start();
  }
  startCount = 0;
  async start() {
    try {
      if (isFunction(this.beforeInit)) {
        await this.beforeInit();
      }
      if (isFunction(this.init)) {
        await this.init();
      }
      if (isFunction(this.initModules)) {
        this.log.trace(`${this.name}.initModules()`);
        await this.initModules();
      }
      if (isFunction(this.afterInit)) {
        this.log.trace(`${this.name}.afterInit()`);
        await this.afterInit();
      }
      if (isFunction(this.run)) {
        this.log.trace(`${this.name}.run()`);
        await this.run();
      }
      if (isFunction(this.broadcastModules)) {
        this.log.trace(`${this.name}.broadcastModules('run')`);
        await this.broadcastModules('run');
      }
      if (isFunction(this.afterRun)) {
        this.log.trace(`${this.name}.afterRun()`);
        await this.afterRun();
      }
      if (isFunction(this.started)) {
        this.log.trace(`${this.name}.started()`);
        await this.started();
      }
      if (isFunction(this.onStart)) {
        this.log.trace(`${this.name}.onStart()`);
        await this.onStart();
      }
      this.startCount += 1;
    } catch (err) {
      if (this.log && this.log.fatal) {
        this.log.fatal(`${this.name}.start() err`, err);
      } else {
        console.error(`${this.name}.start() err`, err);
      }
      if (typeof process !== 'undefined' && process.exit) {
        process.exit(1);
      }
      throw err;
    }
    return this;
  }

  async stop() {
    this.emit('stop');
    this.log.trace(`${this.name}.stop()`);
    try {
      if (isFunction(this.broadcastModules)) {
        this.log.trace(`${this.name}.broadcastModules('stop')`);
        await this.broadcastModules('stop');
      }
      if (isFunction(this.onStop)) {
        this.log.trace(`${this.name}.onStop()`);
        await this.onStop();
      }
    } catch (err) {
      if (this.log && this.log.fatal) {
        this.log.fatal(`${this.name}.stop() err`, err);
      } else {
        console.error(`${this.name}.stop() err`, err);
      }
      if (typeof process !== 'undefined' && process.exit) {
        process.exit(1);
      }
      throw err;
    }
    return this;
  }
}