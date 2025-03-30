# AgentK - Kadena Ecosystem Guide

AgentK is an AI-powered chat application and terminal interface built for the Kadena ecosystem. It provides users with a friendly, interactive way to learn about Kadena's blockchain technology, get updates on crypto news, and interact with various AI agents.

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
│   ├── layout/       # Layout components like Navbar
│   └── terminal/     # Terminal-related components
├── hooks/            # Custom React hooks
│   ├── chat/         # Chat-specific hooks
│   └── terminal/     # Terminal-specific hooks
├── pages/            # Full page components
├── services/         # API and service functions
├── types/            # TypeScript type definitions
└── utils/            # Utility functions and constants
```

## 🔧 Technology Stack

- **Frontend:** React, TypeScript, Styled Components
- **State Management:** React Hooks
- **API Integration:** Axios, Fetch API
- **Routing:** React Router
- **Backend:** Supabase
- **AI Services:** Xade AI, Perplexity API

## ⚙️ Environment Setup

To run this project locally, you'll need to set up the following environment variables in a `.env` file:

```
REACT_APP_SUPABASE_URL=your_supabase_url
REACT_APP_SUPABASE_KEY=your_supabase_key
REACT_APP_PERPLEXITY_API_KEY=your_perplexity_api_key
```

## 🏃‍♂️ Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up your environment variables as described above
4. Start the development server:
   ```bash
   npm start
   ```
5. Open [http://localhost:3000](http://localhost:3000) to view the app

## 🧠 Development Guidelines

- **Components:** Use TypeScript for all components
- **Styling:** Use Styled Components for styling
- **API Calls:** Centralize API calls in the `services` directory
- **Constants:** Store constants in `utils/constants.ts`
- **Types:** Define shared types in the `types` directory

## 📱 Available Scripts

- `npm start`: Runs the app in development mode
- `npm test`: Runs tests
- `npm run build`: Builds the app for production
- `npm run eject`: Ejects from Create React App

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

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
