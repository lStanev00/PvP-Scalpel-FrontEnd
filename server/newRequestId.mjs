import { randomUUID } from "crypto";

export function newRequestId() {
    try {
        return randomUUID();
    } catch {
        return `${Date.now().toString(36)}-${Math.random()
            .toString(36)
            .slice(2, 10)}`;
    }
}
