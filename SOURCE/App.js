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
import * as Font from 'expo-font';
import PlusJakartaSansRegular from './assets/font/PlusJakartaSans-Regular.ttf';

// Get the dimensions of the screen
const { width, height } = Dimensions.get('window');

//vars
gestureTriggered = 0;
prevBtnPress = -1;
jpgBackgroundImage = LoadingScreenJPG;
headerText = '';
headerTopMargin = 30;
headerFontSize = 50;

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
        headerText = 'TRINITY';
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
        <MenuItem label="Trinity"  onPress={() => handleButtonPress(4)} selected={selectedButton === 4} />
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

  const handleImageError = () => {
    console.log('Error loading image:', thumbnailUri);
    setImageError(true); // Set image error state
  };

  console.log('Thumbnail URI:', thumbnailUri);

  return (
    <View style={styles.module}>
      <View style={styles.moduleContainer}>
        {thumbnailUri ? (
          <Image
            source={{ uri: thumbnailUri }}
            style={styles.moduleThumbnail}
            onError={handleImageError} // Handle image loading error
          />
        ) : (
          <Text style={styles.moduleThumbnail}>No Image</Text> // Display text if no image URI is provided
        )}
        <View style={styles.moduleTextContainer}>
          <Text style={styles.moduleBoldText}>{module.id}</Text>
          <Text style={styles.moduleText}>{module.disc}</Text>
          <Text style={styles.moduleText}>{module.subdisc}</Text>
        </View>
      </View>
    </View>
  );
};




