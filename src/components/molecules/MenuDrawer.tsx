// MenuDrawer.tsx

import { Box, Button, Drawer, DrawerBody, DrawerContent, DrawerOverlay, Text, VStack } from "@chakra-ui/react";
import { memo, useState } from "react";
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
  const [showSettings, setShowSettings] = useState(false);

  return (
    <Drawer placement="top" size="xs" onClose={onClose} isOpen={isOpen}>
      <DrawerOverlay>
        <DrawerContent>
          <DrawerBody p={4} bg="orange.200"> {/* 要素全体の背景色をオレンジに設定 */}
            <VStack spacing={4} align="stretch">
              <Button w="100%" variant="solid" colorScheme="green" onClick={onClickHome}> {/* TOPボタンの色を緑に設定 */}
                TOP
              </Button>
              <Button w="100%" variant="solid" colorScheme="green" onClick={onClickAllMyDishes}> {/* すべての料理ボタンの色を緑に設定 */}
                すべての料理
              </Button>
              <Button w="100%" variant="solid" colorScheme="green" onClick={() => {
                handleToggleMenu(); // こんだて作成の処理を実行
                onClose(); // ドロワーを閉じる
              }}>
                こんだて作成
              </Button>
              <Button w="100%" variant="solid" colorScheme="green" onClick={onClickCreate}> {/* 新規登録ボタンの色を緑に設定 */}
                新規登録
              </Button>
              <Button w="100%" variant="solid" colorScheme="green" onClick={onClickIngredientsList}> {/* 材料リストボタンの色を緑に設定 */}
                材料リスト
              </Button>
              <Button w="100%" variant="solid" colorScheme="green" onClick={() => setShowSettings(!showSettings)}> {/* 設定ボタンの色を緑に設定 */}
                設定
              </Button>
              {showSettings && (
                <>
                  <Button w="100%" variant="solid" colorScheme="red" onClick={onClickpasswordChange}> {/* パスワードの変更ボタンの色を赤に設定 */}
                    パスワードの変更
                  </Button>
                    <Button w="100%" variant="solid" colorScheme="red" onClick={onClickdeleteUser}> {/* ユーザーを削除するボタンの色を赤に設定 */}
                    ユーザーを削除する
                  </Button>
                  <Button w="100%" variant="outline" colorScheme="green" onClick={() => {}}> {/* ログアウトボタンの枠線色を緑に設定 */}
                    <LogoutButton csrfToken={csrfToken} onLogoutSuccess={onLogoutSuccess} />
                  </Button>
                </>
              )}
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </DrawerOverlay>
    </Drawer>
  );
});
