class SessionStore {
    sessions = new Set<string>();

    add(session: string) {
        this.sessions.add(session);
    }

    remove(session: string) {
        this.sessions.delete(session);
    }

    has(session: string) {
        return this.sessions.has(session);
    }
}

const sessionStore = new SessionStore();
export default sessionStore;