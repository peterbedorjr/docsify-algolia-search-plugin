export function isString(value) {
    return typeof value === 'string' || value instanceof String;
}

export function isNumber(value) {
    return typeof value === 'number' && isFinite(value);
}

export function isArray(value) {
    return Array.isArray(value);
}

export function isFunction (value) {
    return typeof value === 'function';
}

export function isObject(value) {
    return value && typeof value === 'object' && value.constructor === Object;
}
