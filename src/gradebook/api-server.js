const http = require("node:http");
const { Student, GradeBook, Roster, validateName } = require("./gradebook");

function createApi() {
    const gradeBook = new GradeBook();
    const roster = new Roster();

    function send(res, status, body) {
        res.writeHead(status, { "Content-Type": "application/json; charset=utf-8" });
        res.end(JSON.stringify(body));
    }

    function readJson(req) {
        return new Promise((resolve, reject) => {
            let raw = "";
            req.on("data", chunk => { raw += chunk; });
            req.on("end", () => {
                if (!raw) return resolve({});
                try { resolve(JSON.parse(raw)); }
                catch { reject(Object.assign(new Error("Malformed JSON body"), { status: 400 })); }
            });
            req.on("error", reject);
        });
    }

    const server = http.createServer(async (req, res) => {
        const url = new URL(req.url, "http://localhost");
        try {
            if (req.method === "GET" && url.pathname === "/health") {
                return send(res, 200, { status: "ok" });
            }

            if (req.method === "GET" && url.pathname === "/students") {
                return send(res, 200, roster.students.map(studentJson));
            }

            if (req.method === "POST" && url.pathname === "/students") {
                if (!req.headers["content-type"]?.toLowerCase().includes("application/json")) {
                    return send(res, 415, { error: "Content-Type must be application/json" });
                }
                const body = await readJson(req);
                try { validateName(body.name); }
                catch (error) { return send(res, 400, { error: error.message }); }
                if (!Number.isInteger(body.rollNo) || body.rollNo <= 0) {
                    return send(res, 400, { error: "rollNo must be a positive integer" });
                }
                if (!Array.isArray(body.scores) || body.scores.length < 1 || body.scores.length > 6) {
                    return send(res, 400, { error: "Student must have between 1 and 6 scores" });
                }
                const student = new Student(body.name, body.rollNo);
                try {
                    body.scores.forEach(score => student.addScore(score));
                    // Check duplicate roll numbers before mutating the roster.
                    gradeBook.addStudent(student);
                    roster.addStudent(student);
                } catch (error) {
                    return send(res, 400, { error: error.message });
                }
                return send(res, 201, studentJson(student));
            }

            const studentMatch = url.pathname.match(/^\/students\/(\d+)$/);
            if (req.method === "GET" && studentMatch) {
                const student = roster.students.find(item => item.rollNo === Number(studentMatch[1]));
                return student
                    ? send(res, 200, studentJson(student))
                    : send(res, 404, { error: "Student not found" });
            }

            if (req.method === "GET" && url.pathname === "/students/search") {
                const name = url.searchParams.get("name");
                if (!name) return send(res, 400, { error: "name query parameter is required" });
                const student = gradeBook.findStudentByName(name);
                return student
                    ? send(res, 200, studentJson(student))
                    : send(res, 404, { error: "Student not found" });
            }

            return send(res, 404, { error: "Route not found" });
        } catch (error) {
            return send(res, error.status || 500, { error: error.message || "Internal server error" });
        }
    });

    return { server, gradeBook, roster };
}

function studentJson(student) {
    return {
        name: student.name,
        rollNo: student.rollNo,
        scores: student.scores,
        average: student.average(),
        grade: student.gradeLetter()
    };
}

if (require.main === module) {
    const { server } = createApi();
    const port = Number(process.env.PORT) || 3000;
    server.listen(port, () => console.log(`GradeBook API listening on http://localhost:${port}`));
}

module.exports = { createApi, studentJson };
