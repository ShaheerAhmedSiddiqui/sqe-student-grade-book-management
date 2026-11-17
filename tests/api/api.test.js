const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");
const { createApi } = require("../../src/gradebook/api-server");

let server;
let baseUrl;

function request(method, path, body, contentType = "application/json") {
    return new Promise((resolve, reject) => {
        const url = new URL(path, baseUrl);
        const payload = body === undefined ? undefined : JSON.stringify(body);
        const req = http.request(url, {
            method,
            headers: payload === undefined ? {} : {
                "Content-Type": contentType,
                "Content-Length": Buffer.byteLength(payload)
            }
        }, res => {
            let data = "";
            res.on("data", chunk => { data += chunk; });
            res.on("end", () => {
                let parsed;
                try { parsed = data ? JSON.parse(data) : null; }
                catch { parsed = data; }
                resolve({ status: res.statusCode, contentType: res.headers["content-type"], body: parsed });
            });
        });
        req.on("error", reject);
        if (payload !== undefined) req.write(payload);
        req.end();
    });
}

beforeEach(async () => {
    ({ server } = createApi());
    await new Promise(resolve => server.listen(0, "127.0.0.1", resolve));
    baseUrl = `http://127.0.0.1:${server.address().port}`;
});

afterEach(async () => new Promise(resolve => server.close(resolve)));

const validStudent = (rollNo = 101, scores = [85, 90, 78]) => ({
    name: "Shaheer Ahmed", rollNo, scores
});

test("POST /students creates a student and returns the complete representation", async () => {
    const response = await request("POST", "/students", validStudent());
    expect(response.status).toBe(201);
    expect(response.contentType).toContain("application/json");
    expect(Object.keys(response.body).sort()).toEqual(["average", "grade", "name", "rollNo", "scores"].sort());
    expect(response.body).toMatchObject({ name: "Shaheer Ahmed", rollNo: 101, scores: [85, 90, 78], grade: "B" });
    expect(response.body.average).toBeCloseTo(84.3333, 3);
});

test("GET /students returns the list of registered students", async () => {
    await request("POST", "/students", validStudent());
    const response = await request("GET", "/students");
    expect(response.status).toBe(200);
    expect(response.contentType).toContain("application/json");
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body).toHaveLength(1);
    expect(response.body[0].rollNo).toBe(101);
});

test("GET /students/:rollNo returns one student", async () => {
    await request("POST", "/students", validStudent());
    const response = await request("GET", "/students/101");
    expect(response.status).toBe(200);
    expect(response.body.name).toBe("Shaheer Ahmed");
    expect(response.body.grade).toBe("B");
});

test("GET /students/search finds a student without case sensitivity", async () => {
    await request("POST", "/students", validStudent());
    const response = await request("GET", "/students/search?name=shaheer%20ahmed");
    expect(response.status).toBe(200);
    expect(response.body.rollNo).toBe(101);
});

test("N1: unknown roll number returns 404 with an error object", async () => {
    const response = await request("GET", "/students/999");
    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("error");
});

test("N2: missing student name is rejected", async () => {
    const response = await request("POST", "/students", { rollNo: 101, scores: [80] });
    expect(response.status).toBe(400);
    expect(response.body.error).toMatch(/name/i);
});

test.each([0, -1, 1.5, "101", null])("N3: invalid roll number %p is rejected", async rollNo => {
    const response = await request("POST", "/students", { ...validStudent(), rollNo });
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("error");
});

test.each([[0, 400], [1, 201], [6, 201], [7, 400]])(
    "N4: roster score-count boundary %i returns %i", async (count, expectedStatus) => {
        const response = await request("POST", "/students", validStudent(200 + count, Array(count).fill(80)));
        expect(response.status).toBe(expectedStatus);
    }
);

test("N5: duplicate roll number returns 400", async () => {
    await request("POST", "/students", validStudent());
    const response = await request("POST", "/students", validStudent(101, [70]));
    expect(response.status).toBe(400);
    expect(response.body.error).toMatch(/already exists/i);
});

test.each([-1, 0, 1, 99, 100, 101, "90", null])("N6: score boundary/type value %p is handled", async score => {
    const response = await request("POST", "/students", validStudent(300 + (typeof score === "number" ? Math.abs(score) : 200), [score]));
    const valid = typeof score === "number" && score >= 0 && score <= 100;
    expect(response.status).toBe(valid ? 201 : 400);
});

test("N7: invalid name is rejected", async () => {
    const response = await request("POST", "/students", { ...validStudent(), name: "Shaheer123" });
    expect(response.status).toBe(400);
    expect(response.body.error).toMatch(/name/i);
});

test("N8: unsupported media type returns 415", async () => {
    const response = await request("POST", "/students", validStudent(), "text/plain");
    expect(response.status).toBe(415);
    expect(response.body).toHaveProperty("error");
});

test("N9: malformed JSON returns 400", async () => {
    const response = await new Promise((resolve, reject) => {
        const req = http.request(new URL("/students", baseUrl), {
            method: "POST", headers: { "Content-Type": "application/json" }
        }, res => {
            let data = "";
            res.on("data", chunk => { data += chunk; });
            res.on("end", () => resolve({ status: res.statusCode, body: JSON.parse(data) }));
        });
        req.on("error", reject);
        req.write("{bad json");
        req.end();
    });
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("error");
});

test("GET /students responds within 1000 ms", async () => {
    const started = Date.now();
    const response = await request("GET", "/students");
    expect(response.status).toBe(200);
    // Shared CI machines have variable load; this is a generous smoke threshold, not a benchmark.
    expect(Date.now() - started).toBeLessThan(1000);
});

test("POST /students response follows the documented JSON schema", async () => {
    const schemaPath = path.join(__dirname, "../../src/test/resources/schemas/student.schema.json");
    const schema = JSON.parse(fs.readFileSync(schemaPath, "utf8"));
    const response = await request("POST", "/students", validStudent());

    expect(response.status).toBe(201);
    expect(schema.additionalProperties).toBe(false);
    expect(Object.keys(response.body).sort()).toEqual(schema.required.slice().sort());
    expect(typeof response.body.name).toBe("string");
    expect(Number.isInteger(response.body.rollNo)).toBe(true);
    expect(Array.isArray(response.body.scores)).toBe(true);
    expect(typeof response.body.average).toBe("number");
    expect(schema.properties.grade.enum).toContain(response.body.grade);
});
