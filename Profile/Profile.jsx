import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
import {
  MaterialIcons,
  Feather,
  FontAwesome5,
  Ionicons,
  Entypo,
} from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
// import { uploadImageToServer } from "../../../utils/helper/uploadImage";
import AsyncStorage from "@react-native-async-storage/async-storage"; // Import AsyncStorage
import { useFocusEffect } from "@react-navigation/native"; // Import useFocusEffect
import { baseUrl } from "../api/BaseUrl";
import axios from "axios";
import SkeletonLoader from "../components/Skleton/ProfileSkleton";

const Profile = () => {
  const [profileImage, setProfileImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [userData, setUserData] = useState(null); // State to hold user details

  // Function to fetch user details
  const getUserDetails = async () => {
    const token = await AsyncStorage.getItem("access_token"); // Get access token from AsyncStorage
    if (token) {
      try {
        setIsLoading(true)
        const response = await fetch(`${baseUrl}/api/v1/profile`, { // Replace with your API URL
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`, // Set bearer token in headers
            "Content-Type": "application/json",
          },
        });
        const data = await response.json();
        if (data.success) {
          setUserData(data.message.user); // Update state with user details
          setIsLoading(false)
        } else {
          Alert.alert("Error", "Failed to fetch user details");
        }
      } catch (error) {
        Alert.alert("Error", error.message || "An error occurred");
      }
    }
  };

  // Fetch user details when the component is focused
  useFocusEffect(
    React.useCallback(() => {
      getUserDetails(); // Call function to fetch user details
    }, [])
  );


  const selectImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
  
    if (!result.canceled) {
      setIsLoading(true); // Start loading state
  
      const formData = new FormData();
      formData.append('file', {
        uri: result.assets[0].uri,
        name: result.assets[0].uri.split('/').pop(), // Extract the filename
        type: result.assets[0].type, // Get the file type
      });
  
      try {
        const token = await AsyncStorage.getItem("access_token"); // Get the access token from AsyncStorage
        const response = await axios.post(
          `${baseUrl}/api/v1/profile/updateProfilePicture`, // Replace with your actual API endpoint
          formData,
          {
            headers: {
              'Authorization': `Bearer ${token}`, // Include the token in the header
              'Content-Type': 'multipart/form-data', // Specify the content type
            },
          }
        );
  
        // Handle success response
        if (response.data.success) {
          console.log(response.data)
          setProfileImage(response.data.data.profileUrl); 
          // Alert.alert("Success", "Profile picture updated successfully");
        } else {
          Alert.alert("Error", response.data.message || "Failed to update profile picture");
        }
      } catch (error) {
        console.error('Error uploading profile picture:', error);
        Alert.alert("Error", error.response?.data?.message || "Something went wrong while uploading");
      } finally {
        setIsLoading(false); // Stop loading state
      }
    }
  };
  
  return (
    <ScrollView style={styles.container}>
    {/* Profile Header */}
    <View style={styles.profileHeader}>
      <TouchableOpacity onPress={selectImage}>
        {isLoading ? (
          <SkeletonLoader /> // Show the skeleton loader when loading
        ) : (
          <>
            <Image
              source={
                profileImage
                  ? { uri: profileImage }
                  : { uri: userData?.profileUrl || "https://example.com/defaultProfile.png" }
              }
              style={styles.profileImage}
            />
            <View style={styles.cameraIconWrapper}>
              <FontAwesome5 name="camera" size={16} color="#ffffff" />
            </View>
          </>
        )}
      </TouchableOpacity>
      <Text style={styles.profileName}>{userData?.name || "Loading..."}</Text>
      <View style={styles.membershipRow}>
        <Text style={styles.membershipText}>{userData?.status || "Loading..."}</Text>
      </View>
    </View>

    {/* Profile Information */}
    <View style={styles.infoSection}>
      <View style={styles.infoRow}>
        <MaterialIcons name="email" size={24} color="white" />
        <Text style={styles.infoText}>{userData?.email || "Loading..."}</Text>
      </View>
      <View style={styles.divider} />
      <View style={styles.infoRow}>
        <Feather name="calendar" size={24} color="white" />
        <Text style={styles.infoText}>
          Joined: {userData?.createdAt ? new Date(userData.createdAt).toLocaleDateString() : "Loading..."}
        </Text>
      </View>
      <View style={styles.divider} />
      <View style={styles.infoRow}>
        <FontAwesome5 name="folder" size={24} color="white" />
        <Text style={styles.infoText}>Folders: {userData?.folders || "None...(free plan)"}</Text>
      </View>
    </View>

    {/* Settings Section */}
    <View style={styles.settingsSection}>
      <View style={styles.settingsRow}>
        <Feather name="settings" size={24} color="white" />
        <Text style={styles.settingsText}>Settings</Text>
      </View>
      <View style={styles.settingsRow}>
        <Entypo name="bell" size={24} color="white" />
        <Text style={styles.settingsText}>Notifications</Text>
      </View>
    </View>

    {/* Custom Action Button */}
    <TouchableOpacity style={styles.actionButton}>
      <Text style={styles.actionButtonText}>Upgrade to Premium</Text>
      <FontAwesome5
        name="crown"
        size={16}
        color="white"
        style={{ marginLeft: 10 }}
      />
    </TouchableOpacity>
  </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212", // Full dark mode background
  },
  profileHeader: {
    alignItems: "center",
    marginBottom: 30,
    paddingTop: 20,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: "gold",
  },
  cameraIconWrapper: {
    position: "absolute",
    bottom: 0,
    right: 5,
    backgroundColor: "#333",
    padding: 5,
    borderRadius: 20,
  },
  profileName: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 12,
  },
  membershipRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
  },
  membershipText: {
    color: "gold",
    fontSize: 14,
    marginLeft: 6,
  },
  infoSection: {
    backgroundColor: "#1E1E1E", // Darker card background for info section
    borderRadius: 12,
    paddingVertical: 15,
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  infoText: {
    color: "white", // White for high contrast on dark mode
    fontSize: 16,
    marginLeft: 12,
  },
  divider: {
    height: 1,
    backgroundColor: "#333",
    marginVertical: 10,
  },
  settingsSection: {
    marginVertical: 20,
    backgroundColor: "#1E1E1E",
    borderRadius: 12,
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  settingsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  settingsText: {
    color: "white",
    fontSize: 16,
  },
  actionButton: {
    flexDirection: "row",
    backgroundColor: "#FFC107",
    paddingVertical: 12,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 20,
    marginHorizontal: 40,
  },
  actionButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default Profile;
