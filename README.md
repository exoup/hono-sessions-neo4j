# hono-sessions-neo4j
Neo4j session store-connector for [hono-sessions](https://github.com/jcs224/hono_sessions).

## Installation
```sh
npm i hono-sessions-neo4j
```

## Usage
```ts
import { Hono } from "hono";
import { sessionMiddleware } from "hono-sessions";
import { Neo4jStore } from "hono-sessions-neo4j";

// ...
// Create your Neo4j Driver instance
// ...

const SessionStore = new Neo4jStore({
    driver: driver, // Required
    sessionLabel: 'Session', //Optional
    QueryConfig: QueryConfig //Optional
});

const app = new Hono();
app.use(sessionMiddleware({
    store: SessionStore
    // ... other session options
}));
```

### Options
* `driver` (Required): Neo4j Driver instance
* `sessionLabel` (Optional): Sets the node label to use in Neo4j.
* `QueryConfig` (Optional): QueryConfig object passed to driver.executeQuery. As documented in [Neo4j docs](https://neo4j.com/docs/api/javascript-driver/current/class/lib6/driver.js~QueryConfig.html)



## Dependency
[neo4j-driver](https://github.com/neo4j/neo4j-javascript-driver)  >= 5.8.0
