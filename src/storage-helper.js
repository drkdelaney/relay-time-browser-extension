import browser from 'webextension-polyfill';

export function get(keys) {
    return browser.storage.sync.get(keys);
}

export function save(obj) {
    return browser.storage.sync.set(obj);
}

export function update(key, callback) {
    return get(key)
        .then(callback)
        .then(updatedData => save({[key]: updatedData}));
}

export function updateAll(keys, callback) {
    return get(keys)
        .then(callback)
        .then(updatedData => save(updatedData));
}
