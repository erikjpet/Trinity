import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity, Image, Modal, TouchableWithoutFeedback, Animated } from 'react-native';

// Import your PNG image file
import ButtonIcon from './assets/menubutton.png';

const MenuOverlay = ({ isVisible, onClose }) => {
  const [selectedButton, setSelectedButton] = useState(1);

  const handleButtonPress = (buttonId) => {
    setSelectedButton(buttonId);
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          {/* Your menu content goes here */}
          <MenuItem label="Button 1" onPress={() => handleButtonPress(1)} selected={selectedButton === 1} />
          <MenuItem label="Button 2" onPress={() => handleButtonPress(2)} selected={selectedButton === 2} />
          <MenuItem label="Button 3" onPress={() => handleButtonPress(3)} selected={selectedButton === 3} />
          <MenuItem label="Button 4" onPress={() => handleButtonPress(4)} selected={selectedButton === 4} />
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const MenuItem = ({ label, onPress, selected }) => {
  const fontSizeAnim = new Animated.Value(selected ? 32 : 24); // Adjusted the default font size

  const handlePress = () => {
    Animated.timing(fontSizeAnim, {
      toValue: selected ? 46 : 32,
      useNativeDriver: false,
    }).start();
    onPress(); // Call the onPress function provided by the parent
  };

  return (
    <TouchableOpacity
      style={[styles.menuButton, selected && styles.selectedButton]}
      onPress={handlePress}
    >
      <Animated.Text style={[styles.menuText, { fontSize: fontSizeAnim, fontWeight: selected ? 'bold' : 'normal' }]}>
        {label}
      </Animated.Text>
    </TouchableOpacity>
  );
};

export default function App() {
  const [menuVisible, setMenuVisible] = useState(false);

  const handleButtonPress = () => {
    // Toggle the menu visibility
    setMenuVisible(!menuVisible);
  };

  useEffect(() => {
    // Show the menu by default when the component mounts
    setMenuVisible(true);
  }, []);

  return (
    <View style={styles.container}>
      <MenuOverlay isVisible={menuVisible} onClose={() => setMenuVisible(false)} />
      <TouchableOpacity
        style={styles.button}
        onPress={handleButtonPress}
      >
        {/* Use Image component to render the PNG image */}
        <Image
          source={ButtonIcon}
          style={styles.buttonIcon}
        />
      </TouchableOpacity>
      <Text>Welcome to Trinity!</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    position: 'absolute',
    top: 25, // Adjust the top position as needed
    left: 20, // Adjust the left position as needed
    zIndex: 1, // Ensure the button is always on top
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
  },
  buttonIcon: {
    width: 50,
    height: 50,
    resizeMode: 'contain', // Adjust the image resize mode as needed
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)', // Black with 70% opacity
    alignItems: 'center',
    justifyContent: 'flex-start', // Align menu items to the top
    paddingTop: 100, // Adjust the top padding to position menu items
  },
  menuButton: {
    marginBottom: 20, // Adjust the spacing between buttons as needed
    paddingVertical: 25, // Adjust the vertical padding to adjust the button height
    paddingHorizontal: 30, // Adjust the horizontal padding to adjust the button width
    borderRadius: 5,
    backgroundColor: 'transparent', // Make the background transparent
  },
  selectedButton: {
    backgroundColor: 'transparent', // Make the background transparent when selected
  },
  menuText: {
    color: '#fff', // Set the text color
  },
});
