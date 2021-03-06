import forEach from 'lodash/forEach';
import errMerge from './errMerge';

export default class Err extends Error {
  constructor(...params) {
    const err = errMerge(...params);
    super(err.message || err.code || 'err_unknown');
    forEach(err, (val, key) => {
      if (key === 'message') {
        this[`_${key}`] = val;
      } else {
        this[key] = val;
      }
    });
  }
}
