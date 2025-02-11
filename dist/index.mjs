var __defProp = Object.defineProperty;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
class Neo4jStore {
  constructor(options) {
    if (!options || !options.driver) {
      throw new Error("An options object must contain a Driver to use the Neo4jStore.");
    }
    this.driver = options.driver;
    this.sessionLabel = options.sessionLabel == null ? "Session" : options.sessionLabel;
    this.config = options.QueryConfig || {};
  }
  async getSessionById(sessionId) {
    if (!sessionId) return null;
    const { records } = await this.driver.executeQuery(
      `MATCH (session:${this.sessionLabel} {id: $sessionId}) RETURN session`,
      { sessionId },
      __spreadValues({
        routing: "READ"
      }, this.config)
    );
    if (records.length > 0) {
      let session = records[0].get("session");
      return JSON.parse(session.properties.data);
    } else {
      return null;
    }
  }
  async createSession(sessionId, initialData) {
    if (!sessionId) return;
    const stringifiedData = JSON.stringify(initialData);
    await this.driver.executeQuery(
      `
            CREATE (session:${this.sessionLabel} {id: $sessionId})
                SET session.data = $initialData
            RETURN session LIMIT 0`,
      { sessionId, initialData: stringifiedData },
      this.config
    );
  }
  async deleteSession(sessionId) {
    if (!sessionId) return;
    await this.driver.executeQuery(
      `MATCH (session:${this.sessionLabel} {id: $sessionId}) DETACH DELETE session`,
      { sessionId },
      this.config
    );
  }
  async persistSessionData(sessionId, sessionData) {
    if (!sessionId) return;
    const stringifiedData = JSON.stringify(sessionData);
    await this.driver.executeQuery(
      `
            MERGE (session:${this.sessionLabel} {id: $sessionId})
            ON CREATE
                SET session.data = $sessionData
            ON MATCH
                SET session.data = $sessionData
            RETURN session LIMIT 0`,
      { sessionId, sessionData: stringifiedData },
      this.config
    );
  }
}

export { Neo4jStore };
