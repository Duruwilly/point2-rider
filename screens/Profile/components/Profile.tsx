import React, { Dispatch, SetStateAction, useState } from "react";
import User from "../../../assets/icon/user.svg";
import Card from "../../../assets/icon/card.svg";
import Warning from "../../../assets/icon/warning.svg";
import Layout from "../../../layouts/layout";
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { colors } from "../../../constants/colors";
import { FontAwesome, MaterialIcons, Entypo } from "@expo/vector-icons";
import { ApiRequest } from "../../../services/ApiNetwork";
import * as ImagePicker from "expo-image-picker";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../store/store";
import {
  clearUser,
  setIsAuthentication,
} from "../../../store/reducers/users-reducer";
import { useNavigation } from "@react-navigation/native";
import { Button } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFetchUser } from "services/fetchUser";

const Profile = ({
  setPages,
}: {
  setPages: Dispatch<SetStateAction<number>>;
}) => {
  const { request } = ApiRequest();
  const { user } = useSelector((state: RootState) => state.user);
  const [image, setImage] = useState(user?.profile_picture);
  const dispatch = useDispatch();
  const navigation: any = useNavigation();
  const { fetchUser } = useFetchUser();
  const buttons = [
    {
      id: 1,
      icon: <User />,
      name: "Edit Details",
      link: "login",
    },
    {
      id: 2,
      icon: <Card />,
      name: "Manage Bank Account",
    },
    {
      id: 0,
      icon: <Warning />,
      name: "Privacy & Policy",
    },
    {
      id: 4,
      icon: <Warning />,
      name: "Help & Support",
    },
    // {
    //   id: 5,
    //   icon: (
    //     <MaterialIcons name="report-gmailerrorred" size={24} color="#667085" />
    //   ),
    //   name: "Report an Issue",
    // },
  ];

  const uploadImage = (image: string, mime: string | undefined) => {
    (async () => {
      try {
        let form: any = new FormData();
        form.append("profile_picture", {
          uri: image,
          type: mime,
          name: "profile_picture",
        });
        const resp = await request("POST", {
          url: "/profile/upload-photo",
          payload: form,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        if (resp.status === "success") {
          await fetchUser();
          alert(resp.data.message);
        }
      } catch (error) {
        console.log("error uploadig", error);
      }
    })();
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem("access_token");
    dispatch(clearUser());
    dispatch(setIsAuthentication(false));
    navigation.navigate("welcome");
  };

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 4],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      uploadImage(result.assets[0].uri, result.assets[0].mimeType);
    }
  };

  return (
    <Layout>
      <Text style={[styles.headerText, { paddingTop: 20 }]}>Profile</Text>
      <Layout.ScrollView>
        <View style={styles.profileContainer}>
          <Pressable onPress={pickImage} style={styles.imageContainer}>
            <Image
              style={styles.image}
              source={
                image === "" || image === undefined
                  ? require("../../../assets/images/no-img.png")
                  : { uri: image }
              }
            />
            <View style={styles.iconContainer}>
              <FontAwesome name="camera" size={24} color="#0077B6" />
            </View>
          </Pressable>

          <View style={styles.userInfo}>
            <Text style={styles.userName}>
              {user?.first_name} {user?.last_name}
            </Text>
            <Text style={styles.userEmail}>{user?.email}</Text>
          </View>
        </View>

        <View style={styles.buttonsContainer}>
          {buttons.map((item) => {
            return (
              <TouchableOpacity
                key={item.id}
                onPress={() => setPages(item.id)}
                style={styles.button}
              >
                <View style={styles.buttonContent}>
                  {item.icon}
                  <Text style={styles.buttonText}>{item.name}</Text>
                </View>
                <MaterialIcons
                  name="arrow-forward-ios"
                  size={15}
                  color="#667085"
                />
              </TouchableOpacity>
            );
          })}
        </View>
        <Button
          style={{ borderRadius: 10, padding: 3 }}
          labelStyle={{ fontWeight: "bold", flex: 1 }}
          buttonColor="#F2DCDD"
          mode="contained"
          textColor="#EB5757"
          onPress={handleLogout}
        >
          Log out
        </Button>
      </Layout.ScrollView>
    </Layout>
  );
};

const styles = StyleSheet.create({
  headerText: {
    color: colors.darkGrey,
    fontWeight: "bold",
    fontSize: 24,
    textAlign: "center",
  },
  profileContainer: {
    flexDirection: "row",
    alignItems: "center",
    // justifyContent: "flex-start",
    // width: "100%",
    // marginTop: 20,
  },
  imageContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    resizeMode: "cover",
    // padding: 12,
    overflow: "hidden",
    position: "relative",
    alignSelf: "center",
  },
  image: {
    height: "100%",
    width: "100%",
    backgroundColor: "#eee",
  },
  iconContainer: {
    position: "absolute",
    bottom: 7,
    right: 7,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 4,
  },
  userInfo: {
    marginLeft: 20,
  },
  userName: {
    fontSize: 18,
    color: "#1D2939",
    fontWeight: "bold",
  },
  userEmail: {
    fontSize: 14,
    color: "#475467",
    fontWeight: "500",
    paddingTop: 5,
  },
  packageContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    height: 114,
    backgroundColor: "#FBF1D2",
    borderRadius: 8,
    marginTop: 32,
    paddingLeft: 12,
  },
  packageInfo: {
    flex: 1,
    alignItems: "flex-start",
    justifyContent: "center",
    paddingVertical: 8,
  },
  packageText: {
    fontSize: 13,
    color: "#1D2939",
    fontWeight: "500",
  },
  packageCount: {
    fontSize: 18,
    color: "#1D2939",
    fontWeight: "bold",
    paddingTop: 8,
  },
  giftContainer: {
    flex: 1,
    alignItems: "flex-end",
    justifyContent: "center",
    marginBottom: -15,
  },
  buttonsContainer: {
    alignItems: "center",
    justifyContent: "flex-start",
    width: "100%",
    marginTop: 32,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    height: 45,
    backgroundColor: "#F9FAFB",
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 20,
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  buttonText: {
    fontSize: 16,
    color: "#1D2939",
    fontWeight: "500",
    marginLeft: 12,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: 45,
    backgroundColor: "#F2DCDD",
    paddingHorizontal: 16,
    borderRadius: 8,
    marginTop: 32,
  },
  logoutText: {
    fontSize: 18,
    color: "#EB5757",
    fontWeight: "bold",
    marginRight: 12,
  },
});

export default Profile;
