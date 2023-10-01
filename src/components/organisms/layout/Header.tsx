import { Box, Flex, Heading, Link, useDisclosure } from "@chakra-ui/react";
import { memo, useCallback } from "react";
import { useNavigate } from "react-router-dom";

import { MenuIconButton } from "../../atoms/button/MenuIconButton";
import { MenuDrawer } from "../../molecules/MenuDrawer";

interface HeaderProps {}

export const Header: React.FC<HeaderProps> = memo(() => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const navigate = useNavigate();

  const onClickHome = useCallback(() => navigate("/"), [navigate]);
  const onClickAllMyDishes = useCallback(() => navigate("/all_my_dishes"), [navigate]);
  const onClickRandomPage = useCallback(() => navigate("/home/random"), [navigate]);
  const onClickCreate = useCallback(() => navigate("/create"), [navigate]);

  return (
    <>
      <Flex
        as="nav"
        bg="teal.500"
        color="white"
        align="center"
        justify="space-between"
        padding={{ base: 3, md: 5 }}
      >
        <Flex align="center" as="a" mr={8} _hover={{ cursor: "pointer" }} onClick={onClickHome}>
          <Heading as="h1" fontSize={{ base: "md", md: "lg" }}>
            こんだてずかん
          </Heading>
        </Flex>
        <Flex align="center" fontSize="sm" flexGrow={2} display={{ base: "none", md: "flex" }}>
          <Box pr={4} onClick={onClickAllMyDishes}>
            <Link>料理一覧</Link>
          </Box>
          <Box pr={4} onClick={onClickRandomPage}>
            <Link>ランダムページ</Link>
          </Box>
          <Box pr={4} onClick={onClickCreate}>
            <Link>新規作成</Link>
          </Box>
        </Flex>
        <MenuIconButton onOpen={onOpen} />
      </Flex>
      <MenuDrawer onClose={onClose} isOpen={isOpen} onClickHome={onClickHome}  onClickCreate={onClickCreate} />
    </>
  );
});
