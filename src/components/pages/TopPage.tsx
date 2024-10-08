import { Box, Center, Heading, Button, Link as ChakraLink } from '@chakra-ui/react';
import { Link, useNavigate } from 'react-router-dom';
import { memo } from "react";

export const TopPage = memo(() => {
  const navigate = useNavigate();

  const onClickLogin = () => {
    navigate("/home/login");
  }

  const onClickUserRegister = () => {
    navigate("/register");
  }

  return (
    <div style={{ position: 'relative' }}>
      <Box bg="white" h="100vh">
        <Center flexDirection="column" h="100%">
          <Heading color="black">こんだてずかん</Heading>
          <Link to="/login">
            <Button
              bg="white"
              color="black"
              borderWidth="1px"
              borderColor="black"
              _hover={{ bg: 'green', color: 'white' }}
              mt="4"
              onClick={onClickLogin}
            >
              ログイン
            </Button>
          </Link>
          <Link to="/register">
            <Button
              bg="white"
              color="black
              "
              borderWidth="1px"
              borderColor="black"
              _hover={{ bg: 'green', color: 'white' }}
              mt="4"
              onClick={onClickUserRegister}
            >
              ユーザー登録
            </Button>
          </Link>
          <ChakraLink
            as={Link}
            to="/about"
            color="black"
            mt="4"
            style={{ fontWeight: 'bold' }}
          >
            こんだてずかんとは
          </ChakraLink>
        </Center>
      </Box>
      <Box
        position="fixed"
        bottom="0"
        right="0"
        p="2"
        color="black"
      >
        © 2024 こんだてずかん
      </Box>
    </div>
  );
});
