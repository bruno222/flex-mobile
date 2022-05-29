import { Box, Heading, HStack, Input, Spinner, Text } from 'native-base';

export const Loading = () => {
  return (
    <HStack space={2} justifyContent="center" alignItems="center" flex={1} backgroundColor="#e5ded4">
      <Spinner accessibilityLabel="Loading messages" size="lg" />
      <Heading color="primary.500" fontSize="xl">
        Just a sec...
      </Heading>
    </HStack>
  );
};
