import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import App from './App.tsx';
import './index.css';
import { AuthProvider } from './components/context/AuthContext.tsx';

const client = new ApolloClient({
  uri: "https://kindoo-back.onrender.com/graphql",
  cache: new InMemoryCache(),
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ApolloProvider client={client}>
    <AuthProvider>
        <App />
      </AuthProvider>
    </ApolloProvider>
  </StrictMode>
);
