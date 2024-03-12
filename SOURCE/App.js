import React, { useState, useEffect, useRef } from 'react';
import { StatusBar, ScrollView, ImageBackground, StyleSheet, View, TouchableOpacity, Image, Modal, Animated, PanResponder, Text } from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';


import ButtonIcon from './assets/menubutton.png';
import LoadingScreenJPG from './assets/loadingScreen.jpg'; // Adjust the path to the loading screen JPG file
import MindBackground from './assets/mindBackground.jpg';
import TrinityIcon from './assets/trinityIcon.png';

import { Dimensions } from 'react-native';

// Get the dimensions of the screen
const { width, height } = Dimensions.get('window');

gestureTriggered = 0;
prevBtnPress = -1;
currBackgroundImage = LoadingScreenJPG;

const Stack = createStackNavigator();

const MyStack = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={App} />
        <Stack.Screen name="MindScreen" component={MindScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};


// Menu Overlay Component
const MenuOverlay = ({ isVisible, onClose, onSelect, navigation }) => {
  const [selectedButton, setSelectedButton] = useState(1);

  // Function to handle button press
  const handleButtonPress = (buttonId) => {
    if (prevBtnPress == buttonId){
      //open buttonId Page
      //console.log(`Menu button ${buttonId} opening`);
      if (buttonId === 1) { //Mind
        console.log(`Menu button 1 opening`);

        navigation.navigate('MindScreen'); // Use navigation prop to navigate
      }
    } else {
      prevBtnPress = buttonId;
      console.log(`Menu button ${buttonId} pressed`);
    }
    setSelectedButton(buttonId);
    onSelect(buttonId);
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        {/* Trinity icon */}
        <Image source={TrinityIcon} style={styles.trinityIconSm} />
        {/* Menu Items */}
        <MenuItem label="Mind" description="This is the Mind description." onPress={() => handleButtonPress(1)} selected={selectedButton === 1} />
        <MenuItem label="Body" description="This is the Body description." onPress={() => handleButtonPress(2)} selected={selectedButton === 2} />
        <MenuItem label="Spirit" description="This is the Spirit description." onPress={() => handleButtonPress(3)} selected={selectedButton === 3} />
        <MenuItem label="Browse" description="This is the Browse description." onPress={() => handleButtonPress(4)} selected={selectedButton === 4} />
        <MenuItem label="Contact" description="This is the Contact description." onPress={() => handleButtonPress(5)} selected={selectedButton === 5} />
        <MenuItem label="About"  description="This is the About description." onPress={() => handleButtonPress(6)} selected={selectedButton === 6} />
      </View>
    </Modal>
  );
};

// Menu Item Component
const MenuItem = ({ label, description, onPress, selected }) => {
  const fontSizeAnim = useRef(new Animated.Value(selected ? 46 : 24)).current;

  useEffect(() => {
    Animated.timing(fontSizeAnim, {
      toValue: selected ? 42 : 24,
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
      {selected && (
        <Text style={styles.menuText}>{description}</Text>
      )}
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
  const [loading, setLoading] = useState(true);
  const [delayElapsed, setDelayElapsed] = useState(false);
  const [imageError, setImageError] = useState(false); // New state to track image loading error

  useEffect(() => {
    const loadModulesAsync = async () => {
      const context = require.context('./assets/modules', true, /thumbnail\.png$/);
      const loadedModules = loadModules(context);
  
      const baseModule = loadedModules.find(module => module.id === "BaseModule");
      const firstNextMod = getRandomModule();
      setSelectedModule(baseModule);
      console.log('Selected Module:', baseModule.id);
  
      console.log('Detected Modules:');
      loadedModules.forEach((module) => console.log(module.id));
    };

    setTimeout(() => {
      setDelayElapsed(true);
      setLoading(false);
    }, 2000); // 2-second delay

    //main
    console.log('Begin Loading Modules:');
    loadModulesAsync();
    console.log('End Loading Modules.');
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
    <ImageBackground source={currBackgroundImage} style={styles.container} {...panResponder.panHandlers}>
      {/* Always show the purple layer */}
      <View style={styles.overlayBackground}></View>

      {/* Display Trinity icon during the initial 2-second delay */}
      {loading && !delayElapsed ? (
        <View style={styles.trinityIconContainer}>
          <Image source={TrinityIcon} style={styles.trinityIcon} />
        </View>
      ) : (
        // Display the menu after the delay
        <MenuOverlay isVisible={true} onClose={() => {}} onSelect={() => {}} />
      )}

      <ScrollView>
        <View style={styles.scrollContent}>
          {/* Content */}
        </View>
      </ScrollView>
      <StatusBar style="auto" />
    </ImageBackground>
  );
}

const MindScreen = ({navigation, route}) => {
  return <Text>This is route to mS</Text>;
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  trinityIconContainer: {
    position: 'absolute',
    top: height * 0.4, // Adjust the top position as needed
    alignItems: 'center',
    justifyContent: 'center',
    width: width,
  },
  trinityIcon: {
    width: 250, // Adjust size as needed
    height: 250, // Adjust size as needed
    resizeMode: 'contain',
  },
  trinityIconSm: {
    width: 100, // Adjust size as needed
    height: 100, // Adjust size as needed
    top: 30,
    resizeMode: 'contain',
    position: 'absolute',
  },
  overlayBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: width,
    height: height,
    backgroundColor: 'rgba(44, 0, 256, 0.34)', // Purple color with 34% opacity
  },
  overlay: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 100,
  },
  menuButton: {
    marginBottom: 10,
    paddingVertical: 18,
    borderRadius: 5,
    backgroundColor: 'transparent',
    alignItems: 'center',
    top: 40
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
