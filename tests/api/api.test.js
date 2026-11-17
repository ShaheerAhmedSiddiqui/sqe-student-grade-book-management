const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");
const Ajv = require("ajv");
const { createApi } = require("../../src/gradebook/api-server");

let server, baseUrl;
const ajv = new Ajv({ allErrors: true });
const schema = JSON.parse(fs.readFileSync(path.join(__dirname, "../../src/test/resources/schemas/student.schema.json"), "utf8"));
const validateStudent = ajv.compile(schema);

function request(method, route, body, contentType = "application/json") {
  return new Promise((resolve, reject) => {
    const payload = body === undefined ? undefined : JSON.stringify(body);
    const req = http.request(new URL(route, baseUrl), {
      method,
      headers: payload === undefined ? {} : { "Content-Type": contentType, "Content-Length": Buffer.byteLength(payload) }
    }, res => {
      let raw = "";
      res.on("data", chunk => raw += chunk);
      res.on("end", () => {
        let parsed;
        try { parsed = raw ? JSON.parse(raw) : null; } catch { parsed = raw; }
        resolve({ status: res.statusCode, contentType: res.headers["content-type"], body: parsed });
      });
    });
    req.on("error", reject);
    if (payload !== undefined) req.write(payload);
    req.end();
  });
}
const student = (rollNo = 501, scores = [85, 90, 78]) => ({ name: "Talha Irfan", rollNo, scores });
async function createStudent(rollNo = 501, scores = [85, 90, 78]) {
  return request("POST", "/students", student(rollNo, scores));
}
function expectJson(response, status) {
  expect(response.status).toBe(status);
  expect(response.contentType).toContain("application/json");
}

beforeEach(async () => {
  ({ server } = createApi());
  await new Promise(resolve => server.listen(0, "127.0.0.1", resolve));
  baseUrl = `http://127.0.0.1:${server.address().port}`;
});
afterEach(async () => new Promise(resolve => server.close(resolve)));

describe("Task 3 - positive API tests (six endpoints)", () => {
  test("POST /students registers a student", async () => {
    const r = await createStudent();
    expectJson(r, 201);
    expect(r.body).toMatchObject({ name: "Talha Irfan", rollNo: 501, scores: [85, 90, 78], grade: "B" });
    expect(r.body.average).toBeCloseTo(84.333, 2);
  });
  test("GET /students lists registered students", async () => {
    await createStudent();
    const r = await request("GET", "/students");
    expectJson(r, 200);
    expect(r.body).toHaveLength(1);
    expect(r.body[0].rollNo).toBe(501);
  });
  test("GET /students/:rollNo returns a student", async () => {
    await createStudent();
    const r = await request("GET", "/students/501");
    expectJson(r, 200);
    expect(r.body.name).toBe("Talha Irfan");
  });
  test("GET /students/search?name=... finds by name", async () => {
    await createStudent();
    const r = await request("GET", "/students/search?name=talha%20irfan");
    expectJson(r, 200);
    expect(r.body.rollNo).toBe(501);
  });
  test("POST /students/:rollNo/scores adds a valid score", async () => {
    await createStudent();
    const r = await request("POST", "/students/501/scores", { score: 95 });
    expectJson(r, 200);
    expect(r.body.scores).toContain(95);
  });
  test("GET /students/:rollNo/grade returns average and letter grade", async () => {
    await createStudent();
    const r = await request("GET", "/students/501/grade");
    expectJson(r, 200);
    expect(r.body).toEqual({ rollNo: 501, average: 84.33333333333333, grade: "B" });
  });
});

describe("Task 4 - negative and boundary tests", () => {
  test("N1 equivalence partition: unknown roll number returns 404", async () => {
    const r = await request("GET", "/students/999");
    expectJson(r, 404); expect(r.body).toHaveProperty("error");
  });
  test("N2 equivalence partition: missing name is rejected", async () => {
    const r = await request("POST", "/students", { rollNo: 1, scores: [80] });
    expectJson(r, 400); expect(r.body.error).toMatch(/name/i);
  });
  test.each([0, -1, 1.5, "501", null])("N3 invalid roll number %p returns 400", async rollNo => {
    const r = await request("POST", "/students", { ...student(), rollNo });
    expectJson(r, 400);
  });
  test.each([[0, 400], [1, 201], [6, 201], [7, 400]])("N4 BVA score count %i -> %i", async (count, status) => {
    const r = await createStudent(600 + count, Array(count).fill(80));
    expectJson(r, status);
  });
  test("N5 conflict: duplicate roll number is rejected", async () => {
    await createStudent();
    const r = await createStudent(501, [70]);
    expectJson(r, 400); expect(r.body.error).toMatch(/already exists/i);
  });
  test.each([-1, 0, 1, 99, 100, 101, "90", null])("N6 score boundary/type %p", async score => {
    const r = await createStudent(700 + (typeof score === "number" ? Math.abs(score) : 1), [score]);
    const valid = typeof score === "number" && score >= 0 && score <= 100;
    expectJson(r, valid ? 201 : 400);
  });
  test.each(["   ", "---", " - - ", " "])("N7 whitespace/punctuation-only name %p rejected", async name => {
    const r = await request("POST", "/students", { ...student(), name });
    expectJson(r, 400);
  });
  test("N8 adding score for unknown student returns 404", async () => {
    const r = await request("POST", "/students/999/scores", { score: 80 });
    expectJson(r, 404);
  });
  test("N9 invalid score addition returns 400", async () => {
    await createStudent();
    const r = await request("POST", "/students/501/scores", { score: 101 });
    expectJson(r, 400);
  });
  test("N10 missing search query returns 400", async () => {
    const r = await request("GET", "/students/search");
    expectJson(r, 400);
  });
  test("N11 unsupported media type returns 415", async () => {
    const r = await request("POST", "/students", student(), "text/plain");
    expectJson(r, 415);
  });
  test("N12 malformed JSON returns 400", async () => {
    const r = await new Promise((resolve, reject) => {
      const req = http.request(new URL("/students", baseUrl), { method: "POST", headers: { "Content-Type": "application/json" } }, res => {
        let raw = ""; res.on("data", c => raw += c); res.on("end", () => resolve({ status: res.statusCode, body: JSON.parse(raw) }));
      });
      req.on("error", reject); req.write("{bad"); req.end();
    });
    expect(r.status).toBe(400); expect(r.body).toHaveProperty("error");
  });
  test("N13 adding seventh score is rejected at upper boundary", async () => {
    await createStudent(800, [1, 2, 3, 4, 5, 6]);
    const r = await request("POST", "/students/800/scores", { score: 7 });
    expectJson(r, 400);
  });
});

describe("Task 5 - schema contract and performance", () => {
  test("student response validates against the complete JSON schema", async () => {
    const r = await createStudent();
    expectJson(r, 201);
    expect(validateStudent(r.body)).toBe(true);
  });
  test("GET /students responds in less than 1000 ms", async () => {
    const start = Date.now();
    const r = await request("GET", "/students");
    expectJson(r, 200);
    // Shared CI machines are variable; this is a generous responsiveness smoke limit, not a benchmark.
    expect(Date.now() - start).toBeLessThan(1000);
  });
});
