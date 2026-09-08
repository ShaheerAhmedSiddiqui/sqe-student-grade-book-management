# SQE Student GradeBook Management

## Project Description

The **Student GradeBook Management System** is a software project developed for the **Software Quality Engineering (SQE)** course. The project is focused on applying software quality practices, software testing techniques, documentation, version control, and a structured **GitHub-based development workflow**.

The system manages student information, student scores, averages, and letter grades. It also provides functionality for adding students to a grade book and searching for students by name.

## Main Features

* **Student Management** — Create and manage student records.
* **Score Management** — Add and validate student scores between 0 and 100.
* **Average Calculation** — Calculate the average score of a student.
* **Grade Calculation** — Convert student averages into letter grades (A, B, C, D, or F).
* **Student Search** — Search for students by name.
* **Duplicate Prevention** — Prevent students with duplicate roll numbers from being added.
* **Name Validation** — Validate student names according to defined input rules.
* **Roster Management** — Ensure students have a valid number of scores before being added to the roster.
* **Automated Testing** — Use Jest to test the application's functionality.
* **Quality Management** — Apply Software Quality Engineering practices such as Equivalence Partitioning, test documentation, and defect tracking.

## Project Structure

```text
sqe-student-grade-book-management/
│
├── gradebook/
│   ├── gradebook.js
│   └── student_average.js
│
├── tests/
│   ├── test_letter_grade.test.js
│   ├── test_roster.test.js
│   └── test_validate_name.test.js
│
├── docs/
│   └── Project documentation
│
├── screenshots/
│   └── Screenshots and evidence of project activities
│
├── .github/
│   └── workflows/
│       └── GitHub Actions workflows
│
├── index.js
├── package.json
├── README.md
├── LICENSE
└── .gitignore
```

## Directory Purpose

| Directory/File       | Purpose                                                             |
| -------------------- | ------------------------------------------------------------------- |
| `gradebook/`         | Contains the main GradeBook application source code                 |
| `gradebook.js`       | Contains the `Student`, `GradeBook`, `Roster`, and validation logic |
| `student_average.js` | Demonstrates student average and grade calculation                  |
| `tests/`             | Contains automated Jest test cases                                  |
| `docs/`              | Contains project and Software Quality Engineering documentation     |
| `screenshots/`       | Stores screenshots and evidence of project activities               |
| `.github/workflows/` | Contains GitHub Actions workflow files                              |
| `index.js`           | Entry point for running and demonstrating the application           |
| `package.json`       | Contains project configuration and dependencies                     |
| `README.md`          | Provides project information and documentation                      |
| `LICENSE`            | Defines the project's licensing terms                               |
| `.gitignore`         | Specifies files and folders that Git should not track               |

## GradeBook Functionality

### Student

The `Student` class represents a student and contains:

* Student name
* Roll number
* Student scores
* Score validation
* Average calculation
* Letter grade calculation

### Score Validation

Student scores must be within the valid range:

```text
0 – 100
```

Invalid scores are rejected by the system.

### Average Calculation

The student's average is calculated using all scores stored for that student.

For example:

```text
Scores: 80, 90, 70

Average = (80 + 90 + 70) / 3
        = 80
```

### Letter Grade

The system converts the student's average into a letter grade:

| Average | Grade |
| ------: | :---: |
|  90–100 |   A   |
|   80–89 |   B   |
|   70–79 |   C   |
|   60–69 |   D   |
|    0–59 |   F   |

## Software Quality Engineering

The project is used to practice different Software Quality Engineering concepts through practical implementation and testing.

The project focuses on:

* Equivalence Partitioning
* Black-box testing
* Automated testing
* Test case design
* Input validation
* Defect identification
* Test documentation
* Version control
* GitHub Issues
* GitHub Projects
* Continuous Integration
* Software quality improvement

## Equivalence Partitioning

Equivalence Partitioning is used to divide the input domain into valid and invalid classes and select representative values for testing.

For example, the letter-grade functionality can be divided into the following classes:

| Equivalence Class | Input Range | Representative |
| ----------------- | ----------: | -------------: |
| Invalid           |       `< 0` |          `-10` |
| F                 |      `0–59` |           `45` |
| D                 |     `60–69` |           `65` |
| C                 |     `70–79` |           `75` |
| B                 |     `80–89` |           `85` |
| A                 |    `90–100` |           `95` |
| Invalid           |     `> 100` |          `150` |

The project also applies equivalence partitioning to:

* Student score counts
* Student name validation
* Letter-grade boundaries

## Automated Testing

The project uses **Jest** for automated testing.

The test suite contains tests for:

* Letter grade calculation
* Roster score-count validation
* Student name validation
* Valid and invalid input classes

Tests can be executed using:

```bash
npm test
```

or:

```bash
npx jest --verbose
```

## GitHub Project Management

GitHub is used to manage the development and quality activities of this project.

The repository uses:

* **GitHub Issues** for tracking development tasks and defects
* **Labels** for categorizing issues
* **GitHub Projects** for monitoring task progress
* **Git** for version control
* **GitHub Actions** for continuous integration and automation

### Project Issues

Example project issues include:

1. **Implement Student Management**
2. **Implement Grade Calculation**
3. **Implement Score Validation**
4. **Implement Roster Validation**
5. **Implement Student Name Validation**
6. **Add Automated Tests**
7. **Document Equivalence Partitioning**

## Project Labels

The project uses labels such as:

* `bug`
* `enhancement`
* `testing`
* `documentation`
* `high-priority`
* `quality`

## Testing Documentation

Testing and quality-related documentation is maintained in the `docs/` directory.

Examples include:

```text
docs/
├── ep-analysis.md
├── test-plan.md
├── test-cases.md
└── execution-results.md
```

These documents contain test analysis, test cases, execution results, and other quality-related information required for the SQE labs.

## Technologies & Tools

* **JavaScript**
* **Node.js**
* **Jest**
* **Git**
* **GitHub**
* **GitHub Issues**
* **GitHub Projects**
* **GitHub Actions**
* **Markdown**
* **npm**

## Project Objective

The main objective of this project is to apply **Software Quality Engineering concepts** to a practical Student GradeBook application.

The project provides practical experience with:

* Software testing
* Equivalence Partitioning
* Black-box testing
* Automated testing
* Input validation
* Test case design
* Defect tracking
* Version control
* GitHub project management
* Continuous Integration
* Software quality documentation

## Course Information

**Course:** Software Quality Engineering (Lab)

**Project:** Student GradeBook Management System

**Current Focus:** Software Quality Engineering Labs

## Author

**Shaheer Ahmed Siddiqui**

BS Software Engineering

Sukkur IBA University
