import React, { useState, useEffect, useRef } from 'react';
import { StatusBar, ScrollView, ImageBackground, StyleSheet, View, TouchableOpacity, Image, Modal, Animated, PanResponder, Text } from 'react-native';

import ButtonIcon from './assets/menubutton.png';
import LoadingScreenJPG from './assets/loadingScreen.jpg'; // Adjust the path to the loading screen JPG file
import MindBackground from './assets/mindBackground.jpg';
import BodyBackground from './assets/bodyBackground.jpg';
import SpiritBackground from './assets/spiritBackground.jpg';
import TrinityIcon from './assets/trinityIcon.png';
import IconMenu from './assets/IconMenu.png';

import { Dimensions } from 'react-native';
//import { useFonts } from './assets/fonts/PlusJakartaSans-Regular.ttf';

// Get the dimensions of the screen
const { width, height } = Dimensions.get('window');

//vars
gestureTriggered = 0;
prevBtnPress = -1;
jpgBackgroundImage = LoadingScreenJPG;
headerText = '';

const Bubble = ({ module }) => {
  return (
    <View style={styles.bubbleContainer}>
      <Text style={styles.bubbleText}>{module.id}</Text>
      <Text style={styles.bubbleText}>{module.type}</Text>
      <Text style={styles.bubbleText}>{module.tags}</Text>
    </View>
  );
};

// Menu Overlay Component
const MenuOverlay = ({ isVisible, onClose, setCurrBackgroundImage, setCurrHeader, setBgColor }) => {
  const [selectedButton, setSelectedButton] = useState(1);

// Function to handle menu button press
const handleButtonPress = (buttonId) => {
  // Set background image based on the selected menu option
  switch (buttonId) {
    case 1:
      if(prevBtnPress === buttonId) {
        setCurrBackgroundImage(MindBackground);
        jpgBackgroundImage = MindBackground;
        headerText = 'MIND';
        bgColor = 'rgba(128,167,158,.34)'
      }
      break;
    case 2:
      if(prevBtnPress === buttonId) {
        setCurrBackgroundImage(BodyBackground);
        jpgBackgroundImage = BodyBackground;
        headerText = 'BODY';
        bgColor = 'rgba(124, 101, 189, .7)'
      }
      break;
    case 3:
      if(prevBtnPress === buttonId) {
        setCurrBackgroundImage(SpiritBackground);
        jpgBackgroundImage = SpiritBackground;
        headerText = 'SPIRIT';
        bgColor = 'rgba(106, 50, 70, .4)'
      }
      break;
    case 4:
      if(prevBtnPress === buttonId) {
        setCurrBackgroundImage(LoadingScreenJPG);
        jpgBackgroundImage = LoadingScreenJPG;
        headerText = 'BROWSE';
        bgColor = 'rgba(128,167,158)'
      }
      break;
    case 5:
      if(prevBtnPress === buttonId) {
        setCurrBackgroundImage(LoadingScreenJPG);
        jpgBackgroundImage = LoadingScreenJPG;
        headerText = 'CONTACT';
        bgColor = 'rgba(128,167,158)'
      }
      break;
    case 6:
      if(prevBtnPress === buttonId) {
        setCurrBackgroundImage(LoadingScreenJPG);
        jpgBackgroundImage = LoadingScreenJPG;
        headerText = 'ABOUT';
        bgColor = 'rgba(128,167,158)'
      }
      break;
    default:
      if(prevBtnPress === buttonId) {
        setCurrBackgroundImage(LoadingScreenJPG);
        jpgBackgroundImage = LoadingScreenJPG;
        headerText = '';
        bgColor = 'rgba(128,167,158)'
      }
    break;
  }


  if (prevBtnPress === buttonId) {
    setCurrHeader(headerText);  // Update the message
    setBgColor(bgColor);
    onClose();
    console.log(`Menu button ${buttonId} opening`);
  } else {
    prevBtnPress = buttonId;
    console.log(`Menu button ${buttonId} pressed`);
  }

  setSelectedButton(buttonId);
};

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={isVisible}
      onsetCurrBackgroundImage={setCurrBackgroundImage}
      onsetCurrHeader = {setCurrHeader}
      setBgColor = {setBgColor}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        {/* Trinity icon */}
        <Image source={TrinityIcon} style={styles.trinityIconSm} />
        {/* Menu Items */}
        <MenuItem label="Mind"  onPress={() => handleButtonPress(1)} selected={selectedButton === 1} />
        <MenuItem label="Body"  onPress={() => handleButtonPress(2)} selected={selectedButton === 2} />
        <MenuItem label="Spirit"  onPress={() => handleButtonPress(3)} selected={selectedButton === 3} />
        <MenuItem label="Browse"  onPress={() => handleButtonPress(4)} selected={selectedButton === 4} />
        <MenuItem label="Contact"  onPress={() => handleButtonPress(5)} selected={selectedButton === 5} />
        <MenuItem label="About"   onPress={() => handleButtonPress(6)} selected={selectedButton === 6} />
      </View>
    </Modal>
  );
};

