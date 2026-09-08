class Student {
    constructor(name, rollNo) {
        this.name = name;
        this.rollNo = rollNo;
        this.scores = [];
    }

    addScore(score) {
        if (typeof score !== "number" || Number.isNaN(score)) {
            throw new TypeError("Score must be a number");
        }

        if (score < 0 || score > 100) {
            throw new RangeError("Score must be between 0 and 100");
        }

        this.scores.push(score);
    }

    average() {
        if (this.scores.length === 0) {
            return 0.0;
        }

        const total = this.scores.reduce(
            (sum, score) => sum + score,
            0
        );

        return total / this.scores.length;
    }

    gradeLetter() {
        const average = this.average();

        if (average >= 90) {
            return "A";
        }

        if (average >= 80) {
            return "B";
        }

        if (average >= 70) {
            return "C";
        }

        if (average >= 60) {
            return "D";
        }

        return "F";
    }

   
}

 function validateName(name) {
    if (typeof name !== "string" || name.length === 0) {
        throw new Error("Invalid name");
    }

    if (name.length > 50) {
        throw new Error("Name cannot exceed 50 characters");
    }

    if (!/^[A-Za-z -]+$/.test(name)) {
        throw new Error(
            "Name can contain only letters, spaces, and hyphens"
        );
    }

    return true;
}
class GradeBook {
    constructor() {
        this.students = [];
    }

    addStudent(student) {
        const duplicate = this.students.some(
            existingStudent => existingStudent.rollNo === student.rollNo
        );

        if (duplicate) {
            throw new Error(
                `Student with roll number ${student.rollNo} already exists`
            );
        }

        this.students.push(student);
    }

    findStudentByName(name) {
        return this.students.find(
            student =>
                student.name.toLowerCase() === name.toLowerCase()
        );
    }
}

class Roster {
    constructor() {
        this.students = [];
    }

    addStudent(student) {
        const scoreCount = student.scores.length;

        // Valid class: 1-6 scores
        if (scoreCount < 1 || scoreCount > 6) {
            throw new RangeError(
                "Student must have between 1 and 6 scores"
            );
        }

        this.students.push(student);
    }
}
module.exports = {
    Student,
    GradeBook,
    validateName,
    Roster

};
