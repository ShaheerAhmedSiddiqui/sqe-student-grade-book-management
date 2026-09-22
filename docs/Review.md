## Defect: validateName() accepts whitespace-only and hyphen-only strings

**File:** `src/gradebook/gradebook.js`  
**Function:** `validateName(name)`  
**Severity:** Medium  
**Priority:** P2  

### Description
The `validateName()` function incorrectly accepts names that consist only of spaces, only hyphens, or a mix of both. This allows invalid, non-letter names to pass validation.

### Steps to Reproduce
```js
validateName("   ");   // returns true
validateName("---");   // returns true
validateName(" - - "); // returns true

```

Expected
All three calls should throw an error because the input contains no letters.

Actual
All three calls return true — invalid names are accepted.

Root Cause
The check name.length === 0 only rejects completely empty strings.

The regex /^[A-Za-z -]+$/ allows strings containing only spaces and hyphens.

Suggested Fix
function validateName(name) {
    if (typeof name !== "string") {
        throw new TypeError("Name must be a string");
    }

    const trimmed = name.trim();

    if (trimmed.length === 0) {
        throw new Error("Name cannot be empty");
    }

    if (trimmed.length > 50) {
        throw new RangeError("Name cannot exceed 50 characters");
    }

    if (!/^[A-Za-z -]+$/.test(trimmed)) {
        throw new Error("Name can contain only letters, spaces, and hyphens");
    }

    return true;
}
```

Test Evidence
The following Jest tests fail on the current implementation:
 FAIL  tests/validateName.test.js
  validateName()
    √ accepts a normal name (4 ms)
    √ accepts a name with hyphen (1 ms)
    √ accepts exactly 50 characters (1 ms)
    √ rejects empty string (17 ms)
    √ rejects non-string input (5 ms)
    √ rejects name longer than 50 characters (2 ms)
    √ rejects name containing digits (2 ms)
    √ rejects name containing special characters (2 ms)
    × should reject whitespace-only name (DEFECT) (2 ms)
    × should reject hyphen-only name (DEFECT) (1 ms)
    × should reject spaces-and-hyphens-only name (DEFECT) (1 ms)
    √ accepts single letter name
    × should reject single space (DEFECT) (1 ms)

```

Impact:
This defect could allow invalid data (e.g., blank names) into the gradebook system, causing downstream issues in reports or student identification.


You can paste this directly into your `review.md` file. It’s concise but covers all essential aspects: description, reproduction, expected/actual, root cause, fix, and test evidence.

