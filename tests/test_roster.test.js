const { Student, Roster } = require("../src/gradebook/gradebook");

describe("Roster - Equivalence Partitioning", () => {

    test("0 scores should be invalid", () => {
        const roster = new Roster();
        const student = new Student("Ali", 101);

        expect(() => roster.addStudent(student)).toThrow();
    });

    test("3 scores should be valid", () => {
        const roster = new Roster();
        const student = new Student("Ali", 102);

        student.addScore(70);
        student.addScore(80);
        student.addScore(90);

        expect(() => roster.addStudent(student)).not.toThrow();
        expect(roster.students).toHaveLength(1);
    });

    test("8 scores should be invalid", () => {
        const roster = new Roster();
        const student = new Student("Ali", 103);

        for (let i = 0; i < 8; i++) {
            student.addScore(80);
        }

        expect(() => roster.addStudent(student)).toThrow();
    });

});

