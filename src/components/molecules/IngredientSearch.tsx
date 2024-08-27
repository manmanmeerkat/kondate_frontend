import React, { memo } from "react";
import { InputGroup, Input, InputRightElement, Button } from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";

interface SearchBoxProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSearch: () => void;
}

export const SearchBox: React.FC<SearchBoxProps> = memo(({ value, onChange, onSearch }) => {
  return (
    <InputGroup mt={4} mx="auto" w={{ base: "80%", md: "60%" }}>
      <Input
        placeholder="材料で検索"
        value={value}
        onChange={onChange}
      />
      <InputRightElement width="4.5rem">
        <Button colorScheme="yellow" onClick={onSearch} size="sm">
          <SearchIcon />
          検索
        </Button>
      </InputRightElement>
    </InputGroup>
  );
});
