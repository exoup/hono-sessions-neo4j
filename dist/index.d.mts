import { Store, SessionData } from 'hono-sessions';
import { Driver, QueryConfig } from 'neo4j-driver';

interface Neo4jStoreOptions {
    driver: Driver;
    sessionLabel?: string;
    QueryConfig?: QueryConfig;
}
declare class Neo4jStore implements Store {
    driver: Driver;
    sessionLabel?: string;
    config?: QueryConfig;
    constructor(options: Neo4jStoreOptions);
    getSessionById(sessionId?: string): Promise<any>;
    createSession(sessionId: string, initialData: SessionData): Promise<void>;
    deleteSession(sessionId: string): Promise<void>;
    persistSessionData(sessionId: string, sessionData: SessionData): Promise<void>;
}

export { Neo4jStore };
