import React from "react";
import {
  Box,
  Button,
  Container,
  Heading,
  Text,
  VStack,
  useColorModeValue,
} from "@chakra-ui/react";
import { useAuth0 } from "@auth0/auth0-react";

export const LoginPage: React.FC = () => {
  const { loginWithRedirect } = useAuth0();
  const bgColor = useColorModeValue("gray.50", "gray.900");

  return (
    <Box minH="100vh" bg={bgColor} display="flex" alignItems="center">
      <Container maxW="md">
        <VStack spacing={8} align="stretch">
          <VStack spacing={2}>
            <Heading size="2xl" textAlign="center">
              Book Dashboard
            </Heading>
            <Text color="gray.600" textAlign="center">
              Manage your book collection with ease
            </Text>
          </VStack>

          <VStack spacing={4}>
            <Button
              colorScheme="blue"
              size="lg"
              width="full"
              onClick={() => loginWithRedirect()}
            >
              Sign In
            </Button>
            <Button
              colorScheme="green"
              size="lg"
              width="full"
              onClick={() =>
                loginWithRedirect({
                  authorizationParams: {
                    screen_hint: "signup",
                  },
                })
              }
            >
              Sign Up
            </Button>
          </VStack>
        </VStack>
      </Container>
    </Box>
  );
};
