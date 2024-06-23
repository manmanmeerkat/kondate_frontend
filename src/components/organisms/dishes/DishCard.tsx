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

export const DishCard = memo((props: DishCardProps) => {
  const { id, imageUrl, dishName, onClick } = props;

  return (
    <Box
      w={{ base: "160px", md: "260px" }}  // baseがスマホ、mdが中サイズ以上
      h={{ base: "200px", md: "320px" }}
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
        imageFileName={imageUrl || "https://kondate-zukan.s3.ap-northeast-1.amazonaws.com/noimage.jpg"}
        alt={dishName} 
      />
      <Text 
        fontSize={{ base: "sm", md: "lg" }} 
        mt={{ base: "10px", md: "20px" }} 
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
