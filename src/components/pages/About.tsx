import { memo } from "react";
import { Box, Heading, Text, Image, SimpleGrid, Icon, Badge, Stack, useColorModeValue, Button, useBreakpointValue } from "@chakra-ui/react";
import Slider from "react-slick";
import { FaUtensils, FaCalendarAlt, FaListAlt } from "react-icons/fa";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useNavigate } from "react-router-dom";

export const About = memo(() => {
  // スライドショーの設定
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 20000,
  };

  const boxBg = useColorModeValue("white", "gray.700");
  const boxBgAlt = useColorModeValue("gray.50", "gray.600");

  const navigate = useNavigate();

  // トップページに戻る関数
  const handleBackToHome = () => {
    navigate("/");
  };

   const buttonSize = useBreakpointValue({ base: "sm", md: "md" });
  const buttonPosition = useBreakpointValue({
    base: { top: "10px", left: "10px" },  // スマホサイズで左上に固定
    md: { top: "10px", left: "10px" },    // デスクトップでも同じ位置
  });

  // スマホサイズでは見出しに余白を追加
  const headingMarginTop = useBreakpointValue({ base: "50px", md: "0px" });

  return (
    <Box p={6} shadow="md" borderWidth="1px" borderRadius="md" maxWidth="1200px" mx="auto" position="relative">
      {/* トップページに戻るボタン */}
      <Box position="absolute" {...buttonPosition}>
        <Button colorScheme="green" size={buttonSize} onClick={handleBackToHome}>
          トップページに戻る
        </Button>
      </Box>

      {/* 見出しと説明文 */}
      <Heading as="h1" size="lg" mb={6} mt={headingMarginTop} textAlign="center">
        こんだてずかんとは
      </Heading>
  <Text fontSize="lg" mb={6} textAlign="center">
    こんだてずかんはあなたの料理レパートリーを図鑑のように管理できるアプリです。
  </Text>

  <Box mb={8} textAlign="center" maxWidth="600px" mx="auto">
    <Slider {...settings}>
      <Box>
        <Image src="スライド1.gif" alt="GIFサンプル1" borderRadius="md" />
      </Box>
      <Box>
        <Image src="スライド2.gif" alt="GIFサンプル2" borderRadius="md" />
      </Box>
      <Box>
        <Image src="スライド3.gif" alt="GIFサンプル3" borderRadius="md" />
      </Box>
      <Box>
        <Image src="スライド4.gif" alt="GIFサンプル4" borderRadius="md" />
      </Box>
    </Slider>
  </Box>

      <Heading as="h2" size="md" mt={20} mb={4} textAlign="center">
        こんだてずかんでできること
      </Heading>

      <SimpleGrid columns={[1, null, 2]} spacing={8} mb={6}>
        <Box borderRadius="md" boxShadow="md" bg={boxBg} p={4}>
          <Stack spacing={3} align="center">
            <Icon as={FaUtensils} w={8} h={8} color="teal.500" />
            <Image src="すべての料理.png" alt="説明画像" borderRadius="md" />
            <Badge colorScheme="green" fontSize="0.8em">料理一覧</Badge>
            <Text mt={2} fontWeight="bold" textAlign="center">
              登録した料理を一覧表示し、献立作成をサポート
            </Text>
          </Stack>
        </Box>

        <Box borderRadius="md" boxShadow="md" bg={boxBg} p={4}>
          <Stack spacing={3} align="center">
            <Icon as={FaListAlt} w={8} h={8} color="orange.500" />
            <Image src="ジャンル・カテゴリごとの絞り込み表示.png" alt="説明画像" borderRadius="md" />
            <Badge colorScheme="orange" fontSize="0.8em">ジャンル・カテゴリ別絞り込み</Badge>
            <Text mt={2} fontWeight="bold" textAlign="center">
              料理のジャンルやカテゴリで絞り込み表示が可能
            </Text>
          </Stack>
        </Box>

        <Box borderRadius="md" boxShadow="md" bg={boxBgAlt} p={4}>
          <Stack spacing={3} align="center">
            <Icon as={FaUtensils} w={8} h={8} color="pink.500" />
            <Image src="モーダル.png" alt="説明画像" borderRadius="md" />
            <Badge colorScheme="pink" fontSize="0.8em">詳細表示</Badge>
            <Text mt={2} fontWeight="bold" textAlign="center">
              登録した料理の詳細を簡単に確認・編集・削除
            </Text>
          </Stack>
        </Box>

        <Box borderRadius="md" boxShadow="md" bg={boxBg} p={4}>
          <Stack spacing={3} align="center">
            <Icon as={FaUtensils} w={8} h={8} color="purple.500" />
            <Image src="料理の登録.png" alt="説明画像" borderRadius="md" />
            <Badge colorScheme="purple" fontSize="0.8em">新規登録</Badge>
            <Text mt={2} fontWeight="bold" textAlign="center">
              料理の新規登録
            </Text>
          </Stack>
        </Box>

        <Box borderRadius="md" boxShadow="md" bg={boxBgAlt} p={4}>
          <Stack spacing={3} align="center">
            <Icon as={FaUtensils} w={8} h={8} color="yellow.500" />
            <Image src="こんだて作成モード.png" alt="説明画像" borderRadius="md" />
            <Badge colorScheme="yellow" fontSize="0.8em">献立作成</Badge>
            <Text mt={2} fontWeight="bold" textAlign="center">
              こんだて作成モードで日付ごとに献立を登録
            </Text>
          </Stack>
        </Box>

        <Box borderRadius="md" boxShadow="md" bg={boxBgAlt} p={4}>
          <Stack spacing={3} align="center">
            <Icon as={FaCalendarAlt} w={8} h={8} color="cyan.500" />
            <Image src="カレンダー機能.png" alt="説明画像" borderRadius="md" />
            <Badge colorScheme="cyan" fontSize="0.8em">カレンダー機能</Badge>
            <Text mt={2} fontWeight="bold" textAlign="center">
              カレンダー表示で献立予定を確認
            </Text>
          </Stack>
        </Box>

        <Box borderRadius="md" boxShadow="md" bg={boxBgAlt} p={4}>
          <Stack spacing={3} align="center">
            <Icon as={FaCalendarAlt} w={8} h={8} color="blue.500" />
            <Image src="カレンダーモーダル.png" alt="説明画像" borderRadius="md" />
            <Badge colorScheme="blue" fontSize="0.8em">カレンダー</Badge>
            <Text mt={2} fontWeight="bold" textAlign="center">
              カレンダーから日ごとの献立を確認できます
            </Text>
          </Stack>
        </Box>

        <Box borderRadius="md" boxShadow="md" bg={boxBg} p={4}>
          <Stack spacing={3} align="center">
            <Icon as={FaListAlt} w={8} h={8} color="red.500" />
            <Image src="材料リスト.png" alt="説明画像" borderRadius="md" />
            <Badge colorScheme="red" fontSize="0.8em">材料リスト作成</Badge>
            <Text mt={2} fontWeight="bold" textAlign="center">
              必要な材料のリストを期間指定で作成
            </Text>
          </Stack>
        </Box>
      </SimpleGrid>

      <Heading as="h2" size="md" mt={20} mb={4} textAlign="center">
        スマートフォンからもご利用可能
      </Heading>

      <SimpleGrid columns={[4]} spacing={4} mb={6}>
        <Box borderRadius="md" boxShadow="md" bg={boxBg} p={2} width="auto">
          <Image src="スマホ料理一覧.png" alt="スマホ用画像1" borderRadius="md" maxW="100%" height="auto" />
        </Box>
        <Box borderRadius="md" boxShadow="md" bg={boxBg} p={2} width="auto">
          <Image src="ドロワー.png" alt="スマホ用画像2" borderRadius="md" maxW="100%" height="auto" />
        </Box>
        <Box borderRadius="md" boxShadow="md" bg={boxBg} p={2} width="auto">
          <Image src="スマホカレンダー.png" alt="スマホ用画像3" borderRadius="md" maxW="100%" height="auto" />
        </Box>
        <Box borderRadius="md" boxShadow="md" bg={boxBg} p={2} width="auto">
          <Image src="スマホ材料リスト.png" alt="スマホ用画像4" borderRadius="md" maxW="100%" height="auto" />
        </Box>
      </SimpleGrid>
    </Box>
  );
});
