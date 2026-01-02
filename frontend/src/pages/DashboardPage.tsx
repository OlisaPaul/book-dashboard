import React, { useState } from "react";
import {
  Box,
  Button,
  Container,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  IconButton,
  useDisclosure,
  Spinner,
  Text,
  HStack,
  useToast,
  useColorModeValue,
} from "@chakra-ui/react";
import { EditIcon, DeleteIcon, AddIcon } from "@chakra-ui/icons";
import { useQuery, useMutation } from "@apollo/client/react";
import { useAuth0 } from "@auth0/auth0-react";
import { GET_BOOKS, DELETE_BOOK } from "../graphql/queries";
import type { Book } from "../types/book";
import { BookModal } from "../components/BookModal";

interface GetBooksData {
  books: Book[];
}

export const DashboardPage: React.FC = () => {
  const { logout, user } = useAuth0();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const toast = useToast();
  const bgColor = useColorModeValue("gray.50", "gray.900");

  const { loading, error, data } = useQuery<GetBooksData>(GET_BOOKS);
  const [deleteBook] = useMutation(DELETE_BOOK, {
    refetchQueries: [{ query: GET_BOOKS }],
  });

  const handleEdit = (book: Book) => {
    setSelectedBook(book);
    onOpen();
  };

  const handleCreate = () => {
    setSelectedBook(null);
    onOpen();
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this book?")) {
      try {
        await deleteBook({ variables: { id } });
        toast({
          title: "Book deleted",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      } catch (error) {
        toast({
          title: "Error",
          description:
            error instanceof Error ? error.message : "An error occurred",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    }
  };

  return (
    <Box minH="100vh" bg={bgColor} py={8}>
      <Container maxW="container.xl">
        <HStack justify="space-between" mb={8}>
          <Box>
            <Heading size="xl">Book Dashboard</Heading>
            <Text color="gray.600" mt={2}>
              Welcome, {user?.name || user?.email}
            </Text>
          </Box>
          <Button colorScheme="red" onClick={() => logout()}>
            Logout
          </Button>
        </HStack>

        <Box bg="white" rounded="lg" shadow="md" p={6}>
          <HStack justify="space-between" mb={6}>
            <Heading size="md">Books</Heading>
            <Button
              leftIcon={<AddIcon />}
              colorScheme="blue"
              onClick={handleCreate}
            >
              Add Book
            </Button>
          </HStack>

          {loading && (
            <Box textAlign="center" py={10}>
              <Spinner size="xl" />
            </Box>
          )}

          {error && (
            <Box textAlign="center" py={10}>
              <Text color="red.500">Error loading books: {error.message}</Text>
            </Box>
          )}

          {!loading && !error && (
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>ID</Th>
                  <Th>Name</Th>
                  <Th>Description</Th>
                  <Th>Actions</Th>
                </Tr>
              </Thead>
              <Tbody>
                {data?.books?.length === 0 ? (
                  <Tr>
                    <Td colSpan={4} textAlign="center" py={10}>
                      <Text color="gray.500">
                        No books found. Create your first book!
                      </Text>
                    </Td>
                  </Tr>
                ) : (
                  data?.books?.map((book: Book) => (
                    <Tr key={book.id}>
                      <Td>{book.id}</Td>
                      <Td fontWeight="semibold">{book.name}</Td>
                      <Td>{book.description}</Td>
                      <Td>
                        <HStack spacing={2}>
                          <IconButton
                            aria-label="Edit book"
                            icon={<EditIcon />}
                            size="sm"
                            colorScheme="blue"
                            onClick={() => handleEdit(book)}
                          />
                          <IconButton
                            aria-label="Delete book"
                            icon={<DeleteIcon />}
                            size="sm"
                            colorScheme="red"
                            onClick={() => handleDelete(book.id)}
                          />
                        </HStack>
                      </Td>
                    </Tr>
                  ))
                )}
              </Tbody>
            </Table>
          )}
        </Box>
      </Container>

      <BookModal isOpen={isOpen} onClose={onClose} book={selectedBook} />
    </Box>
  );
};
