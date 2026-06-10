export function getSafeInternalTarget(target) {
    if (
        typeof target !== "string" ||
        !target.startsWith("/") ||
        target.startsWith("//") ||
        target.startsWith("/\\")
    ) {
        return null;
    }

    return target;
}
