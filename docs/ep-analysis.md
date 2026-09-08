| Class        | Input    | Representative |
| ------------ | -------- | -------------: |
| Invalid Low  | `< 0`    |          `-10` |
| F            | `0–59`   |           `45` |
| D            | `60–69`  |           `65` |
| C            | `70–79`  |           `75` |
| B            | `80–89`  |           `85` |
| A            | `90–100` |           `95` |
| Invalid High | `> 100`  |          `150` |


| Class   | Input        | Representative |
| ------- | ------------ | -------------: |
| Invalid | `0` scores   |            `0` |
| Valid   | `1–6` scores |            `3` |
| Invalid | `7+` scores  |            `8` |

| Class            | Example                       |
| ---------------- | ----------------------------- |
| Valid            | `"Shaheer Ahmed"`             |
| Empty            | `""`                          |
| Too long         | 51+ characters                |
| Digits/symbols   | `"Shaheer123"` / `"Shaheer@"` |
| Hyphenated valid | `"Ali-Raza"`                  |


## Test Execution Results

E:\universityMaterial\5thSemester\SoftwareQualityEngineering\SQE_Labs\lab-5\sqe-student-grade-book-management> npm test

> sqe-library-management@1.0.0 test
> jest

 PASS  tests/test_roster.test.js

 PASS  tests/test_validate_name.test.js

 PASS  tests/test_letter_grade.test.js

Test Suites: 3 passed, 3 total

Tests:       14 passed, 14 total

Snapshots:   0 total

Time:        1.552 s

Ran all test suites.



