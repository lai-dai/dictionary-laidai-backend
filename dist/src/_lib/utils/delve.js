"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.delve = delve;
/**
 * Gets the property value at path of object. If the resolved value is undefined the defaultValue is used
 * in its place.
 *
 * @param obj The object to query.
 * @param key The path of the property to get.
 * @param def The value returned if the resolved value is undefined.
 * @return Returns the resolved value.
 */
function delve(obj, key, def) {
    if (!obj)
        return def;
    let arr;
    if (typeof key === 'string')
        arr = key.replace(/\[|\]/g, '.').split(/\.+/g);
    else
        arr = key;
    return arr.reduce((o, k) => o === null || o === void 0 ? void 0 : o[k], obj) || def;
}
