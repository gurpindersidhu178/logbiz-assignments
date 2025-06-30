# Task Manager - Frontend

This is the frontend for the Task Manager application, built with React and TypeScript. It allows users to register, log in, and manage their tasks with features like filtering, searching, task status updates, and a light/dark theme toggle.

## Features

- User registration and login
- Create, edit, and delete tasks
- Filter tasks by status, priority, and archive state
- Search tasks by title or description
- Responsive and modern UI
- Animated filter dropdown
- Custom styled buttons for actions (New Task, Logout, etc.)
- **Light/Dark theme toggle** (with persistent preference)

## Getting Started

### Prerequisites

- Node.js (v16 or above recommended)
- npm (v8 or above recommended)

### Installation

1. Clone the repository:
   ```bash
   git clone <your-repo-url>
   cd frontend-development/Frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```

### Running the App

To start the development server:

```bash
npm start
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the app.

### Building for Production

To build the app for production:

```bash
npm run build
```

The optimized build will be in the `build` folder.

### Running Tests

To run tests:

```bash
npm test
```

## Folder Structure

```
src/
  components/      # React components (TaskList, TaskCard, LoginForm, RegisterForm, etc.)
  contexts/        # React context providers (including ThemeContext for dark/light mode)
  services/        # API and utility services
  types/           # TypeScript type definitions
  App.tsx          # Main app component
  index.tsx        # Entry point
```

## Customization

- All major UI elements are styled with CSS modules in the `components` folder.
- You can adjust colors, spacing, and animations in the respective CSS files.
- Theme colors for dark/light mode can be customized in `App.css`.

## Theme Toggle

- Use the button in the top-right corner to switch between light and dark themes.
- Your preference is saved and will persist across sessions.

## Deployment

See the [Create React App deployment guide](https://facebook.github.io/create-react-app/docs/deployment) for more information.

## License

This project is for educational purposes as part of an assignment.

## Screenshots

Below are some screenshots demonstrating the main features of the Task Manager app:

| Login Page                      | Register Page                         | Task List (Light)                                  | Task List (Dark)                                 |
| ------------------------------- | ------------------------------------- | -------------------------------------------------- | ------------------------------------------------ |
| ![Login](screenshots/login.png) | ![Register](screenshots/register.png) | ![Task List Light](screenshots/tasklist-light.png) | ![Task List Dark](screenshots/tasklist-dark.png) |

> Place your screenshots in a `screenshots/` folder at the root of this project. Update the image filenames if needed.

---

For any issues or questions, please contact your instructor or project mentor.
