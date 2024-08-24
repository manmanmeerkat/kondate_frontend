import { Button, Drawer, DrawerBody, DrawerContent, DrawerOverlay, VStack } from "@chakra-ui/react";
import { memo, useState } from "react";
import { LogoutButton } from "../atoms/button/LogoutButton";

interface MenuDrawerProps {
  onClose: () => void; // ドロワーを閉じる関数
  isOpen: boolean; // ドロワーの開閉状態
  onClickHome: () => void; // HOMEボタンのクリック時に呼ばれる関数
  onClickCreate: () => void; // 新規登録ボタンのクリック時に呼ばれる関数
  onClickAllMyDishes: () => void; // すべての料理ボタンのクリック時に呼ばれる関数
  onLogoutSuccess: () => void; // ログアウト成功時に呼ばれる関数
  handleToggleMenu: () => void; // こんだて作成モードの切替関数
  onClickIngredientsList: () => void; // 材料リストボタンのクリック時に呼ばれる関数
  onClickdeleteUser: () => void; // ユーザー削除ボタンのクリック時に呼ばれる関数
  onClickpasswordChange: () => void; // パスワード変更ボタンのクリック時に呼ばれる関数
  handleSettingsChange: (value: string) => void; // 設定変更時に呼ばれる関数
  onClickMenuCalendar: () => void; // カレンダーボタンのクリック時に呼ばれる関数
  selectedOption: string; // 選択されているオプション
  csrfToken: string; // CSRFトークン
}

export const MenuDrawer: React.FC<MenuDrawerProps> = memo((props) => {
  const { onClose, isOpen, onClickHome, onClickCreate, onClickAllMyDishes, onLogoutSuccess, handleToggleMenu, onClickIngredientsList, onClickdeleteUser, onClickpasswordChange, onClickMenuCalendar, handleSettingsChange, selectedOption, csrfToken } = props;
  const [showSettings, setShowSettings] = useState(false); // 設定メニューの表示状態を管理する状態

  return (
    <Drawer placement="top" size="xs" onClose={onClose} isOpen={isOpen}>
      <DrawerOverlay>
        <DrawerContent>
          <DrawerBody p={4} bg="orange.200"> {/* ドロワーの背景色をオレンジに設定 */}
            <VStack spacing={4} align="stretch"> {/* ボタンを縦に並べるためのコンテナ */}
              <Button w="100%" variant="solid" colorScheme="green" onClick={onClickHome}> {/* HOMEボタン */}
                TOP
              </Button>
              <Button w="100%" variant="solid" colorScheme="green" onClick={onClickAllMyDishes}> {/* すべての料理ボタン */}
                すべての料理
              </Button>
              <Button w="100%" variant="solid" colorScheme="green" onClick={() => {
                handleToggleMenu(); // こんだて作成モードに切り替える処理
                onClose(); // ドロワーを閉じる
              }}>
                こんだて作成モード
              </Button>
              <Button w="100%" variant="solid" colorScheme="green" onClick={onClickCreate}> {/* 新規登録ボタン */}
                新規登録
              </Button>
              <Button w="100%" variant="solid" colorScheme="green" onClick={onClickMenuCalendar}> {/* カレンダーボタン */}
                カレンダー
              </Button>
              <Button w="100%" variant="solid" colorScheme="green" onClick={onClickIngredientsList}> {/* 材料リストボタン */}
                材料リスト
              </Button>
              <Button w="100%" variant="solid" colorScheme="green" onClick={() => setShowSettings(!showSettings)}> {/* 設定ボタン */}
                設定
              </Button>
              {showSettings && ( // 設定メニューの表示状態に応じて表示するボタン
                <>
                  <Button w="100%" variant="solid" colorScheme="red" onClick={onClickpasswordChange}> {/* パスワード変更ボタン */}
                    パスワードの変更
                  </Button>
                  <Button w="100%" variant="solid" colorScheme="red" onClick={onClickdeleteUser}> {/* ユーザー削除ボタン */}
                    ユーザーを削除する
                  </Button>
                  <Button w="100%" variant="outline" colorScheme="green" onClick={() => {}}> {/* ログアウトボタン */}
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
