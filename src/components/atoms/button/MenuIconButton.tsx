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
      icon={<HamburgerIcon />}
      size="sm"
      variant="unstyled"
      display={{ base: "block", md: "none" }}
      onClick={onOpen}
    />
  );
});
