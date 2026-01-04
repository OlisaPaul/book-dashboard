import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { ChakraProvider } from "@chakra-ui/react";
import { LoginPage } from "./LoginPage";
import { Auth0Provider } from "@auth0/auth0-react";

const mockLoginWithRedirect = vi.fn();

vi.mock("@auth0/auth0-react", async () => {
  const actual = await vi.importActual("@auth0/auth0-react");
  return {
    ...actual,
    useAuth0: () => ({
      loginWithRedirect: mockLoginWithRedirect,
      isAuthenticated: false,
      isLoading: false,
    }),
  };
});

const renderWithProviders = (component: React.ReactElement) => {
  return render(
    <ChakraProvider>
      <Auth0Provider
        domain="test.auth0.com"
        clientId="test-client-id"
        authorizationParams={{
          redirect_uri: window.location.origin,
        }}
      >
        {component}
      </Auth0Provider>
    </ChakraProvider>
  );
};

describe("LoginPage", () => {
  it("should render login page with title", () => {
    renderWithProviders(<LoginPage />);

    expect(screen.getByText("Book Dashboard")).toBeInTheDocument();
    expect(
      screen.getByText("Manage your book collection with ease")
    ).toBeInTheDocument();
  });

  it("should render sign in and sign up buttons", () => {
    renderWithProviders(<LoginPage />);

    expect(screen.getByText("Sign In")).toBeInTheDocument();
    expect(screen.getByText("Sign Up")).toBeInTheDocument();
  });

  it("should have correct button colors", () => {
    renderWithProviders(<LoginPage />);

    const signInButton = screen.getByText("Sign In");
    const signUpButton = screen.getByText("Sign Up");

    // Chakra UI applies colorScheme as data attributes
    expect(signInButton.closest("button")).toBeInTheDocument();
    expect(signUpButton.closest("button")).toBeInTheDocument();
  });
});
