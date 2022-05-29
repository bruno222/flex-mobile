import { Box, Heading, HStack, Spinner } from 'native-base';

export const Loading = () => {
  return (
    <HStack space={2} justifyContent="center" alignItems="center" flex={1} backgroundColor="#e5ded4">
      <Spinner accessibilityLabel="Loading messages" size="lg" color="red.400" />
      <Heading color="red.400" fontSize="xl">
        Just a second...
      </Heading>
    </HStack>
  );
};
