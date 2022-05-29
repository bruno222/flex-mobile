import { ArrowBackIcon, Box, HStack, IconButton, ScrollView, StatusBar, Text, View } from 'native-base';
import { RenderAttribute } from './components/RenderAttribute';

export const ChatInfo = ({
  navigation,
  route: {
    params: { attributes },
  },
}: any) => {
  console.log('@@attributes', attributes);

  if (!attributes) {
    return null;
  }

  const RenderAttributes = () => (
    <ScrollView showsVerticalScrollIndicator={false} w="100%" backgroundColor="white">
      {Object.entries(attributes).map(([attribute, value]: any) => {
        if (!value) {
          return null;
        }

        if (typeof value === 'string' || typeof value === 'number') {
          return <RenderAttribute attribute={attribute} value={value} />;
        }

        return <RenderAttribute attribute={attribute} value={JSON.stringify(value)} />;
      })}
      <Box safeAreaBottom={12} />
    </ScrollView>
  );

  return (
    <View>
      <StatusBar backgroundColor="#f22e45" barStyle="light-content" />
      <Box safeAreaTop bg="blue.300" />
      <HStack bg="#f22e45" px="1" py="3" justifyContent="space-between" alignItems="center" w="100%">
        <HStack alignItems="center">
          <IconButton onPress={navigation.goBack} paddingLeft="7px" icon={<ArrowBackIcon color="white" />} />
          <Text color="white" fontSize="20" fontWeight="bold" paddingLeft="7px" isTruncated maxWidth="85%">
            Info
          </Text>
        </HStack>
      </HStack>
      <RenderAttributes />
    </View>
  );
};
