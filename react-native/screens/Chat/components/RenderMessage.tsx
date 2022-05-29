import { Box, Spacer, Text } from 'native-base';

export const RenderMessage = ({ msg, backgroundColor, alignSelf }: any) => (
  <Box backgroundColor={backgroundColor} borderRadius={6} width="80%" padding={2} alignSelf={alignSelf} margin={2}>
    <Text>{msg.body}</Text>
    <Spacer />
    <Text fontSize="xs" color="coolGray.800" textAlign="right" paddingTop="2px">
      11:22
    </Text>
  </Box>
);
