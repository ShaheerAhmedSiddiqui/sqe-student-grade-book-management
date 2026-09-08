const { validateName } = require("../src/gradebook/gradebook");

describe("validateName - Equivalence Partitioning", () => {

    test("valid typical name: Shaheer Ahmed", () => {
        expect(validateName("Shaheer Ahmed")).toBe(true);
    });

    test("valid name with hyphen: Ali-Raza", () => {
        expect(validateName("Ali-Raza")).toBe(true);
    });

    test("empty name should be invalid", () => {
        expect(() => validateName("")).toThrow();
    });

    test("name longer than 50 characters should be invalid", () => {
        const longName = "A".repeat(51);

        expect(() => validateName(longName)).toThrow();
    });

    test("name containing digits should be invalid", () => {
        expect(() => validateName("Shaheer123")).toThrow();
    });

    test("name containing special characters should be invalid", () => {
        expect(() => validateName("Shaheer@")).toThrow();
    });

});