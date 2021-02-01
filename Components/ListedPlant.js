import React, { useState } from 'react';
// import { Button } from 'react-native-elements';
import { Overlay } from 'react-native-elements';
import { Text, View, Button } from 'react-native'
import { SafeAreaProvider } from 'react-native-safe-area-context';

const ListedPlant = () => {
  const [visible, setVisible] = useState(false);

  const toggleOverlay = () => {
    setVisible(!visible);
  };

  return (
    <SafeAreaProvider>
    <View>
      <Button title="Open Overlay" onPress={toggleOverlay} />

      <Overlay isVisible={visible} onBackdropPress={toggleOverlay}>
        <Text>Hello from Overlay!</Text>
      </Overlay>
    </View>
    </SafeAreaProvider>
  );
};

export default ListedPlant;
