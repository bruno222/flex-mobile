import { Icon } from 'native-base';
import { AntDesign } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native';

export const IconInfo = ({ attributes, navigate }: any) => {
  if (!attributes) {
    console.log('@@IconInfo - not rendering me, attributes is null');
    return null;
  }

  const onPress = () => {
    navigate('ChatInfo', { attributes });
  };
  return (
    <TouchableOpacity onPress={onPress}>
      <Icon as={AntDesign} name="infocirlceo" size="5" mt="0.5" marginRight="20px" color="white" />
    </TouchableOpacity>
  );
};
