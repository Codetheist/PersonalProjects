# Personal Programming Projects

A collection of projects built while learning and sharpening my skills across different languages and technologies. It spans full-stack web development, browser games, C data structures and algorithms, and Python practice work.

## Tech at a glance

JavaScript, HTML, and CSS for the web projects, Node.js, Express, and SQLite on the full-stack side, C for the data structures and algorithms work, and Python for scripting and practice challenges.

## Featured project

### ProjectForge

A full-stack project and task management application, and the most complete piece in this repo. Users can create projects, manage tasks, assign priorities, set due dates, and track progress through a structured interface. It's built as a practical demonstration of designing and organizing a realistic full-stack app across the frontend, backend, database, authentication, validation, and CRUD layers.

**Stack:** HTML, CSS, and vanilla JavaScript on the frontend; Node.js and Express on the backend; SQLite (via better-sqlite3) for storage. Uses argon2 for password hashing, express-session for sessions, helmet and express-rate-limit for hardening, zod for validation, and pino for logging. Tested with Jest and Supertest.

See [`Website/ProjectForge`](Website/ProjectForge) for the full write-up.

## Web projects

Browser-based games and apps built with HTML, CSS, and JavaScript.

<!-- WEBSITE-PROJECTS:START -->
| Project | Description |
| --- | --- |
| [Battleship](Website/battleship) | Classic Battleship game played against the board. |
| [Countdown Timer](Website/countdowntimer) | A configurable countdown timer. |
| [Hangman](Website/hangman) | Word-guessing Hangman game. |
| [Magic 8-Ball](Website/magicball) | Ask a question and get a Magic 8-Ball answer. |
| [Let's Watch](Website/movie) | Movie browsing and search app. |
| [QR Generator](Website/qrcodegenerator) | Generate QR codes from your input. |
| [Rock Paper Scissors](Website/rockpaperscissors) | Play Rock Paper Scissors against the computer. |
| [Sports](Website/sportapp) | A sports information app. |
| [Tic Tac Toe](Website/tictactoe) | Two-player Tic Tac Toe with audio. |
<!-- WEBSITE-PROJECTS:END -->

## C

Data structures and algorithms implemented in C, organized by topic:

- **Core Linear Structures** — linked lists, queues, and stacks
- **Hierarchical Structures** — tree data structures
- **Advanced Specialized Structures** — more advanced data structures
- **Algorithm Foundations** — sorting algorithms and algorithm analysis
- **DMA & Recursion** — dynamic memory allocation and recursion, graded from beginner through expert

## Python

Practice work and small projects, including a run through the **100 Project Challenge** (band name generator, tip calculator, Treasure Island, rock paper scissors, password generator, maze escape, anime hangman, and onward), plus standalone scripts grouped under calculation, games, numbers, and text.

## Templates

Reusable starting points kept on hand for quick project setup:

- **Web Dev** — a Tailwind CSS web starter
- **Cheat Sheet** — reference notes

## Repository structure

```
.
├── C/             Data structures and algorithms in C
├── DevProjects/   Misc dev experiments
├── Python/        Python practice and challenges
├── Template/      Reusable project starters
└── Website/       Web games, apps, and ProjectForge
```

## License

Released under the [MIT License](LICENSE).