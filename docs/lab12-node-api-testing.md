# Lab 12 – API Testing (Node.js Track)

## Objective
Apply the Lab 12 API-testing techniques to the existing Student GradeBook Management project using Node.js, HTTP, and Jest rather than Java, Spring Boot, and REST Assured.

## Technology mapping

| Java lab tool/concept | Node.js project equivalent |
|---|---|
| Spring Boot REST controller | Built-in `node:http` server (`src/gradebook/api-server.js`) |
| REST Assured + JUnit 5 | Jest API tests (`tests/api/api.test.js`) |
| `@BeforeEach` state reset | Fresh API server and in-memory domain state before every test |
| JSON schema contract assertions | Schema definition plus exact response-key/type/value assertions in Jest |
| curl/Postman manual exploration | Documented HTTP requests in `docs/api-exploration.md` |

## Tasks completed in the implementation

1. API surface: create student, list students, get student by roll number, search by name, and health check.
2. Manual exploration: request/response examples cover successful, missing-field, unknown-resource, boundary, and unsupported-media-type cases.
3. Positive API tests: create, list, get, and case-insensitive search.
4. Negative/boundary API tests: unknown student, missing name, invalid roll number, score-count lower/upper boundaries, duplicate roll number, score boundaries and wrong types, invalid name, unsupported media type, malformed JSON.
5. Contract/performance assertions: exact student response fields, JSON content type, a response schema and a generous 1000 ms smoke threshold.

## Run

```bash
npm install
npm test
npm start
```

Server default: `http://localhost:3000`. Override with `PORT=4000 npm start`.

## Notes

The project's existing domain model limits a roster entry to 1–6 scores and each score to 0–100. The API validates request data and reports errors as JSON. This implementation does not change the Java lab's unrelated LibraryHub/book/fine requirements; it adapts the same testing concepts to the existing GradeBook requirements and domain.

## Test isolation

The `createApi()` factory creates fresh `GradeBook` and `Roster` instances. Jest starts and closes a new server in `beforeEach`/`afterEach`, so each test begins with empty in-memory state.
