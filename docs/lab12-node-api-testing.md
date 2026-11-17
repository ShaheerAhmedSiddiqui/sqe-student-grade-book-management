# Lab 12 – API Testing (Node.js adaptation)

## Objective
Apply the Lab 12 API-testing workflow to the existing Student GradeBook Management project. The supplied practical uses Java/Spring Boot/REST Assured and a LibraryHub domain. This implementation preserves the testing outcomes while using the repository's Node.js domain, built-in HTTP server and Jest.

## Technology mapping
| Lab technology/concept | Existing project equivalent |
|---|---|
| Spring Boot controller | Node.js `node:http` server |
| JUnit 5 + REST Assured | Jest HTTP integration tests using Node HTTP client |
| Random-port application tests | Jest starts server on an ephemeral port |
| Before-each state reset | New GradeBook/Roster instance per test |
| JSON Schema validator | Ajv JSON Schema validation |
| curl/Postman exploration | `docs/api-exploration.md` |

## Task 1 – API surface
Six endpoints are implemented:
1. POST `/students`
2. GET `/students`
3. GET `/students/:rollNo`
4. GET `/students/search?name=...`
5. POST `/students/:rollNo/scores`
6. GET `/students/:rollNo/grade`

The endpoint contract uses 201 for student creation, 200 for successful reads/score addition, 400 for invalid input, 404 for unknown records, and 415 for unsupported media types. Student representations have a stable JSON shape.

## Task 2 – Manual exploration
All six endpoints and representative invalid requests are documented in `docs/api-exploration.md`. Manual examples are expected responses; the student should run them in Postman/curl and attach actual screenshots if required by the instructor.

## Task 3 – Positive tests
The API test suite contains one positive test for each of the six endpoints. Each checks HTTP status and JSON content type, response shape, and meaningful response values.

## Task 4 – Negative and boundary tests
The tests cover:
- Equivalence partitioning: missing name, invalid roll number types, unknown records, missing search parameter.
- Boundary value analysis: score values -1, 0, 1, 99, 100, 101; score-count boundaries 0, 1, 6, 7; maximum six scores.
- Conflict: duplicate roll number.
- Robustness: malformed JSON and unsupported media type.
- State-dependent validation: adding a score to an unknown student.

## Task 5 – Schema and contract assertions
`src/test/resources/schemas/student.schema.json` specifies required properties, types, numeric bounds, score-count limits, grade enum and rejects additional properties. The API test compiles and applies the schema using Ajv to the actual POST response. A response-time smoke test asserts GET /students completes in less than 1000 ms. Shared machines can be noisy, so this threshold is deliberately generous and is not a performance benchmark.

## Defect report and correction
The existing name validator accepted whitespace-only and hyphen-only strings because its regular expression allowed spaces/hyphens without requiring a letter. This defect was reproduced by existing unit tests and API-level negative cases. The validator now additionally requires at least one ASCII letter. The schema also requires a name containing a letter. See the linked GitHub issue for reproduction, expected/actual behavior and severity.

## Run locally
```powershell
npm install
npm test
npm start
```
Default API URL: `http://localhost:3000`.

## Test execution record
The user's earlier run on the initial API implementation reported 78 passing tests and 4 failing name-validation tests. Those four failures exposed the whitespace/hyphen-only name defect. After this branch is pulled, run `npm install` and `npm test` again and replace this historical note with the final local Jest summary. Do not claim a final all-green run until it has been executed.

## GitHub workflow
Implementation is developed on `feature/lab12-complete`. A defect issue is linked in the completion pull request. The original PR #36 is already merged and represents the earlier partial API implementation; this branch completes and corrects it in a follow-up PR.