// Menu Item Component
const MenuItem = ({ label, onPress, selected }) => {
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
  const [loadedModules, setLoadedModules] = useState(null);
  const [selectedModule, setSelectedModule] = useState(null);
  const [foundModules, setFoundModules] = useState([]);
  const [nextModule, setNextModule] = useState(null);
  const [loading, setLoading] = useState(true);
  const [delayElapsed, setDelayElapsed] = useState(false);
  const [imageError, setImageError] = useState(false); // New state to track image loading error
  const [currBackgroundImage, setCurrBackgroundImage] = useState(LoadingScreenJPG); // State for background image
  const [currHeader, setCurrHeader] = useState(''); // State for header
  const [menuText, setMenuText] = useState(''); // State for menu text
  const [bgColor, setBgColor] = useState('rgba(44, 0, 256, 0.34)');  // Default purple color
  const [buttonLabels, setButtonLabels] = useState([]); // Store button labels
  const [Filtered, setFiltered] = useState(false); // Store button labels

  useEffect(() => {
    const loadModulesAsync = async () => {
      const tmploadedModules = loadModules();
      setLoadedModules(tmploadedModules);
  
      const baseModule = tmploadedModules.find(module => module.id === "BaseModule");
      //setSelectedModule(baseModule);
      //console.log('Selected Module:', baseModule.id);
  
      console.log('Detected Modules:');
      tmploadedModules.forEach((module) => console.log(module.id));
      
      setLoading(false); // Mark loading as complete
      setMenuVisible(true); // Open menu after loading
    };

    setTimeout(() => {
      setDelayElapsed(true);
    }, 2000); // 2-second delay

    // Load modules after the delay
    if (delayElapsed) {
      console.log('Begin Loading Modules:');
      loadModulesAsync();
      console.log('End Loading Modules.');
    }
  }, [delayElapsed]);

  const panResponder = React.useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gestureState) => {
        if (gestureTriggered < 1) {
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
    if (!menuVisible) { // This will be true if the menu is about to be shown
      setCurrHeader('');
      foundModules.forEach((module) => module.found = false);
    }
    console.log("Menu visibility:", menuVisible); // Debugging statement
    jpgBackgroundImage = LoadingScreenJPG;
    setFiltered(false)
  };


  const funcButtonPress = (label) => {
    setFiltered(true)
    styles.headerTextContainer.top = 40;
    console.log('Filter Selected:', label);
    setCurrHeader(label); //set to label name... 
    tmpFoundModules = []
    
    //find all modules with tag:
    end = false;
    while(end == false){
      foundModule = getModule(label);
      if(foundModule == null){
        end = true;
      }else{
        tmpFoundModules.push(foundModule);
      }
    }
    console.log("Setting foundModules to: ", tmpFoundModules)
    setFoundModules(tmpFoundModules);
  };
  
  const loadModules = () => {
    const context = require.context('./assets/modules', true, /\.json$/);
    return context.keys().map((key) => {
      const moduleName = key.split('/').slice(-2, -1)[0];
      const moduleInfoContext = require.context('./assets/modules', true, /\.json$/);
      const moduleInfoKey = moduleInfoContext.keys().find((k) => k.includes(`${moduleName}/module_info.json`));
      const moduleInfo = moduleInfoContext(moduleInfoKey);
      console.log('Loaded new module:', moduleInfo.id);
      //console.log('type:', moduleInfo.type);
      //console.log('tags:', moduleInfo.tags);
      return {
        id: moduleInfo.id,
        type:moduleInfo.type,
        tags: moduleInfo.tags,
        found: false,
      };
    });
  };
  


  const getModule = (label) => {
    //console.log('Loading modules with tag:', label);
    try{
      const taggedModule = loadedModules.find(module => module.tags === label && module.found === false);
      console.log('Found module with tag:', taggedModule.id);
      taggedModule.found = true;
      return taggedModule;
    }catch(err){
      console.log("Done finding modules");
      return null;
    }
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

  // Mock function to determine button labels based on header
  const updateButtons = (currHeader) => {
    if (currHeader === 'MIND') {
      setButtonLabels(['MEDITATION','MUSIC','POSITIVE THINKING','IMAGERY']);
    } else if (currHeader === 'BODY') {
      setButtonLabels(['DIET','EXERCISE & YOGA','STRESS MANAGEMENT']);
    } else if (currHeader === 'SPIRIT') {
      setButtonLabels(['FAITH','RELATIONSHIPS','FINDING MEANING','FOSTERING HOPE']);
    } else if (currHeader === 'BROWSE') {
      setButtonLabels([]);
    } else if (currHeader === 'CONTACT') {
      setButtonLabels([]);
    } else if (currHeader === 'ABOUT') {
      setButtonLabels(['Account', 'Notifications', 'Privacy']);
    } else {
      setButtonLabels([]);
    }
  };


  // Whenever the header changes, update the buttons
  useEffect(() => {
    updateButtons(currHeader);
  }, [currHeader]);

  const getRandomModule = () => {

  };

  return (
    <ImageBackground source={currBackgroundImage} style={styles.container} {...panResponder.panHandlers}>
      {/* Always show the purple layer */}
      <View style={[styles.overlayBackground, {backgroundColor: bgColor}]}></View>

      {/* Menu Button */}
      {!menuVisible && !loading && (
        <TouchableOpacity style={styles.menuButton} onPress={handleButtonPress}>
          <Image source={ButtonIcon} style={styles.menuIcon} />
        </TouchableOpacity>
      )}

      {/* filter Button */}
      {!menuVisible && !loading && !Filtered && (
        <View style={styles.headerTextContainer}>
        {buttonLabels.map((label, index) => (
          <TouchableOpacity key={index} style={styles.fbutton} onPress={() => funcButtonPress(label)}>
            <Text style={styles.fbuttonText}>{label}</Text>
          </TouchableOpacity>
        ))}
      </View>
      )}

      {/* Display Trinity icon during the initial 2-second delay */}
      {loading && !delayElapsed ? (
        <View style={styles.trinityIconContainer}>
          <Image source={TrinityIcon} style={styles.trinityIcon} />
        </View>
      ) : (
        <ScrollView>
          <View style={styles.scrollContent}>
            {/* Content */}
          </View>
        </ScrollView>
      )}

      {/* Display the menu after the delay */}
      {!loading && delayElapsed && (
        <MenuOverlay isVisible={menuVisible} onClose={handleButtonPress} setCurrBackgroundImage={setCurrBackgroundImage} setCurrHeader={setCurrHeader} bgColor={bgColor} setBgColor={setBgColor} />
      )}

      <View style={styles.MenuIconContainer}>
        <Image source={IconMenu} style={styles.MenuIcon} />
      </View>

      {menuText !== '' && (
        <View style={styles.menuTextContainer}>
          <Text style={styles.menuText}>{menuText}</Text>
        </View>
      )}

      {/* Header Text */}
      {!menuVisible && !loading && (
        <View style={styles.headerTextContainer} onPress={handleButtonPress}>
          <Text style={styles.headerText}>{currHeader}</Text>
        </View>
      )}

      {/* Render the Bubble component when a module is selected */}
      {selectedModule && (
        <Bubble module={selectedModule} />
      )}

      <StatusBar style="auto" />
    </ImageBackground>
  );
}







// Styles
const styles = StyleSheet.create({
  menuButton: {
    position: 'absolute',
    zIndex: 999, // Ensure the button is above other elements
  },
  menuIcon: {
    top: 5,
    left: -160,
    width: 30,
    height: 30,
  },
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
  MenuIconContainer: {
    position: 'absolute',
    bottom: 0, // Adjust the bottom position as needed
    alignSelf: 'center',
  },
  MenuIcon: {
    width: 400, // Adjust the width as needed
    height: 100, // Adjust the height as needed
    resizeMode: 'contain',
  },
  headerTextContainer: {
    position: 'absolute',
    top: 80, // Adjust the top position as needed
    alignSelf: 'center',
  },
  headerText: {
    fontSize: 50,
    //fontWeight: 'bold',
    color: 'white',
  },
  fbutton: {
    backgroundColor: 'grey', // Example button color
    top: 80, 
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginVertical: 30,
    borderRadius: 5,
  },
  fbuttonText: {
    color: 'white',
    fontSize: 16,
  },
});
