export function getSafeInternalTarget(target) {
    if (
        typeof target !== "string" ||
        !target.startsWith("/") ||
        target.startsWith("//") ||
        target.startsWith("/\\") ||
        /^\/logout\/?(?:[?#]|$)/.test(target)
    ) {
        return null;
    }

    return target;
}
