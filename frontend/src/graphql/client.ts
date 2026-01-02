import {
  ApolloClient,
  InMemoryCache,
  createHttpLink,
  from,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";

const httpLink = createHttpLink({
  uri: import.meta.env.VITE_API_URL || "http://localhost:3001/graphql",
});

// This will be set by the AuthProvider
let getAccessToken: (() => Promise<string>) | null = null;

export const setTokenGetter = (getter: () => Promise<string>) => {
  getAccessToken = getter;
};

const authLink = setContext(async (_, { headers }) => {
  let token = "";

  // Try to get token from the Auth0 getter function first
  if (getAccessToken) {
    try {
      token = await getAccessToken();
    } catch (error) {
      console.error("Error getting token from Auth0:", error);
      // Fallback to localStorage
      token = localStorage.getItem("auth_token") || "";
    }
  } else {
    // Fallback to localStorage if getter not available
    token = localStorage.getItem("auth_token") || "";
  }

  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

export const client = new ApolloClient({
  link: from([authLink, httpLink]),
  cache: new InMemoryCache(),
});
