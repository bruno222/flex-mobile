import { Box, HStack, Input } from 'native-base';

export const SendText = ({ inputText, setInputText, sendMessage }: any) => {
  const onSubmitEditing = async (event: any) => {
    const text = event.nativeEvent.text;
    console.log('@@onSubmitEditing', text);
    setInputText('');
    await sendMessage(text);
    // setScrollValue((old) => old + 1);
    // console.log('scrollView', scrollView);
    // scrollView.current.scrollToEnd();
  };

  return (
    <Box safeAreaBottom={12} bottom="15px" position="absolute" backgroundColor="#e5ded4">
      <HStack alignItems="center">
        <Input
          aria-label="input"
          size="2xl"
          borderRadius={14}
          margin={3}
          backgroundColor="white"
          onChangeText={(text) => setInputText(text)}
          value={inputText}
          onSubmitEditing={onSubmitEditing}
          placeholder="Message"
        />
        {/* <IconButton onPress={navigation.goBack} icon={<ArrowForwardIcon color="black" />} /> */}
      </HStack>
    </Box>
  );
};
