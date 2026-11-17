# Lab 12 – API Exploration (Node.js GradeBook)

Base URL: `http://localhost:3000`

The Java lab's LibraryHub endpoints are adapted to the Student GradeBook domain. The API uses Node's HTTP server and returns JSON. Start it with `npm start`.

## Endpoint contract

| Method | Path | Request | Success | Error cases |
|---|---|---|---|---|
| POST | `/students` | JSON `{ "name": "Shaheer Ahmed", "rollNo": 101, "scores": [85,90,78] }` | 201 and student representation | 400 invalid/missing name, invalid roll number, invalid score list/score, duplicate roll number; 415 unsupported content type |
| GET | `/students` | none | 200 and student array | none |
| GET | `/students/{rollNo}` | none | 200 and student representation | 404 unknown roll number |
| GET | `/students/search?name=...` | name query | 200 and student representation | 400 missing name; 404 no matching student |
| GET | `/health` | none | 200 `{ "status": "ok" }` | none |

A student response contains exactly `name`, `rollNo`, `scores`, `average`, and `grade`. Errors use `{ "error": "message" }`.

## Manual request/response checks

Run these requests in order after starting the server. Responses below show representative expected bodies; the list endpoint reflects the data inserted in the current process.

### 1. Create a student

```http
POST /students
Content-Type: application/json

{"name":"Shaheer Ahmed","rollNo":101,"scores":[85,90,78]}
```

Expected: `201 Created`, JSON with name `Shaheer Ahmed`, rollNo `101`, scores `[85,90,78]`, average `84.33333333333333`, grade `B`.

### 2. List students

```http
GET /students
```

Expected: `200 OK`, JSON array containing the created student.

### 3. Get one student

```http
GET /students/101
```

Expected: `200 OK`, student JSON.

### 4. Search by name

```http
GET /students/search?name=shaheer%20ahmed
```

Expected: `200 OK`; search is case-insensitive.

### 5. Unknown student

```http
GET /students/999
```

Expected: `404 Not Found`, `{ "error": "Student not found" }`.

### 6. Missing field (invalid request)

```http
POST /students
Content-Type: application/json

{"rollNo":102,"scores":[80]}
```

Expected: `400 Bad Request` and an error mentioning the name.

### 7. Wrong media type

```http
POST /students
Content-Type: text/plain

{"name":"Ali","rollNo":103,"scores":[80]}
```

Expected: `415 Unsupported Media Type` and an error object.

### 8. Score lower boundary

```http
POST /students
Content-Type: application/json

{"name":"Boundary Student","rollNo":104,"scores":[0]}
```

Expected: `201 Created`; a score of 0 is valid. A score of -1 or 101 must return `400`.

## Test-state note

Each Jest API test starts with a fresh in-memory API instance, so tests do not depend on insertion order or on a manually running server.
