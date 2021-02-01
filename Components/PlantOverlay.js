const React = require('react');
const { Text, Button, View } = require('react-native');
const { Navigation } = require('react-native-navigation');

function Alert({ componentId, title, message }) {
  const dismiss = () => Navigation.dismissOverlay(componentId);

  return (
    <View style={styles.root}>
      <View style={styles.alert}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.message}>{message}</Text>
        <Button title="OK" onPress={dismiss} />
      </View>
    </View>
  );
}

const styles = {
  root: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#00000050',
  },
  alert: {
    alignItems: 'center',
    backgroundColor: 'whitesmoke',
    width: 250,
    elevation: 4,
    padding: 16,
  },
  title: {
    fontSize: 18,
  },
  message: {
    marginVertical: 8,
  },
};

Alert.options = (props) => {
  return {
    overlay: {
      interceptTouchOutside: true,
    },
  };
};

const React = require('react');
const { Text, Button, View } = require('react-native');
const { Navigation } = require('react-native-navigation');

function Alert({ componentId, title, message }) {
  const dismiss = () => Navigation.dismissOverlay(componentId);

  return (
    <View style={styles.root}>
      <View style={styles.alert}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.message}>{message}</Text>
        <Button title="OK" onPress={dismiss} />
      </View>
    </View>
  );
}

const styles = {
  root: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#00000050',
  },
  alert: {
    alignItems: 'center',
    backgroundColor: 'whitesmoke',
    width: 250,
    elevation: 4,
    padding: 16,
  },
  title: {
    fontSize: 18,
  },
  message: {
    marginVertical: 8,
  },
};

Alert.options = (props) => {
  return {
    overlay: {
      interceptTouchOutside: true,
    },
  };
};
