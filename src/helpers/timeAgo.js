export default function timeAgo(updatedAt) {
    const updatedTime = new Date(updatedAt).getTime();
    const now = Date.now();
    const diff = now - updatedTime;
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return false;
    if (hours > 0) return `${hours} hour(s) ago`;
    if (minutes > 0) return `${minutes} minute(s) ago`;
    if (seconds < 2 ) return "Just Now"
    return `${seconds} second(s) ago`;
}

export function isOlderThan5Minutes(updatedAt) {
    const updatedTime = new Date(updatedAt).getTime();
    const now = Date.now();
    const diff = now - updatedTime;
    return diff >= 5 * 60 * 1000;
}
