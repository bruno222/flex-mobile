import { Avatar, Box, HStack, Spacer, Text, VStack } from 'native-base';

export const RenderAttribute = ({ attribute, value }: any) => {
  console.log('@@keyvalue', attribute, value);
  return (
    <Box width="100%" backgroundColor="white" pl="3" pr="2" py="4">
      <HStack alignItems="center" space={3}>
        <VStack maxWidth="100%">
          <Text isTruncated>{attribute}</Text>
          <Text bold fontSize="lg">
            {value}
          </Text>
        </VStack>
        <Spacer />
      </HStack>
    </Box>
  );
};
