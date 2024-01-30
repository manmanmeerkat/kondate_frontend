import { Box, Text } from "@chakra-ui/react";
import { memo } from "react";
import { FoodPhotography } from "../../molecules/FoodPhotograpy";

interface DishCardProps {
  id: number;
  imageUrl: string;
  menuType: string;
  dishName: string;
  onClick: (id: number) => void;
}

// DishCard コンポーネント
export const DishCard = memo((props: DishCardProps) => {
  const { id, imageUrl, dishName, onClick } = props;
  return (
    <Box
      w="260px"
      h="260px"
      bg="white"
      borderRadius="10px"
      shadow="md"
      p={4}
      _hover={{ cursor: "pointer", opacity: 0.8 }}
      onClick={() => onClick(id)}
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
    >
      <FoodPhotography  
        imageFileName={imageUrl || "https://kondate-zukan.s3.ap-northeast-1.amazonaws.com/no_image.jpg"}
        alt={dishName} // dishNameをaltとして渡す
      />

      <Text 
        fontSize="lg" 
        mt="20px" 
        fontWeight="bold" 
        textAlign="center" 
        overflow="hidden" 
        textOverflow="ellipsis" 
        whiteSpace="nowrap" 
        maxWidth="100%"
      >
        {dishName}
      </Text>
    </Box>
  );
});
