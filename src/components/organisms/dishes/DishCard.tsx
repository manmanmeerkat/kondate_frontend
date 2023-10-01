import { Box, Text } from "@chakra-ui/react";
import { memo } from "react";
import { FoodPhotography } from "../../molecules/FoodPhotograpy";

interface DishCardProps {
  id: number;
  imageUrl: string;
  menuType: string;
  dishName: string;
  onClick: (id: string) => void;
}

export const DishCard = memo((props: DishCardProps) => {
  const { id, imageUrl, menuType, dishName, onClick } = props;

  return (
    <Box
      w="260px"
      h="260px"
      bg="white"
      borderRadius="10px"
      shadow="md"
      p={4}
      _hover={{ cursor: "pointer", opacity: 0.8 }}
      onClick={() => onClick(id.toString())}
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
    >
      <FoodPhotography
        imageFileName={imageUrl}
        defaultImage="http://127.0.0.1:8000/storage/uploads/AGvtWs5tLIGhkAU9Nob9bJpo3oLHhZ8a7O7bQvem.jpg"
      />
      <Text fontSize="lg" mt="20px" fontWeight="bold" textAlign="center" overflow="hidden" textOverflow="ellipsis" whiteSpace="nowrap" maxWidth="100%">
        {dishName}
      </Text>
    </Box>
  );
});
