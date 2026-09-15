const { Student, Roster } = require("../src/gradebook/gradebook");

// ===============================
// LAB 6 - Boundary Value Analysis
// ===============================

describe("Roster - Boundary Value Analysis", () => {

    test("BVA: 1 score should be valid", () => {
        const roster = new Roster();
        const student = new Student("Ali", 201);

        student.addScore(80);

        expect(() => roster.addStudent(student)).not.toThrow();
    });

    test("BVA: 2 scores should be valid", () => {
        const roster = new Roster();
        const student = new Student("Ali", 202);

        student.addScore(80);
        student.addScore(90);

        expect(() => roster.addStudent(student)).not.toThrow();
    });

    test("BVA: 5 scores should be valid", () => {
        const roster = new Roster();
        const student = new Student("Ali", 203);

        for (let i = 0; i < 5; i++) {
            student.addScore(80);
        }

        expect(() => roster.addStudent(student)).not.toThrow();
    });

    test("BVA: 6 scores should be valid", () => {
        const roster = new Roster();
        const student = new Student("Ali", 204);

        for (let i = 0; i < 6; i++) {
            student.addScore(80);
        }

        expect(() => roster.addStudent(student)).not.toThrow();
    });

    test("BVA: 7 scores should be invalid", () => {
        const roster = new Roster();
        const student = new Student("Ali", 205);

        for (let i = 0; i < 7; i++) {
            student.addScore(80);
        }

        expect(() => roster.addStudent(student)).toThrow();
    });

});

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

