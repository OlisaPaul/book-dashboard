import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ChakraProvider } from "@chakra-ui/react";
import { BookModal } from "./BookModal";

// Mock Apollo Client hooks
vi.mock("@apollo/client/react", () => ({
  useMutation: () => [vi.fn(), { loading: false, error: null }],
}));

const mockOnClose = vi.fn();

const renderWithProviders = (component: React.ReactElement) => {
  return render(<ChakraProvider>{component}</ChakraProvider>);
};

describe("BookModal", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render create mode when no book is provided", () => {
    renderWithProviders(
      <BookModal isOpen={true} onClose={mockOnClose} book={null} />
    );

    expect(screen.getByText("Create New Book")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Enter book name")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Enter book description")
    ).toBeInTheDocument();
  });

  it("should render edit mode when book is provided", () => {
    const book = {
      id: 1,
      name: "Test Book",
      description: "Test Description",
    };

    renderWithProviders(
      <BookModal isOpen={true} onClose={mockOnClose} book={book} />
    );

    expect(screen.getByText("Edit Book")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Test Book")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Test Description")).toBeInTheDocument();
  });

  it("should call onClose when cancel button is clicked", () => {
    renderWithProviders(
      <BookModal isOpen={true} onClose={mockOnClose} book={null} />
    );

    const cancelButton = screen.getByText("Cancel");
    fireEvent.click(cancelButton);

    expect(mockOnClose).toHaveBeenCalled();
  });

  it("should update form fields when typing", () => {
    renderWithProviders(
      <BookModal isOpen={true} onClose={mockOnClose} book={null} />
    );

    const nameInput = screen.getByPlaceholderText(
      "Enter book name"
    ) as HTMLInputElement;
    const descInput = screen.getByPlaceholderText(
      "Enter book description"
    ) as HTMLTextAreaElement;

    fireEvent.change(nameInput, { target: { value: "New Book" } });
    fireEvent.change(descInput, { target: { value: "New Description" } });

    expect(nameInput.value).toBe("New Book");
    expect(descInput.value).toBe("New Description");
  });
});