// Main App Component
export default function App() {
  const [menuVisible, setMenuVisible] = useState(false);
  const [loadedModules, setLoadedModules] = useState(null);
  const [selectedModule, setSelectedModule] = useState(null);
  const [foundModules, setFoundModules] = useState([]);
  const [displayedModules, setDisplayedModules] = useState([]);
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
    headerTopMargin = 30;
    headerFontSize = 50;
    if (!menuVisible) { // This will be true if the menu is about to be shown
      setCurrHeader('');
      foundModules.forEach((module) => module.found = false);
      setDisplayedModules([]);
    }
    console.log("Menu visibility:", menuVisible); // Debugging statement
    jpgBackgroundImage = LoadingScreenJPG;
    setFiltered(false)
  };

  const moduleButtonPress = (id) => {
  
  };

  const displayBrowsePage = () => {
    setFiltered(true)
    setCurrHeader('TRINITY'); //set to label name... 
    headerFontSize = 30;
    headerTopMargin = 0;
    tmpFoundModules = [];
    
    //Load buffer of modules to grab from:
    end = false;
    while(end == false){
      foundModule = getAnyModule();
      if(foundModule == null){
        end = true;
      }else{
        tmpFoundModules.push(foundModule);
      }
    }
    console.log("Setting foundModules to: ", tmpFoundModules)
    if(tmpFoundModules == []){
      setFoundModules([]);
    } else{
      setFoundModules(tmpFoundModules);
    }
    displayFoundModules(tmpFoundModules, 5);
  };


  const funcButtonPress = (label) => {
    setFiltered(true)
    console.log('Filter Selected:', label);
    setCurrHeader(label); //set to label name... 
    headerFontSize = 30;
    headerTopMargin = 0;
    tmpFoundModules = [];
    
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
    if(tmpFoundModules == []){
      setFoundModules([]);
    } else{
      setFoundModules(tmpFoundModules);
    }

    displayFoundModules(tmpFoundModules, 4);


  };
  

  const displayFoundModules = (displayModules, mParts) => {
    //Display a screen with the inputted amount of module parts mParts
    displayParts = 0; //amount of moduleparts added to display
    display = [];
    while(mParts > displayParts){
      loops = 0;
      while(5 > loops){
        randModule = displayModules[Math.floor((Math.random()*displayModules.length))];
        //console.log(display.includes(randModule));
        if(!display.includes(randModule)){
          loops = loops + 1;
        }else{
          console.log(2);
          break;
        }
      }
      if(randModule != null){
        displayParts = displayParts + randModule.type;
        display.push(randModule);
        console.log("Adding to displayed modules: ", randModule.id)
      } else {
        displayParts = mParts;
      }
    }
    setDisplayedModules(display);
  };

  const loadModules = () => {
    const context = require.context('./assets/modules', true, /\.json$/);
    return context.keys().map((key) => {
      const moduleName = key.split('/').slice(-2, -1)[0];
      const moduleInfoContext = require.context('./assets/modules', true, /\.json$/);
      const moduleInfoKey = moduleInfoContext.keys().find((k) => k.includes(`${moduleName}/module_info.json`));
      const moduleInfo = moduleInfoContext(moduleInfoKey);
      console.log('Loaded new module:', moduleInfo.id);
      return {
        id: moduleInfo.id,
        type: moduleInfo.type,
        tags: moduleInfo.tags,
        disc: moduleInfo.disc,
        subdisc: moduleInfo.subdisc,
        found: false,
        thumbnail: `./assets/modules/${moduleName}/thumbnail.png`
      };
    });
  };
  
  const getAnyModule = () => {
    console.log('Loading one of ANY module');
    try{
      const taggedModule = loadedModules.find(module =>  module.found === false);
      console.log('Found module with tag:', taggedModule.id);
      taggedModule.found = true;
      return taggedModule;
    }catch(err){
      console.log("Error Finding module.");
      return null;
    }
  };

  const getModule = (label) => {
    //console.log('Loading modules with tag:', label);
    try{
      const taggedModule = loadedModules.find(module => module.tags === label && module.found === false);
      console.log('Found module with tag:', taggedModule.id, taggedModule.found);
      taggedModule.found = true;
      return taggedModule;
    }catch(err){
      console.log("Done finding modules");
      return null;
    }
    return taggedModule;
  };

  // Function to handle menu item selection
  const handleMenuSelect = (optionId) => {
    // Logic to handle menu item selection
  };

  // Function to handle swipe events
  const handleSwipe = (direction) => {
    console.log(`Swipe ${direction} detected`);
    if (direction == 'Up') {
      console.log("Swipe up");
    } else if (direction == 'Down') {
      console.log("Swipe down");
    }
  };

  // Mock function to determine button labels based on header
  const updateButtons = (currHeader) => {
    if (currHeader === 'MIND') {
      setButtonLabels(['MUSIC','MEDITATION','POSITIVE THINKING','IMAGERY']);
    } else if (currHeader === 'BODY') {
      setButtonLabels(['DIET','EXERCISE','STRESS MANAGEMENT']);
    } else if (currHeader === 'SPIRIT') {
      setButtonLabels(['FAITH','RELATIONSHIPS','FINDING MEANING','FOSTERING HOPE']);
    } else if (currHeader === 'TRINITY') {
      setButtonLabels([]);
      displayBrowsePage();
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
          <Text style={styles.headerText, { fontSize: headerFontSize, marginTop: headerTopMargin }}>{currHeader}</Text>
        </View>
      )}

      {/* Render the Module components when modules are displayed */}
      {displayedModules.length !== 0 && displayedModules.map((module, index) => (
        <Module key={index} module={module} /> // Render a Module component for each module
      ))}

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
    top: -20,
    left: -170,
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
    //fontFamily: 'PlusJakartaSans',
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
    top: headerTopMargin, // Adjust the top position as needed
    alignSelf: 'center',
  },
  headerText: {
    fontSize: headerFontSize,
    //fontFamily: 'PlusJakartaSansRegular',
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
    //fontFamily: 'PlusJakartaSansRegular',
    fontSize: 16,
  },
  module: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  moduleContainer: {
    flexDirection: 'row', // Arrange thumbnail and text horizontally
    backgroundColor: 'white', // Example bubble color
    padding: 10,
    marginVertical: 15,
    borderRadius: 5,
    width: width * 0.8, // Set the width of the bubble
  },
  moduleTextContainer: {
    flex: 1, // Take up remaining space in the bubble
    flexDirection: 'column', // Arrange text vertically
    justifyContent: 'space-between', // Space the text evenly
  },
  moduleThumbnail: {
    width: 50, // Adjust thumbnail size as needed
    height: 50, // Adjust thumbnail size as needed
    marginRight: 10, // Add spacing between thumbnail and text
    resizeMode: 'cover',
    borderRadius: 5,
  },
  moduleBoldText: {
    fontSize: 18,
    color: 'black',
    fontWeight: 'bold',
    //fontFamily: 'PlusJakartaSansRegular',
    marginBottom: 0,
  },
  moduleText: {
    fontSize: 16,
    color: 'black',
    //fontFamily: 'PlusJakartaSansRegular',
    marginBottom: 0,
  },
});
