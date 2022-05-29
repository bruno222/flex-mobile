import { Icon } from 'native-base';
import { Linking, TouchableOpacity } from 'react-native';
import { AntDesign } from '@expo/vector-icons';

export const IconOutboundCall = ({ from }: any) => {
  console.log('@@from', from);
  if (!from) {
    console.log('@@OutboundCall - not rendering me, from is null');
    return null;
  }

  const onPress = () => {
    Linking.openURL(`tel:${from}`);
  };
  return (
    <TouchableOpacity onPress={onPress}>
      <Icon as={AntDesign} name="phone" size="5" mt="0.5" marginRight="20px" color="white" />
    </TouchableOpacity>
  );
};
