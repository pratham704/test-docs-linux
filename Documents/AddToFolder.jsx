import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  FlatList,
  Modal,
} from "react-native";
import { MaterialIcons, AntDesign, FontAwesome } from "@expo/vector-icons";
import axios from "axios";
import { baseUrl } from "../api/BaseUrl";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message"; // Import Toast
import { useNavigation } from "@react-navigation/native";
import SkeletonLoaderDocument from "../components/Skleton/SkeletonLoaderDocument";

export default function AddToFolder({ imageUrl }) {
  const nav = useNavigation();
  const [folders, setFolders] = useState([]);
  const [selectedFolders, setSelectedFolders] = useState([]);
  const [folderName, setFolderName] = useState("");
  const [description, setDescription] = useState("");
  const [creatingFolder, setCreatingFolder] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false); // State for loading

  useEffect(() => {
    fetchFolders();
  }, []);

  const fetchFolders = async () => {

    setLoading(true)
    const token = await AsyncStorage.getItem("access_token");

    try {
      const response = await axios.get(`${baseUrl}/api/v1/folder/myFolders`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      setFolders(response.data.folders);
      setLoading(false)
    } catch (error) {
      Alert.alert("Error", "Failed to fetch folders. Try again.");
    }
  };

  const handleCreateFolder = async () => {
    if (!folderName) {
      Alert.alert("Folder Name Required", "Please enter a folder name.");
      return;
    }
    setCreatingFolder(true);
    const token = await AsyncStorage.getItem("access_token");

    try {
      setLoading(true); // Start loading
      const response = await axios.post(
        `${baseUrl}/api/v1/folder/addImageToFolder`,
        { folderName, imageUrl, description },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      // Alert.alert(
      //   "Success",
      //   `Image added to folder: ${folderName}\nDescription: ${description}`
      // );

      Toast.show({
        type: "success",
        text1: "Image Uploaded",
        text2: `Image added to folder: ${folderName}\nDescription: ${description}`,
        position: "bottom",
      });
      setFolderName("");
      setDescription("");
      setShowModal(false);
      fetchFolders();
      nav.navigate("MyDocuments");
    } catch (error) {
      Alert.alert("Error", "Failed to create folder. Try again.");
    } finally {
      setLoading(false); // End loading
      setCreatingFolder(false);
    }
  };

  const handleSubmit = async () => {
    if (selectedFolders.length === 0) {
      Alert.alert(
        "Select a Folder",
        "Please select at least one folder to add the image."
      );
      return;
    }

    const token = await AsyncStorage.getItem("access_token");

    try {
      setLoading(true); // Start loading
      await axios.post(
        `${baseUrl}/api/v1/folder/addImageToFolder`,
        { folderName: selectedFolders, imageUrl, description },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      Toast.show({
        type: "success",
        text1: "Image Uploaded",
        text2: `Image added to folders: ${selectedFolders.join(", ")}`,
        position: "bottom",
      });
      setDescription("");
      setSelectedFolders([]);
      fetchFolders();
      nav.navigate("MyDocuments");
    } catch (error) {
      Alert.alert("Error", "Failed to add image to folders. Try again.");
    } finally {
      setLoading(false); // End loading
    }
  };

  const toggleFolderSelection = (folderName) => {
    if (selectedFolders.includes(folderName)) {
      setSelectedFolders(selectedFolders.filter((name) => name !== folderName));
    } else {
      setSelectedFolders([...selectedFolders, folderName]);
    }
  };

  const renderFolderItem = ({ item }) => {
    const isSelected = selectedFolders.includes(item.folderName);
    return (
      <TouchableOpacity
        style={[styles.folderItem, isSelected && styles.selectedFolder]}
        onPress={() => toggleFolderSelection(item.folderName)}
      >
        <MaterialIcons name="folder" size={24} color="#FFC107" />
        <Text style={styles.folderName}>
          {item.folderName} ({item.count} items)
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add Image to Folder</Text>

      {loading ? (
        <SkeletonLoaderDocument /> // Show Skeleton Loader if loading
      ) : (
        <FlatList
          data={folders}
          renderItem={renderFolderItem}
          keyExtractor={(item) => item.folderName}
          contentContainerStyle={styles.folderList}
        />
      )}

      <TouchableOpacity
        style={styles.createButton}
        onPress={() => setShowModal(true)}
      >
        <AntDesign name="pluscircle" size={24} color="#121212" />
      </TouchableOpacity>

      {selectedFolders.length > 0 && (
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <FontAwesome name="upload" size={24} color="#121212" />
          <Text style={styles.submitButtonText}>
            Add Image to Selected Folders
          </Text>
        </TouchableOpacity>
      )}

      <TextInput
        style={styles.descriptionInput}
        placeholder="Enter Description"
        placeholderTextColor="#777"
        value={description}
        onChangeText={setDescription}
      />

      <Modal visible={showModal} animationType="slide">
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Create New Folder</Text>
          <TextInput
            style={styles.modalInput}
            placeholder="Enter Folder Name"
            placeholderTextColor="#777"
            value={folderName}
            onChangeText={setFolderName}
          />
          <TouchableOpacity
            style={styles.createFolderButton}
            onPress={handleCreateFolder}
            disabled={creatingFolder}
          >
            <Text style={styles.createFolderButtonText}>
              {creatingFolder ? "Creating..." : "Create Folder"}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setShowModal(false)}
          >
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
    padding: 20,
  },
  title: {
    color: "#FFF",
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  folderList: {
    marginBottom: 20,
  },
  folderItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1E1E1E",
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    elevation: 2, // Add shadow for Android
    shadowColor: '#000', // Add shadow for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  selectedFolder: {
    backgroundColor: "#03DAC5", // Change this to your desired selected color
  },
  folderName: {
    color: "#FFF",
    marginLeft: 12,
    fontSize: 16,
  },
  createButton: {
    position: "absolute",
    top: 40,
    right: 20,
    backgroundColor: "#FFC107",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    elevation: 3,
  },
  descriptionInput: {
    backgroundColor: "#1E1E1E",
    color: "#FFF",
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  submitButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#03DAC5",
    padding: 12,
    borderRadius: 8,
    position: "absolute",
    right: 20,
    bottom: 80,
    elevation: 3,
  },
  submitButtonText: {
    color: "#121212",
    fontWeight: "bold",
    marginLeft: 8,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "#121212",
    padding: 20,
    justifyContent: "center",
  },
  modalTitle: {
    color: "#FFF",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  modalInput: {
    backgroundColor: "#1E1E1E",
    color: "#FFF",
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  createFolderButton: {
    backgroundColor: "#03DAC5",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    elevation: 3,
  },
  createFolderButtonText: {
    color: "#121212",
    fontWeight: "bold",
  },
  closeButton: {
    backgroundColor: "#FF5722",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
    elevation: 3,
  },
  closeButtonText: {
    color: "#FFF",
    fontWeight: "bold",
  },
});
