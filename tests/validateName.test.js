const { validateName } = require('../src/gradebook/gradebook');

describe('validateName()', () => {

  // ✅ Valid names
  test('accepts a normal name', () => {
    expect(validateName('John Doe')).toBe(true);
  });

  test('accepts a name with hyphen', () => {
    expect(validateName('Mary-Jane')).toBe(true);
  });

  test('accepts exactly 50 characters', () => {
    const name = 'a'.repeat(50);
    expect(validateName(name)).toBe(true);
  });

  // ❌ Invalid names
  test('rejects empty string', () => {
    expect(() => validateName('')).toThrow('Invalid name');
  });

  test('rejects non-string input', () => {
    expect(() => validateName(123)).toThrow('Invalid name');
    expect(() => validateName(null)).toThrow('Invalid name');
    expect(() => validateName(undefined)).toThrow('Invalid name');
  });

  test('rejects name longer than 50 characters', () => {
    const name = 'a'.repeat(51);
    expect(() => validateName(name)).toThrow('Name cannot exceed 50 characters');
  });

  test('rejects name containing digits', () => {
    expect(() => validateName('John123')).toThrow(
      'Name can contain only letters, spaces, and hyphens'
    );
  });

  test('rejects name containing special characters', () => {
    expect(() => validateName('John@Doe')).toThrow(
      'Name can contain only letters, spaces, and hyphens'
    );
  });

  // ⚠️ DEFECT: whitespace-only names pass
  test('should reject whitespace-only name (DEFECT)', () => {
    expect(() => validateName('   ')).toThrow();
  });

  test('should reject hyphen-only name (DEFECT)', () => {
    expect(() => validateName('---')).toThrow();
  });

  test('should reject spaces-and-hyphens-only name (DEFECT)', () => {
    expect(() => validateName(' - - ')).toThrow();
  });

  test('accepts single letter name', () => {
    expect(validateName('A')).toBe(true);
  });

  test('should reject single space (DEFECT)', () => {
    expect(() => validateName(' ')).toThrow();
  });

});