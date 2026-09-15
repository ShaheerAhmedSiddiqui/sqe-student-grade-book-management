# Boundary Value Analysis — Student GradeBook

## Introduction

Boundary Value Analysis (BVA) is a software testing technique that focuses on values at the boundaries of valid and invalid input ranges.

This lab applies BVA to the Student GradeBook project. The three areas tested are:

1. Student letter-grade calculation
2. Roster score-count validation
3. Student name length validation

The tests focus on the boundary value itself and the values immediately before and after the boundary.

---

# 1. Letter Grade Boundaries

The Student GradeBook uses the following grading ranges:

| Score Range | Grade |
| ----------- | ----- |
| 0–59        | F     |
| 60–69       | D     |
| 70–79       | C     |
| 80–89       | B     |
| 90–100      | A     |

## Boundary Analysis

| Boundary | Value - 1 | Expected | Boundary Value | Expected | Value + 1 | Expected |
| -------- | --------: | -------- | -------------: | -------- | --------: | -------- |
| 0        |        -1 | Invalid  |              0 | F        |         1 | F        |
| 60       |        59 | F        |             60 | D        |        61 | D        |
| 70       |        69 | D        |             70 | C        |        71 | C        |
| 80       |        79 | C        |             80 | B        |        81 | B        |
| 90       |        89 | B        |             90 | A        |        91 | A        |
| 100      |        99 | A        |            100 | A        |       101 | Invalid  |

Invalid scores below 0 and above 100 are rejected by score validation.

---

# 2. Roster Score-Count Boundaries

The Roster requires a student to have between 1 and 6 scores.

Therefore:

| Score Count | Classification |
| ----------: | -------------- |
|           0 | Invalid        |
|           1 | Valid          |
|           2 | Valid          |
|           3 | Valid          |
|           4 | Valid          |
|           5 | Valid          |
|           6 | Valid          |
|          7+ | Invalid        |

## Boundary Analysis

| Boundary           |    Value | Expected |
| ------------------ | -------: | -------- |
| Lower boundary - 1 | 0 scores | Invalid  |
| Lower boundary     |  1 score | Valid    |
| Lower boundary + 1 | 2 scores | Valid    |
| Upper boundary - 1 | 5 scores | Valid    |
| Upper boundary     | 6 scores | Valid    |
| Upper boundary + 1 | 7 scores | Invalid  |

---

# 3. Student Name Length Boundaries

The maximum allowed student name length is 50 characters.

The important boundary values are:

| Name Length | Classification |
| ----------: | -------------- |
|           0 | Invalid        |
|           1 | Valid          |
|          49 | Valid          |
|          50 | Valid          |
|          51 | Invalid        |

## Boundary Analysis

| Boundary        | Name Length | Expected |
| --------------- | ----------: | -------- |
| Minimum invalid |           0 | Invalid  |
| Minimum valid   |           1 | Valid    |
| Maximum - 1     |          49 | Valid    |
| Maximum         |          50 | Valid    |
| Maximum + 1     |          51 | Invalid  |

---

# 4. BVA Testing Strategy

The BVA tests were implemented in the existing Lab 5 test files as instructed. The existing Equivalence Partitioning (EP) tests were preserved, and additional boundary-focused test cases were added.

The following boundary values were tested:

* Letter grade boundaries: 59, 60, 61, 69, 70, 71, 79, 80, 81, 89, 90, 91
* Roster score-count boundaries: 0, 1, 2, 5, 6, 7
* Student name length boundaries: 0, 1, 49, 50, 51

The BVA tests verify that:

* Valid boundary values are accepted.
* Invalid boundary values are rejected.
* Letter-grade boundaries are assigned to the correct grade.
* No off-by-one errors occur at the tested boundaries.

## Test Execution

The complete Jest test suite was executed using:

```powershell
npx jest --verbose
```

The test execution completed successfully:

```text
Test Suites: 3 passed, 3 total
Tests:       34 passed, 34 total
Snapshots:   0 total
```

Therefore, all existing Lab 5 EP tests and newly added Lab 6 BVA tests passed successfully.
