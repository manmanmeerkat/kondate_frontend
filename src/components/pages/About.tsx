import { memo } from "react";
import { Box, Heading, Text, Image } from "@chakra-ui/react";

export const About = memo(() => {
  return (
    <Box p={4} shadow="md" borderWidth="1px" borderRadius="md">
      <Heading as="h1" size="lg" mb={4}>
        こんだてずかんについて
      </Heading>
      <Text>
        このアプリは、自分が作った料理を記録して管理するためのアプリです。
      </Text>
      <Text>
        料理名、カテゴリ、説明、参考URLを登録することができます。
      </Text>
      <Text>
        また、登録した料理の一覧を表示することができます。
      </Text>

      <Image src="/images/example_image1.png" alt="説明画像1" />

      <Heading as="h2" size="md" mt={6} mb={4}>
        こんだてずかんの使い方
      </Heading>
      <Text>
        料理を登録するには、画面右上の「新規登録」ボタンをクリックしてください。
      </Text>
      <Text>
        登録した料理は、一覧画面で確認することができます。
      </Text>
      <Text>
        一覧画面の料理名をクリックすると、詳細画面に遷移します。
      </Text>
      <Text>
        詳細画面では、料理の詳細を確認することができます。
      </Text>

      <Image src="/images/example_image2.png" alt="説明画像2" />

      <Heading as="h2" size="md" mt={6} mb={4}>
        こんだてずかんの特徴
      </Heading>
      <Text>
        料理のカテゴリを登録することができます。
      </Text>

      <Text>
        料理の参考URLを登録することができます。
      </Text>

      <Text>
        料理の一覧を表示する際に、カテゴリごとに絞り込むことができます。
      </Text>

      <Text>
        料理の一覧を表示する際に、検索ワードを入力して絞り込むことができます。
      </Text>


      <Image src="/images/example_image3.png" alt="説明画像3" />

    </Box>
  );
});
