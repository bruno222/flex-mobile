import { Icon } from 'native-base';
import { AntDesign } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native';
import * as Application from 'expo-application';

export const IconMenu = (/*{ task, setIsOpen }: any*/) => {
  return (
    <TouchableOpacity
      onPress={async () => {
        alert(`build version:
${Application.nativeBuildVersion}

native app version:
${Application.nativeApplicationVersion}

last update:
${(await Application.getLastUpdateTimeAsync()).toISOString()}`);
      }}
    >
      <Icon as={AntDesign} name="setting" size="6" marginLeft="13px" color="white" />
    </TouchableOpacity>
  );
};
