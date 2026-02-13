import { useState, useEffect } from "react";

export function useSessionId() {
    const[sessionId, setSessionId] = useState<string | null>(null)
    useEffect(() => {
        let id = localStorage.getItem('session-id')
        if (!id) {
            id = crypto.randomUUID()
            localStorage.setItem('session-id', id)
        }

        setSessionId(id)
    }, []);

    return sessionId;
}