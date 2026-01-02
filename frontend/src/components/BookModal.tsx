import React, { useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  useToast,
} from "@chakra-ui/react";
import { useMutation } from "@apollo/client/react";
import { CREATE_BOOK, UPDATE_BOOK, GET_BOOKS } from "../graphql/queries";
import type { Book, CreateBookInput } from "../types/book";

interface BookModalProps {
  isOpen: boolean;
  onClose: () => void;
  book?: Book | null;
}

export const BookModal: React.FC<BookModalProps> = ({
  isOpen,
  onClose,
  book,
}) => {
  const [name, setName] = useState(book?.name || "");
  const [description, setDescription] = useState(book?.description || "");
  const toast = useToast();

  const [createBook, { loading: creating }] = useMutation(CREATE_BOOK, {
    refetchQueries: [{ query: GET_BOOKS }],
  });

  const [updateBook, { loading: updating }] = useMutation(UPDATE_BOOK, {
    refetchQueries: [{ query: GET_BOOKS }],
  });

  React.useEffect(() => {
    if (book) {
      setName(book.name);
      setDescription(book.description);
    } else {
      setName("");
      setDescription("");
    }
  }, [book, isOpen]);

  const handleSubmit = async () => {
    if (!name.trim() || !description.trim()) {
      toast({
        title: "Validation Error",
        description: "Please fill in all fields",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      const input: CreateBookInput = { name, description };

      if (book) {
        await updateBook({
          variables: { id: book.id, input },
        });
        toast({
          title: "Book updated",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      } else {
        await createBook({
          variables: { input },
        });
        toast({
          title: "Book created",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      }

      onClose();
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
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{book ? "Edit Book" : "Create New Book"}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl mb={4}>
            <FormLabel>Name</FormLabel>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter book name"
            />
          </FormControl>
          <FormControl>
            <FormLabel>Description</FormLabel>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter book description"
              rows={4}
            />
          </FormControl>
        </ModalBody>

        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={onClose}>
            Cancel
          </Button>
          <Button
            colorScheme="blue"
            onClick={handleSubmit}
            isLoading={creating || updating}
          >
            {book ? "Update" : "Create"}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
