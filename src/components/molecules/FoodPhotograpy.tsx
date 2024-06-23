import React, { useState, useEffect } from "react";
import { Box, Image } from "@chakra-ui/react";

interface FoodPhotographyProps {
  imageFileName?: string;
  defaultImage?: string;
  alt?: string;
}

export const FoodPhotography: React.FC<FoodPhotographyProps> = ({ imageFileName, defaultImage, alt }) => {
  const [imageUrl, setImageUrl] = useState<string>("");

  useEffect(() => {
    if (imageFileName) {
      const publicUrl = `${imageFileName}`;
      setImageUrl(publicUrl);
    } else if (defaultImage) {
      setImageUrl(defaultImage);
    }
  }, [imageFileName, defaultImage]);

  return (
    <Box
      w={{ base: "100px", md: "160px" }}  // baseがスマホ、mdが中サイズ以上
      h={{ base: "100px", md: "160px" }}
    >
      {imageUrl && (
        <Image
          src={imageUrl}
          alt={alt || "Uploaded Image"}
          boxSize="100%"  // 画像がボックスのサイズに合わせる
          objectFit="cover"
          borderRadius="10px"
        />
      )}
    </Box>
  );
};
