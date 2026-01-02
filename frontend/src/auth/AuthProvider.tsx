import React from "react";
import { Auth0Provider, useAuth0 } from "@auth0/auth0-react";
import { setTokenGetter } from "../graphql/client";

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const domain = import.meta.env.VITE_AUTH0_DOMAIN;
  const clientId = import.meta.env.VITE_AUTH0_CLIENT_ID;
  const audience = import.meta.env.VITE_AUTH0_AUDIENCE;

  return (
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      authorizationParams={{
        redirect_uri: window.location.origin,
        audience: audience,
      }}
      cacheLocation="localstorage"
      useRefreshTokens={true}
    >
      <TokenManager>{children}</TokenManager>
    </Auth0Provider>
  );
};

// Component to manage token in localStorage
const TokenManager: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { getAccessTokenSilently, isAuthenticated, isLoading } = useAuth0();

  // Register the token getter function with Apollo Client
  React.useEffect(() => {
    const tokenGetter = async () => {
      if (isAuthenticated && !isLoading) {
        try {
          const token = await getAccessTokenSilently({
            authorizationParams: {
              audience: import.meta.env.VITE_AUTH0_AUDIENCE,
            },
          });
          return token;
        } catch (error) {
          console.error("Error getting token:", error);
          return "";
        }
      }
      return "";
    };

    setTokenGetter(tokenGetter);
  }, [isAuthenticated, isLoading, getAccessTokenSilently]);

  React.useEffect(() => {
    const getToken = async () => {
      if (isAuthenticated && !isLoading) {
        try {
          const token = await getAccessTokenSilently({
            authorizationParams: {
              audience: import.meta.env.VITE_AUTH0_AUDIENCE,
            },
          });
          localStorage.setItem("auth_token", token);
          console.log("Token stored successfully");
        } catch (error) {
          console.error("Error getting token:", error);
          localStorage.removeItem("auth_token");
        }
      } else if (!isAuthenticated && !isLoading) {
        localStorage.removeItem("auth_token");
      }
    };

    getToken();
  }, [isAuthenticated, isLoading, getAccessTokenSilently]);

  return <>{children}</>;
};
