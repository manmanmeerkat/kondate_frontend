import { memo, ReactEventHandler } from "react";
import { HamburgerIcon } from "@chakra-ui/icons";
import { IconButton } from "@chakra-ui/react";

interface MenuIconButtonProps {
  onOpen: ReactEventHandler;
}

export const MenuIconButton: React.FC<MenuIconButtonProps> = memo((props) => {
  const { onOpen } = props;

  return (
    <IconButton
      aria-label="メニューボタン"
      icon={<HamburgerIcon boxSize={6} />}
      size="md"
      colorScheme="white"
      variant="outline"
      display={{ base: "block", md: "none" }}
      _hover={{ color: "white" }}
      onClick={onOpen}
    />
  );
});
