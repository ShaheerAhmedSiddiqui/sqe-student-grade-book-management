const { Student } = require("../src/gradebook/gradebook");

// ===============================
// LAB 6 - Boundary Value Analysis
// ===============================

// F → D boundary
test("BVA: score 59 should be F", () => {
    const student = new Student("Ali", 201);
    student.addScore(59);

    expect(student.gradeLetter()).toBe("F");
});

test("BVA: score 60 should be D", () => {
    const student = new Student("Ali", 202);
    student.addScore(60);

    expect(student.gradeLetter()).toBe("D");
});

test("BVA: score 61 should be D", () => {
    const student = new Student("Ali", 203);
    student.addScore(61);

    expect(student.gradeLetter()).toBe("D");
});


// D → C boundary
test("BVA: score 69 should be D", () => {
    const student = new Student("Ali", 204);
    student.addScore(69);

    expect(student.gradeLetter()).toBe("D");
});

test("BVA: score 70 should be C", () => {
    const student = new Student("Ali", 205);
    student.addScore(70);

    expect(student.gradeLetter()).toBe("C");
});

test("BVA: score 71 should be C", () => {
    const student = new Student("Ali", 206);
    student.addScore(71);

    expect(student.gradeLetter()).toBe("C");
});


// C → B boundary
test("BVA: score 79 should be C", () => {
    const student = new Student("Ali", 207);
    student.addScore(79);

    expect(student.gradeLetter()).toBe("C");
});

test("BVA: score 80 should be B", () => {
    const student = new Student("Ali", 208);
    student.addScore(80);

    expect(student.gradeLetter()).toBe("B");
});

test("BVA: score 81 should be B", () => {
    const student = new Student("Ali", 209);
    student.addScore(81);

    expect(student.gradeLetter()).toBe("B");
});


// B → A boundary
test("BVA: score 89 should be B", () => {
    const student = new Student("Ali", 210);
    student.addScore(89);

    expect(student.gradeLetter()).toBe("B");
});

test("BVA: score 90 should be A", () => {
    const student = new Student("Ali", 211);
    student.addScore(90);

    expect(student.gradeLetter()).toBe("A");
});

test("BVA: score 91 should be A", () => {
    const student = new Student("Ali", 212);
    student.addScore(91);

    expect(student.gradeLetter()).toBe("A");
});


test("BVA: score -1 should be rejected", () => {
    const student = new Student("Ali", 301);

    expect(() => student.addScore(-1)).toThrow();
});

test("BVA: score 0 should be accepted", () => {
    const student = new Student("Ali", 302);

    expect(() => student.addScore(0)).not.toThrow();
});

test("BVA: score 1 should be accepted", () => {
    const student = new Student("Ali", 303);

    expect(() => student.addScore(1)).not.toThrow();
});

test("BVA: score 99 should be accepted", () => {
    const student = new Student("Ali", 304);

    expect(() => student.addScore(99)).not.toThrow();
});

test("BVA: score 100 should be accepted", () => {
    const student = new Student("Ali", 305);

    expect(() => student.addScore(100)).not.toThrow();
});

test("BVA: score 101 should be rejected", () => {
    const student = new Student("Ali", 306);

    expect(() => student.addScore(101)).toThrow();
});

// ===============================
// LAB 5 - Equivalence Partitioning
// ===============================

test("F class", () => {
    const student = new Student("Ali", 101);
    student.addScore(45);

    expect(student.gradeLetter()).toBe("F");
});

test("D class", () => {
    const student = new Student("Ali", 102);
    student.addScore(65);

    expect(student.gradeLetter()).toBe("D");
});

test("C class", () => {
    const student = new Student("Ali", 103);
    student.addScore(75);

    expect(student.gradeLetter()).toBe("C");
});

test("B class", () => {
    const student = new Student("Ali", 104);
    student.addScore(85);

    expect(student.gradeLetter()).toBe("B");
});

test("A class", () => {
    const student = new Student("Ali", 105);
    student.addScore(95);

    expect(student.gradeLetter()).toBe("A");
});

