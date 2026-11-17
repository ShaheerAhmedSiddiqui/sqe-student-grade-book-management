const http = require("node:http");
const { Student, GradeBook, Roster, validateName } = require("./gradebook");

function createApi() {
    const gradeBook = new GradeBook();
    const roster = new Roster();
    const send = (res, status, body) => { res.writeHead(status, { "Content-Type": "application/json; charset=utf-8" }); res.end(JSON.stringify(body)); };
    const readJson = req => new Promise((resolve, reject) => {
        let raw = "";
        req.on("data", chunk => { raw += chunk; });
        req.on("end", () => {
            if (!raw) return resolve({});
            try { resolve(JSON.parse(raw)); }
            catch { reject(Object.assign(new Error("Malformed JSON body"), { status: 400 })); }
        });
        req.on("error", reject);
    });
    const server = http.createServer(async (req, res) => {
        const url = new URL(req.url, "http://localhost");
        try {
            if (req.method === "POST" && (url.pathname === "/students" || /^\/students\/\d+\/scores$/.test(url.pathname))) {
                if (!req.headers["content-type"]?.toLowerCase().includes("application/json"))
                    return send(res, 415, { error: "Content-Type must be application/json" });
                const body = await readJson(req);
                if (url.pathname === "/students") {
                    try { validateName(body.name); } catch (e) { return send(res, 400, { error: e.message }); }
                    if (!Number.isInteger(body.rollNo) || body.rollNo <= 0) return send(res, 400, { error: "rollNo must be a positive integer" });
                    if (!Array.isArray(body.scores) || body.scores.length < 1 || body.scores.length > 6)
                        return send(res, 400, { error: "Student must have between 1 and 6 scores" });
                    const student = new Student(body.name, body.rollNo);
                    try {
                        body.scores.forEach(score => student.addScore(score));
                        gradeBook.addStudent(student);
                        roster.addStudent(student);
                    } catch (e) { return send(res, 400, { error: e.message }); }
                    return send(res, 201, studentJson(student));
                }
                const rollNo = Number(url.pathname.split("/")[2]);
                const student = gradeBook.findStudentByRollNo(rollNo);
                if (!student) return send(res, 404, { error: "Student not found" });
                if (student.scores.length >= 6) return send(res, 400, { error: "Student cannot have more than 6 scores" });
                try { student.addScore(body.score); } catch (e) { return send(res, 400, { error: e.message }); }
                return send(res, 200, studentJson(student));
            }
            if (req.method === "GET" && url.pathname === "/students")
                return send(res, 200, roster.students.map(studentJson));
            if (req.method === "GET" && url.pathname === "/students/search") {
                const name = url.searchParams.get("name");
                if (!name) return send(res, 400, { error: "name query parameter is required" });
                const student = gradeBook.findStudentByName(name);
                return student ? send(res, 200, studentJson(student)) : send(res, 404, { error: "Student not found" });
            }
            const gradeMatch = url.pathname.match(/^\/students\/(\d+)\/grade$/);
            if (req.method === "GET" && gradeMatch) {
                const student = gradeBook.findStudentByRollNo(gradeMatch[1]);
                return student ? send(res, 200, { rollNo: student.rollNo, average: student.average(), grade: student.gradeLetter() }) : send(res, 404, { error: "Student not found" });
            }
            const studentMatch = url.pathname.match(/^\/students\/(\d+)$/);
            if (req.method === "GET" && studentMatch) {
                const student = gradeBook.findStudentByRollNo(studentMatch[1]);
                return student ? send(res, 200, studentJson(student)) : send(res, 404, { error: "Student not found" });
            }
            return send(res, 404, { error: "Route not found" });
        } catch (e) { return send(res, e.status || 500, { error: e.message || "Internal server error" }); }
    });
    return { server, gradeBook, roster };
}
function studentJson(student) {
    return { name: student.name, rollNo: student.rollNo, scores: student.scores, average: student.average(), grade: student.gradeLetter() };
}
if (require.main === module) {
    const { server } = createApi();
    const port = Number(process.env.PORT) || 3000;
    server.listen(port, () => console.log(`GradeBook API listening on http://localhost:${port}`));
}
module.exports = { createApi, studentJson };