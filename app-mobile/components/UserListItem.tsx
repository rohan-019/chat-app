import {
  StyleSheet,
  TouchableNativeFeedback,
  View,
  ActivityIndicator,
  Platform,
  TouchableOpacity,
} from "react-native";
import React from "react";
import themes from "../constants/themes";
import useMode from "../hooks/useMode";
import { useRouter } from "expo-router";
import Avatar from "./Avatar";
import Typography from "./Typography";
import { IChat, IUser } from "../types";
import axios from "../utils/axiosConfig";
import Constants from "expo-constants";

type IUserListItem = {
  isLast: boolean;
  user: IUser;
};

const UserListItem = (props: IUserListItem) => {
  const { user, isLast } = props;
  const mode = useMode();
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);
  const [createdChat, setCreatedChat] = React.useState<IChat | null>(null);
  const apiUrl = Constants.expoConfig?.extra?.apiUrl;

  const goToChat = async () => {
    setLoading(true);

    try {
      const response = await axios.post(
        `${apiUrl}/chats/private`,
        {
          userId: user._id,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        setCreatedChat(response.data.chat);
      }
    } catch (error) {
      // console.log(error);
    }

    setLoading(false);
  };

  React.useEffect(() => {
    if (createdChat) {
      router.push(`/chats/${createdChat._id}`);
    }
    setCreatedChat(null);
  }, [createdChat]);

  return (
    <TouchableOpacity
      onPress={goToChat}
      disabled={loading}
      activeOpacity={0.7}
    >
      <View
        style={[
          styles.container,
          {
            borderBottomWidth: isLast ? 0 : 1,
            borderBottomColor: themes[mode].colors.chatListItemBorder,
          },
        ]}
      >
        <Avatar uri={user.photoURL} size={48} />

        <View style={styles.center}>
          <Typography variant="h3" textProps={{ numberOfLines: 1 }}>
            {user.username}
          </Typography>

          <View style={{ height: 2 }} />

          <Typography variant="body1" textProps={{ numberOfLines: 1 }}>
            {user.email}
          </Typography>
        </View>

        <View>
          {loading && (
            <ActivityIndicator
              size="small"
              color={themes[mode].colors.highlight}
            />
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default UserListItem;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    padding: 10,
    paddingVertical: 15,
  },

  center: {
    flex: 1,
    paddingHorizontal: 20,
  },
});
