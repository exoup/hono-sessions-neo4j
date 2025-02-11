import { Store, SessionData } from "hono-sessions";
import { Driver, QueryConfig } from 'neo4j-driver';

interface Neo4jStoreOptions {
    driver: Driver;
    sessionLabel?: string;
    QueryConfig?: QueryConfig;
};

export class Neo4jStore implements Store {
    driver: Driver;
    sessionLabel?: string;
    config?: QueryConfig;

    constructor(options: Neo4jStoreOptions) {
        // throw if no options
        if (!options || !options.driver) {
            throw new Error("An options object must contain a Driver to use the Neo4jStore.");
        }

        this.driver = options.driver;
        this.sessionLabel = options.sessionLabel == null ? "Session" : options.sessionLabel;
        this.config = options.QueryConfig || {};
    };

    async getSessionById(sessionId?: string) {
        if (!sessionId) return null;

        const { records } = await this.driver.executeQuery(
            `MATCH (session:${this.sessionLabel} {id: $sessionId}) RETURN session`,
            { sessionId: sessionId },
            {
                routing: 'READ',
                ...this.config
            }
        );

        if (records.length > 0) {
            let session = records[0].get('session');
            return JSON.parse(session.properties.data);
        } else {
            return null;
        }
    };

    async createSession(sessionId: string, initialData: SessionData) {
        if (!sessionId) return;

        const stringifiedData = JSON.stringify(initialData);
        await this.driver.executeQuery(`
            CREATE (session:${this.sessionLabel} {id: $sessionId})
                SET session.data = $initialData
            RETURN session LIMIT 0`,
            { sessionId: sessionId, initialData: stringifiedData },
            this.config
        );
    };

    async deleteSession(sessionId: string) {
        if (!sessionId) return;

        await this.driver.executeQuery(
            `MATCH (session:${this.sessionLabel} {id: $sessionId}) DETACH DELETE session`,
            { sessionId: sessionId },
            this.config
        );
    };

    async persistSessionData(sessionId: string, sessionData: SessionData) {
        if (!sessionId) return;

        const stringifiedData = JSON.stringify(sessionData);
        await this.driver.executeQuery(`
            MERGE (session:${this.sessionLabel} {id: $sessionId})
            ON CREATE
                SET session.data = $sessionData
            ON MATCH
                SET session.data = $sessionData
            RETURN session LIMIT 0`,
            { sessionId: sessionId, sessionData: stringifiedData },
            this.config
        );
    };

};
