// MenuDrawer.tsx

import { Button, Drawer, DrawerBody, DrawerContent, DrawerOverlay, VStack } from "@chakra-ui/react";
import { memo } from "react";
import { LogoutButton } from "../atoms/button/LogoutButton";

interface MenuDrawerProps {
  onClose: () => void;
  isOpen: boolean;
  onClickHome: () => void;
  onClickCreate: () => void;
  onClickAllMyDishes: () => void; // この行を追加
  onLogoutSuccess: () => void;
  csrfToken: string;
}

export const MenuDrawer: React.FC<MenuDrawerProps> = memo((props) => {
  const { onClose, isOpen, onClickHome, onClickCreate, onClickAllMyDishes, onLogoutSuccess, csrfToken } = props;

  return (
    <Drawer placement="left" size="xs" onClose={onClose} isOpen={isOpen}>
      <DrawerOverlay>
        <DrawerContent>
          <DrawerBody p={0} bg="gray.100">
            <VStack spacing={4} align="stretch">
              <Button w="100%" onClick={onClickHome}>
                TOP
              </Button>
              <Button w="100%" onClick={onClickAllMyDishes}>
                すべての料理
              </Button>
              <Button w="100%" onClick={onClickCreate}>
                新規登録
              </Button>
              <LogoutButton csrfToken={csrfToken} onLogoutSuccess={onLogoutSuccess} />
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </DrawerOverlay>
    </Drawer>
  );
});
