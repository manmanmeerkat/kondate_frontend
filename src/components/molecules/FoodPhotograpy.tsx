import React, { useState, useEffect } from "react";
import config from "../pages/config/production";

interface FoodPhotographyProps {
  imageFileName?: string;
  defaultImage?: string;
  alt?: string;
}

export const FoodPhotography: React.FC<FoodPhotographyProps> = ({ imageFileName, defaultImage, alt }) => {
  const [imageUrl, setImageUrl] = useState<string>("");
  const [imageStyle, setImageStyle] = useState<React.CSSProperties>({});

  useEffect(() => {
    if (imageFileName) {
      const publicUrl = `${config.API_ENDPOINT}/storage/${imageFileName}`;
      setImageUrl(publicUrl);
      const imageSizeStyle: React.CSSProperties = {
        width: "160px",
        height: "160px",
      };
      setImageStyle(imageSizeStyle);
    } else if (defaultImage) {
      setImageUrl(defaultImage);
      const imageSizeStyle: React.CSSProperties = {
        width: "160px",
        height: "160px",
      };
      setImageStyle(imageSizeStyle);
    }
  }, [imageFileName, defaultImage]);

  return (
    <div>
      {imageUrl && (
        <img src={imageUrl} alt={alt || "Uploaded Image"} style={imageStyle} />
      )}
    </div>
  );
};
