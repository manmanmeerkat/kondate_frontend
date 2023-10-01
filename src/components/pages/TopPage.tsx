import { Box, Center, Heading, Button } from '@chakra-ui/react';
import { Link, useNavigate } from 'react-router-dom';
import { memo } from "react";



export const TopPage = memo(() => {
    
    const navigate = useNavigate();

    const onClickLogin = () => {
      navigate("/home/login");
     }
    const onClickUserRegister = () => {
      navigate("/register")
    }

    return (
      <div>
         <Box bg="white" h="100vh">
        <Center flexDirection="column" h="100%">
          <Heading>こんだてずかん</Heading>
          <Link to="/login">
            <Button
              bg="white"
              color="black"
              borderWidth="1px"
              borderColor="black"
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
              color="black"
              borderWidth="1px"
              borderColor="black"
              _hover={{ bg: 'black', color: 'white' }}
              mt="4"
              onClick={onClickUserRegister}
            >
              ユーザー登録
            </Button>
          </Link>
        </Center>
      </Box>
      </div>
  );
});




