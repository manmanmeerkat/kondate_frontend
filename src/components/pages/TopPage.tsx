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
          <Heading color="teal">こんだてずかん</Heading>
          <Link to="/login">
            <Button
              bg="white"
              color="teal"
              borderWidth="1px"
              borderColor="teal"
              _hover={{ bg: 'black', color: 'white' }}
              mt="4"
              onClick={onClickLogin}
            >
              ログイン
            </Button>
          </Link>
          <Link to="/register">
            <Button
              bg="white"
              color="teal
              "
              borderWidth="1px"
              borderColor="teal"
              _hover={{ bg: 'black', color: 'white' }}
              mt="4"
              onClick={onClickUserRegister}
            >
              ユーザー登録
            </Button>
          </Link>
          <ChakraLink
            as={Link}
            to="/about"
            color="teal"
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
        color="teal"
      >
        © 2023 manmanmeerkat
      </Box>
    </div>
  );
});
