import React, { useState, useEffect, useRef } from 'react';
import { StatusBar, ScrollView, ImageBackground, StyleSheet, View, TouchableOpacity, Image, Modal, Animated, PanResponder, Text } from 'react-native';

import ButtonIcon from './assets/menubutton.png';

gestureTriggered = 0;

// Menu Overlay Component
const MenuOverlay = ({ isVisible, onClose, onSelect }) => {
  const [selectedButton, setSelectedButton] = useState(1);

  // Function to handle button press
  const handleButtonPress = (buttonId) => {
    setSelectedButton(buttonId);
    onSelect(buttonId);
    console.log(`Menu button ${buttonId} pressed`);
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={styles.overlayBackground}
        activeOpacity={1}
        onPress={onClose}
      >
        <View style={styles.overlay}>
          {/* Menu Items */}
          <MenuItem label="Trinity" onPress={() => handleButtonPress(1)} selected={selectedButton === 1} />
          <MenuItem label="Mind" onPress={() => handleButtonPress(2)} selected={selectedButton === 2} />
          <MenuItem label="Body" onPress={() => handleButtonPress(3)} selected={selectedButton === 3} />
          <MenuItem label="Spirit" onPress={() => handleButtonPress(4)} selected={selectedButton === 4} />
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

// Menu Item Component
const MenuItem = ({ label, onPress, selected }) => {
  const fontSizeAnim = useRef(new Animated.Value(selected ? 46 : 24)).current;

  useEffect(() => {
    Animated.timing(fontSizeAnim, {
      toValue: selected ? 46 : 24,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [selected]);

  return (
    <TouchableOpacity
      style={[styles.menuButton, selected && styles.selectedButton]}
      onPress={onPress}
    >
      <Animated.Text style={[styles.menuText, { fontSize: fontSizeAnim, fontWeight: selected ? 'bold' : 'normal' }]}>
        {label}
      </Animated.Text>
    </TouchableOpacity>
  );
};

// Module Component
const Module = ({ module }) => {
  const thumbnailUri = module.thumbnail;

  return (
    <View style={styles.module}>
      {thumbnailUri && (
        <ImageBackground source={{ uri: thumbnailUri }} style={styles.moduleImage}>
          {/* Additional content can be added here if needed */}
        </ImageBackground>
      )}
    </View>
  );
};

// Main App Component
export default function App() {
  const [menuVisible, setMenuVisible] = useState(false);
  const [selectedModule, setSelectedModule] = useState(null);
  const [nextModule, setNextModule] = useState(null);

  useEffect(() => {
    const context = require.context('./assets/modules', true, /thumbnail\.png$/);
    const loadedModules = loadModules(context);

    const baseModule = loadedModules.find(module => module.id === "BaseModule");
    const firstNextMod = getRandomModule()
    setSelectedModule(baseModule);
    console.log('Selected Module:', baseModule.id);

    console.log('Detected Modules:');
    loadedModules.forEach((module) => console.log(module.id));
  }, []);

  const panResponder = React.useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gestureState) => {
        if(gestureTriggered < 1){
          if (gestureState.dy < -50) {
            handleSwipe('Up');
            gestureState.dy = 0;
            gestureTriggered = 1;
          } else if (gestureState.dy > 50) {
            handleSwipe('Down');
            gestureState.dy = 0;
            gestureTriggered = 1;
          }
        }
      },
      onPanResponderRelease: () => {
        gestureTriggered = 0; // Reset gestureTriggered to 0 when touch is released
      },
    })
  ).current;

  // Function to handle menu button press
  const handleButtonPress = () => {
    setMenuVisible(!menuVisible);
  };
  
  const loadModules = (context) => {
    return context.keys().map((key) => {
      const moduleName = key.split('/').slice(-2, -1)[0];
      const thumbnailPath = context(key);
      console.log('Loaded:', moduleName);
      return {
        id: moduleName,
        thumbnail: thumbnailPath.toString(),
      };
    });
  };

  // Function to handle menu item selection
  const handleMenuSelect = (optionId) => {
    // Logic to handle menu item selection
  };

  // Function to handle swipe events
  const handleSwipe = (direction) => {
    console.log(`Swipe ${direction} detected`);
    if (direction == 'Up') {

    } else if (direction == 'Down') {

    }
  };

  const getRandomModule = () => {

  };

  return (
    <View style={styles.container} {...panResponder.panHandlers}>
      <MenuOverlay isVisible={menuVisible} onClose={() => setMenuVisible(false)} onSelect={handleMenuSelect} />
      <TouchableOpacity
        style={styles.button}
        onPress={handleButtonPress}
      >
        <Image
          source={ButtonIcon}
          style={styles.buttonIcon}
        />
      </TouchableOpacity>
      <ScrollView>
        <View style={styles.scrollContent}>
          {/* Content */}
        </View>
      </ScrollView>
      <StatusBar style="auto" />
    </View>
  );
}

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    position: 'absolute',
    top: 25,
    left: 20,
    zIndex: 1,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
  },
  buttonIcon: {
    width: 50,
    height: 50,
    resizeMode: 'contain',
  },
  overlay: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 100,
  },
  overlayBackground: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  menuButton: {
    marginBottom: 20,
    paddingVertical: 25,
    paddingHorizontal: 30,
    borderRadius: 5,
    backgroundColor: 'transparent',
  },
  selectedButton: {
    backgroundColor: 'transparent',
  },
  menuText: {
    color: '#fff',
  },
  scrollContent: {
    paddingTop: 100,
  },
});
