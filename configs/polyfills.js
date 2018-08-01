require('whatwg-fetch')
Object.assign = require('object-assign')

if (typeof Promise === 'undefined') {
  require('promise/lib/rejection-tracking').enable()
  // eslint-disable-next-line
  window.Promise = require('promise/lib/es6-extensions.js')
}
