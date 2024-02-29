import { memo } from "react";
import { Button, Menu, MenuButton, MenuList, Box, MenuItem, Spacer } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { ChevronDownIcon } from "@chakra-ui/icons";

export const GenreButton = memo(() => {
  const navigate = useNavigate();

  const onGenreClick = (genre: string) => {
    navigate(`/${genre}`);
  };

  return (
    <Box display="flex" alignItems="center" justifyContent="center" mt={4} marginX={1}>
      <Menu isLazy>
        <MenuButton
          as={Button}
          rightIcon={<ChevronDownIcon />}
          colorScheme="teal"
          variant="outline"
          mr={1} 
        >
          和食
        </MenuButton>
        <MenuList>
          <MenuItem onClick={() => onGenreClick("all_my_japanese_foods")}>全ての和食</MenuItem>
          <MenuItem onClick={() => onGenreClick("all_my_japanese_syusai")}>主菜</MenuItem>
          <MenuItem onClick={() => onGenreClick("all_my_japanese_fukusai")}>副菜</MenuItem>
          <MenuItem onClick={() => onGenreClick("all_my_japanese_shirumono")}>汁物</MenuItem>
          <MenuItem onClick={() => onGenreClick("all_my_japanese_others")}>その他</MenuItem>
        </MenuList>
      </Menu>
      
      <Menu isLazy>
        <MenuButton
          as={Button}
          rightIcon={<ChevronDownIcon />}
          colorScheme="teal"
          variant="outline"
          mr={1} 
        >
          洋食
        </MenuButton>
        <MenuList>
          <MenuItem onClick={() => onGenreClick("all_my_western_foods")}>全ての洋食</MenuItem>
          <MenuItem onClick={() => onGenreClick("all_my_western_syusai")}>主菜</MenuItem>
          <MenuItem onClick={() => onGenreClick("all_my_western_fukusai")}>副菜</MenuItem>
          <MenuItem onClick={() => onGenreClick("all_my_western_shirumono")}>汁物</MenuItem>
          <MenuItem onClick={() => onGenreClick("all_my_western_others")}>その他</MenuItem>
        </MenuList>
      </Menu>
      
      <Menu isLazy>
        <MenuButton
          as={Button}
          rightIcon={<ChevronDownIcon />}
          colorScheme="teal"
          variant="outline"
          mr={1} 
        >
          中華
        </MenuButton>
        <MenuList>
          <MenuItem onClick={() => onGenreClick("all_my_chinese_foods")}>全ての中華</MenuItem>
          <MenuItem onClick={() => onGenreClick("all_my_chinese_syusai")}>主菜</MenuItem>
          <MenuItem onClick={() => onGenreClick("all_my_chinese_fukusai")}>副菜</MenuItem>
          <MenuItem onClick={() => onGenreClick("all_my_chinese_shirumono")}>汁物</MenuItem>
          <MenuItem onClick={() => onGenreClick("all_my_chinese_others")}>その他</MenuItem>
        </MenuList>
      </Menu>
      
      <Menu isLazy>
        <MenuButton
          as={Button}
          rightIcon={<ChevronDownIcon />}
          colorScheme="teal"
          variant="outline"
        >
          その他
        </MenuButton>
        <MenuList>
          <MenuItem onClick={() => onGenreClick("all_my_others_foods")}>その他の料理すべて</MenuItem>
          <MenuItem onClick={() => onGenreClick("all_my_others_syusai")}>主菜</MenuItem>
          <MenuItem onClick={() => onGenreClick("all_my_others_fukusai")}>副菜</MenuItem>
          <MenuItem onClick={() => onGenreClick("all_my_others_shirumono")}>汁物</MenuItem>
          <MenuItem onClick={() => onGenreClick("all_my_others_others")}>その他</MenuItem>
        </MenuList>
      </Menu>
    </Box>
  );
});
