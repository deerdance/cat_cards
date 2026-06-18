# Cat Cards

A small browser-based React quiz game where players answer out loud, reveal the answer, and self-score with cozy cat reactions.

## Run Locally

```bash
npm install
npm run dev
```

Then open the local URL shown by Vite.

## Open Without A Server

```bash
npm run build
```

Then open `dist/index.html` in a browser.

## Deploy To GitHub Pages

This project is ready to publish as a static site with GitHub Pages.

1. Create a new GitHub repository.
2. Push this project to the repository.
3. In GitHub, open `Settings` → `Pages`.
4. Under `Build and deployment`, choose `GitHub Actions`.
5. Push to the `main` branch.

GitHub will run the workflow in `.github/workflows/deploy.yml`, build the app, and publish the `dist` folder.

The site will be available at:

```text
https://your-username.github.io/your-repository-name/
```

## Question JSON Format

```json
[
  {
    "question": "What city was the capital of Japan before Tokyo?",
    "answer": "Kyoto",
    "explanation": "Kyoto was the imperial capital of Japan before the capital moved to Tokyo.",
    "category": "History",
    "difficulty": "Easy"
  }
]
```

Required fields: `question`, `answer`.

Optional fields: `explanation`, `category`, `difficulty`.
