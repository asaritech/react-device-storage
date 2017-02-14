'use strict';

var cookie = require('cookie');
var lsExists = 'localStorage' in global;
var ssExists = 'sessionStorage' in global;

var keyPrefix = 'rds_react';

var vCookies = 1;
var vLocalStorage = 2;
var vSessionStorage = 3;

var raw = {};

function checkStorageVersion(v) {
  if (!v) {
    throw new Error('No storage version.');
  }
}

function DeviceStorage(o) {
  if (typeof o !== 'object') {
    o = {};
  }

  if (!(o.cookieFallback === true || o.cookieFallback === false)) {
    o.cookieFallback = true;
  }

  var cookie = {};

  if (typeof o.cookie === 'object') {
    if (typeof o.cookie.path === 'string') {
      cookie.path = o.cookie.path;
    } else {
      cookie.path = '/';
    }

    if (typeof o.cookie.maxAge === 'number') {
      cookie.maxAge = o.cookie.maxAge;
    } else {
      cookie.maxAge = 2592000; // 30 days
    }

    if (typeof o.cookie.domain === 'string') {
      cookie.domain = o.cookie.domain;
    }

    if (typeof o.cookie.secure === 'boolean') {
      cookie.secure = o.cookie.secure;
    }
  }

  this.o = o;
  this.o.cookie = cookie;
  this.v = 0;
  this.ls;
  this.ss;
}

DeviceStorage.prototype._storageVersion = function (v) {
  var testKey = [keyPrefix + 'test', 'test'].join('_');
  var errorMsg = 'Required storage version is not supported. You can enable cookieFallback.';

  try {
    if (process.browser) {
      if ((v === vLocalStorage && !lsExists) || (v === vSessionStorage && !ssExists)) {
        throw new Error(errorMsg);
      }

      if (v === vLocalStorage) {
        this.ls = global.localStorage;
        this.ls.setItem(testKey, 1);
        this.ls.removeItem(testKey);
      }

      if (v === vSessionStorage) {
        this.ss = global.sessionStorage;
        this.ss.setItem(testKey, 1);
        this.ss.removeItem(testKey);
      }
    } else {
      console.log('The package runs out of browser - simulation enabled.');
    }
  } catch (e) {
    if (this.o.cookieFallback) {
      v = vCookies;
    } else {
      throw new Error(errorMsg);
    }
  }

  return v;
}

DeviceStorage.prototype.cookies = function () {
  this.v = this._storageVersion(vCookies);
  return this;
};

DeviceStorage.prototype.localStorage = function () {
  this.v = this._storageVersion(vLocalStorage);
  return this;
};

DeviceStorage.prototype.sessionStorage = function () {
  this.v = this._storageVersion(vSessionStorage);
  return this;
};

DeviceStorage.prototype.save = function (key, value) {
  checkStorageVersion(this.v);
  var storageKey = [keyPrefix, key].join('_');
  var storageValue = JSON.stringify(value);

  if (process.browser) {
    try {
      switch (this.v) {
        case vLocalStorage:
          this.ls.setItem(storageKey, storageValue);
          break;
        case vSessionStorage:
          this.ss.setItem(storageKey, storageValue);
          break;
        case vCookies:
          document.cookie = cookie.serialize(storageKey, storageValue, this.o.cookie);
          break;
      }
    } catch (e) {
      throw new Error('Unable to save data.');
    }
  } else {
    raw[storageKey] = storageValue;
  }
}

DeviceStorage.prototype.read = function (key) {
  checkStorageVersion(this.v);
  var storageKey = [keyPrefix, key].join('_');
  var value, storageValue;
  var cookies;

  if (process.browser) {
    try {
      switch (this.v) {
        case vLocalStorage:
          storageValue = this.ls.getItem(storageKey);
          break;
        case vSessionStorage:
          storageValue = this.ss.getItem(storageKey);
          break;
        case vCookies:
          cookies = cookie.parse(document.cookie);
          storageValue = cookies && cookies[storageKey];
          break;
      }
    } catch (e) {
      throw new Error('Unable to read data.');
    }
  } else if ('storageKey' in raw) {
    storageValue = raw[storageKey];
  }

  if (storageValue) {
    try {
      value = JSON.parse(storageValue);
    } catch (e) {
      throw new Error('Unable to parse data.');
    }
  }

  return value;
}

DeviceStorage.prototype.delete = function (key) {
  checkStorageVersion(this.v);
  var storageKey = [keyPrefix, key].join('_');
  var cookieOptions = {};

  if (process.browser) {
    try {
      switch (this.v) {
        case vLocalStorage:
          this.ls.removeItem(storageKey);
          break;
        case vSessionStorage:
          this.ss.removeItem(storageKey);
          break;
        case vCookies:
          cookieOptions = this.o.cookie;
          cookieOptions.maxAge = 0;
          cookieOptions.expires = new Date(1970, 1, 1, 0, 0, 1);
          document.cookie = cookie.serialize(storageKey, '', cookieOptions);
          break;
      }
    } catch (e) {
      throw new Error('Unable to delete data.');
    }
  } else if ('storageKey' in raw) {
    delete raw[storageKey];
  }
}

module.exports = DeviceStorage;
