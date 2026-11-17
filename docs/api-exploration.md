# Lab 12 – Manual API Exploration (Node.js GradeBook)

**Base URL:** `http://localhost:3000`  
**Start:** `npm start`  
**Content type:** JSON (`application/json`)

The original practical is written for LibraryHub. This repository is a Student GradeBook application, so the same API-testing learning outcomes are applied to student registration, scores, search, and grade calculation. No separate LibraryHub domain has been introduced.

## API contract (six endpoints)

| Method | Endpoint | Request | Success response | Important errors |
|---|---|---|---|---|
| POST | `/students` | `{name, rollNo, scores}` | 201 student JSON | 400 invalid data/duplicate rollNo; 415 wrong media type |
| GET | `/students` | none | 200 array of students | — |
| GET | `/students/:rollNo` | none | 200 student JSON | 404 unknown student |
| GET | `/students/search?name=...` | name query | 200 student JSON | 400 missing query; 404 no match |
| POST | `/students/:rollNo/scores` | `{score}` | 200 updated student JSON | 400 invalid score/score limit; 404 unknown student; 415 wrong media type |
| GET | `/students/:rollNo/grade` | none | 200 `{rollNo, average, grade}` | 404 unknown student |

Student JSON has exactly `name`, `rollNo`, `scores`, `average`, and `grade`. Scores must be numeric values from 0 through 100. A roster entry must have 1–6 scores. Roll numbers must be positive integers and unique.

## Manual exploration requests and representative responses

Use a fresh server process for a clean in-memory store. The following examples are ready for Postman or curl. They document expected responses; capture your own Postman screenshots for submission if the instructor requires evidence.

### 1. Register a student – positive
```http
POST /students
Content-Type: application/json

{"name":"Talha Irfan","rollNo":501,"scores":[85,90,78]}
```
Expected: **201 Created**, JSON:
```json
{"name":"Talha Irfan","rollNo":501,"scores":[85,90,78],"average":84.33333333333333,"grade":"B"}
```

### 2. List students – positive
```http
GET /students
```
Expected: **200 OK**, JSON array containing the student created above.

### 3. Retrieve by roll number – positive
```http
GET /students/501
```
Expected: **200 OK**, the student representation shown in request 1.

### 4. Search by name – positive
```http
GET /students/search?name=talha%20irfan
```
Expected: **200 OK**, matching student JSON (case-insensitive lookup).

### 5. Add score – positive
```http
POST /students/501/scores
Content-Type: application/json

{"score":95}
```
Expected: **200 OK**, updated student JSON with scores `[85,90,78,95]`, recalculated average and grade.

### 6. Get grade – positive
```http
GET /students/501/grade
```
Expected: **200 OK**:
```json
{"rollNo":501,"average":87,"grade":"B"}
```

### Negative exploration
| Case | Request | Expected |
|---|---|---|
| Unknown student | `GET /students/999` | 404 and `{"error":"Student not found"}` |
| Missing name | `POST /students` with `{"rollNo":502,"scores":[80]}` | 400 and name validation error |
| Wrong type | `POST /students` with `{"name":"Ali","rollNo":"502","scores":[80]}` | 400 positive-integer error |
| Duplicate roll number | Repeat registration using rollNo 501 | 400 duplicate error |
| Unsupported media type | POST JSON body with `Content-Type: text/plain` | 415 |
| Malformed JSON | POST `{bad` with JSON content type | 400 malformed JSON |
| Missing search query | `GET /students/search` | 400 query-required error |
| Invalid score | `POST /students/501/scores` with `{"score":101}` | 400 score-range error |
| Unknown student score | `POST /students/999/scores` with `{"score":80}` | 404 |

## Boundary exploration

- Score lower boundary: 0 is valid; -1 is invalid.
- Score upper boundary: 100 is valid; 101 is invalid.
- Number of scores: 1 and 6 are valid; 0 and 7 are invalid at registration.
- Name length: 1 and 50 characters are valid when containing at least one letter; 51 is invalid.
- Roll number: positive integer is valid; 0, negative, decimal, string and null are invalid.

## Test isolation and observation

Jest creates a fresh API instance and ephemeral local HTTP port before each test, then closes it afterwards. Manual requests share the running server's in-memory state. Error responses use a JSON object with an `error` field.
