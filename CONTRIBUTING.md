# Contributing to Crust & Craft

Thank you for your interest in contributing to **Crust & Craft**! We welcome contributions from developers of all skill levels.

---

## 🛠️ Code of Conduct

We are committed to providing a welcoming, diverse, and harassment-free experience for everyone. Please be respectful, constructive, and collaborative in all discussions and pull requests.

---

## 🚀 Getting Started

1. **Fork the repository** on GitHub.
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/<your-username>/OIBSIP.git
   cd OIBSIP
   ```
3. **Install dependencies**:
   ```bash
   # In root
   npm install

   # Client
   cd WebDev-L3-PizzaDelivery/client
   npm install

   # Server
   cd ../server
   npm install
   ```
4. **Setup Environment**:
   - In `WebDev-L3-PizzaDelivery/server/`, copy `.env.example` to `.env`.
   - The backend runs an automated in-memory MongoDB fallback with pre-seeded data if no local `MONGODB_URI` is provided!

---

## 💻 Development Workflow

- Run both client and backend concurrently:
  ```bash
  # From repo root
  npm run dev:all
  ```
- Client runs on `http://localhost:3000`
- Server API runs on `http://localhost:5000`

---

## 🧪 Running Tests & Quality Verification

Before submitting a pull request, ensure all integration tests pass and the client builds cleanly:

```bash
# Server tests (21 integration tests covering Auth, Inventory, Orders, Cron)
npm test

# Client production build check
npm run build
```

---

## 📝 Commit Conventions

We follow [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/):
- `feat:` A new feature
- `fix:` A bug fix
- `docs:` Documentation only changes
- `style:` Changes that do not affect the meaning of the code
- `refactor:` A code change that neither fixes a bug nor adds a feature
- `perf:` A code change that improves performance
- `test:` Adding missing tests or correcting existing tests
- `chore:` Changes to the build process or auxiliary tools

---

## 📬 Submitting a Pull Request

1. Create a feature branch (`git checkout -b feat/your-feature-name`).
2. Commit your changes with conventional commit messages.
3. Push to your fork (`git push origin feat/your-feature-name`).
4. Open a Pull Request against the `main` branch with a clear description of your changes and test coverage.
