const { Student } = require("../src/gradebook/gradebook");

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