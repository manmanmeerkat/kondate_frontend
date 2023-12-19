// MenuDrawer.tsx

import { Box, Button, Drawer, DrawerBody, DrawerContent, DrawerOverlay, Select, VStack } from "@chakra-ui/react";
import { memo } from "react";
import { LogoutButton } from "../atoms/button/LogoutButton";

interface MenuDrawerProps {
  onClose: () => void;
  isOpen: boolean;
  onClickHome: () => void;
  onClickCreate: () => void;
  onClickAllMyDishes: () => void; 
  onLogoutSuccess: () => void;
  handleToggleMenu: () => void;
  onClickIngredientsList: () => void;
  onClickdeleteUser: () => void;
  onClickpasswordChange: () => void;
  handleSettingsChange: (value: string) => void;
  selectedOption: string;
  csrfToken: string;
}

export const MenuDrawer: React.FC<MenuDrawerProps> = memo((props) => {
  const { onClose, isOpen, onClickHome, onClickCreate, onClickAllMyDishes, onLogoutSuccess, handleToggleMenu, onClickIngredientsList, onClickdeleteUser, onClickpasswordChange, handleSettingsChange, selectedOption, csrfToken } = props;

  return (
    <Drawer placement="top" size="xs" onClose={onClose} isOpen={isOpen}>
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
              <Button w="100%" onClick={onClickIngredientsList}>
                材料リスト
              </Button>
              <Button w="100%" onClick={handleToggleMenu}>
                こんだて作成</Button>
              <Button w="100%" onClick={onClickCreate}>
                新規登録
              </Button>
              <Button w="100%">
                <LogoutButton csrfToken={csrfToken} onLogoutSuccess={onLogoutSuccess} />
              </Button>
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </DrawerOverlay>
    </Drawer>
  );
});
