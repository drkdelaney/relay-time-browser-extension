import browser from 'webextension-polyfill';

export function get(keys) {
    return browser.storage.sync.get(keys);
}

export function save(obj) {
    return browser.storage.sync.set(obj);
}

export function update(key, callback) {
    return new Promise((resolve, reject) => {
        return get(key)
            .then(callback)
            .then(async updatedData => {
                const data = { [key]: updatedData };
                await save(data);
                resolve(data);
            })
            .catch(reject);
    });
}
