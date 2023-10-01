import { Button, Drawer, DrawerBody, DrawerContent, DrawerOverlay } from "@chakra-ui/react";
import { memo } from "react";

interface MenuDrawerProps {
  onClose: () => void;
  isOpen: boolean;
  onClickHome: () => void;
  onClickCreate: () => void; // 追加
}

export const MenuDrawer: React.FC<MenuDrawerProps> = memo((props) => {
  const { onClose, isOpen, onClickHome, onClickCreate } = props;

  return (
    <Drawer placement="left" size="xs" onClose={onClose} isOpen={isOpen}>
      <DrawerOverlay>
        <DrawerContent>
          <DrawerBody p={0} bg="gray.100">
            <Button w="100%" onClick={onClickHome}>
              TOP
            </Button>
            <Button w="100%" >
              ユーザー一覧
            </Button>
            <Button w="100%" >
              設定
            </Button>
            <Button w="100%" onClick={onClickCreate}>
              作成
            </Button>
          </DrawerBody>
        </DrawerContent>
      </DrawerOverlay>
    </Drawer>
  );
});
