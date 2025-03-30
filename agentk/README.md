# AgentK - Kadena Ecosystem Guide

AgentK is an AI-powered chat application and terminal interface built for the Kadena ecosystem. It provides users with a friendly, interactive way to learn about Kadena's blockchain technology, get updates on crypto news, and interact with various AI agents specialized in blockchain and cryptocurrency knowledge.

## 🚀 Features

- **Chat Interface:** Interact with AgentK, an AI assistant specialized in the Kadena ecosystem
- **Terminal Interface:** View real-time updates from agents and crypto news feeds
- **Responsive Design:** Optimized for both desktop and mobile experiences
- **Supabase Integration:** Backend data storage for agent information and messages

## 📁 Project Structure

The application follows a feature-based organization pattern to improve maintainability and scalability:

```
src/
├── assets/           # Static assets like images and logos
├── components/       # UI components organized by feature
│   ├── chat/         # Chat-related components
│   │   ├── ChatBox/  # Main chat interface
│   │   ├── Message/  # Message display components
│   │   └── Input/    # User input components
│   ├── layout/       # Layout components like Navbar
│   └── terminal/     # Terminal-related components
│       ├── Feed/     # News and update feeds
│       └── Command/  # Command input and response
├── hooks/            # Custom React hooks
│   ├── chat/         # Chat-specific hooks
│   └── terminal/     # Terminal-specific hooks
├── pages/            # Full page components
├── services/         # API and service functions
│   ├── ai/           # AI integration services
│   ├── crypto/       # Cryptocurrency data services
│   └── supabase/     # Database interaction
├── types/            # TypeScript type definitions
├── context/          # React context providers
└── utils/            # Utility functions and constants
    ├── formatting/   # Data formatting utilities
    ├── validation/   # Input validation
    └── constants/    # Application constants
```

## 🔧 Technology Stack

- **Frontend:** React 18+, TypeScript, Styled Components
- **State Management:** React Hooks, Context API
- **API Integration:** Axios, Fetch API, WebSockets for real-time data
- **Routing:** React Router v6
- **Backend:** Supabase (PostgreSQL, Authentication, Storage)
- **AI Services:** Xade AI, Perplexity API, Custom fine-tuned models
- **Testing:** Jest, React Testing Library
- **Build Tools:** Webpack, Babel
- **Deployment:** Vercel, Netlify

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v14.0.0 or later)
- npm (v6.0.0 or later) or yarn (v1.22.0 or later)
- Git

## ⚙️ Environment Setup

To run this project locally, you'll need to set up the following environment variables in a `.env` file:

```
REACT_APP_SUPABASE_URL=your_supabase_url
REACT_APP_SUPABASE_KEY=your_supabase_key
REACT_APP_PERPLEXITY_API_KEY=your_perplexity_api_key
REACT_APP_KADENA_API_URL=your_kadena_api_url
REACT_APP_XADE_AI_KEY=your_xade_ai_key
REACT_APP_CRYPTO_DATA_API=your_crypto_data_api
```

## 🏃‍♂️ Getting Started

1. Clone the repository
   ```bash
   git clone https://github.com/harshalmadnani/agent-k.git
   cd agent-k
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Set up your environment variables as described above

4. Start the development server:
   ```bash
   npm start
   # or
   yarn start
   ```

5. Open [http://localhost:3000](http://localhost:3000) to view the app

## 🧠 Development Guidelines

- **Components:** Use TypeScript for all components with proper interface definitions
- **Styling:** Use Styled Components for styling with theme consistency
- **API Calls:** Centralize API calls in the `services` directory with proper error handling
- **State Management:** Use React Context for global state, hooks for component-level state
- **Constants:** Store constants in `utils/constants.ts` to avoid magic strings
- **Types:** Define shared types in the `types` directory with comprehensive documentation
- **Testing:** Write unit tests for components and integration tests for key flows
- **Commits:** Follow conventional commit format (feat, fix, docs, style, refactor, test, chore)

## 🔍 Code Quality

- Run linting:
  ```bash
  npm run lint
  # or
  yarn lint
  ```

- Run tests:
  ```bash
  npm test
  # or
  yarn test
  ```

## 📱 Available Scripts

- `npm start`: Runs the app in development mode
- `npm test`: Runs tests with Jest
- `npm run build`: Builds the app for production
- `npm run eject`: Ejects from Create React App
- `npm run lint`: Runs ESLint to check code quality
- `npm run format`: Formats code with Prettier
- `npm run storybook`: Runs Storybook for component development (if configured)

## 🚀 Deployment

Instructions for deploying to production:

1. Build the production bundle:
   ```bash
   npm run build
   # or
   yarn build
   ```

2. Deploy to your preferred hosting service:
   - For Vercel: `vercel --prod`
   - For Netlify: `netlify deploy --prod`
   - For GitHub Pages: Configure your repository settings

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

Please ensure your code follows our coding standards and includes appropriate tests.

## 🛣️ Roadmap

- **Q3 2023**: Initial release with chat and terminal functionality
- **Q4 2023**: Add wallet integration and transaction tracking
- **Q1 2024**: Expand agent capabilities and educational resources
- **Q2 2024**: Implement community features and collaborative tools
- **Q3 2024**: Add developer tools and API documentation

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](./LICENSE) file for details.



# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
