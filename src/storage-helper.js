/*global browser*/

export function get(keys) {
    return new Promise((resolve, reject) => {
        browser.storage.sync.get(keys, (data) => {
            if (browser.runtime.lastError) {
                reject(browser.runtime.lastError);
            }
            resolve(data);
        });
    });
}

export function save(obj) {
    return new Promise((resolve, reject) => {
        browser.storage.sync.set(obj, () => {
            if (browser.runtime.lastError) {
                reject(browser.runtime.lastError);
            }
            resolve(obj);
        });
    });
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
