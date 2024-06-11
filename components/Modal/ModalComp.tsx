import { Pressable, Text } from "react-native";
import { Modal } from "react-native-paper";
import { FontAwesome5 } from "@expo/vector-icons";
import { ReactNode } from "react";

type modalProp = {
  visible: boolean;
  children: ReactNode;
  onClose: Function;
  title?: string;
};

const ModalComp = ({ visible, children, onClose, title }: modalProp ) => {
  return (
    <Modal
      dismissable={false}
      visible={visible}
      onDismiss={() => onClose}
      contentContainerStyle={{
        backgroundColor: "white",
        margin: 15,
        borderRadius: 12,
        padding: 20,
        minHeight: 295,
        gap: 20,
      }}
    >
      <>
        {title != undefined && (
          <Text
          style={{
            fontWeight: "600",
            fontSize: 18,
            marginTop: 20,
            textAlign: "center"
          }}
          >
            {title}
          </Text>
        )}
        <Pressable style={{alignItems: "flex-end", position: "absolute", top: 15, right: 15}} onPress={() => onClose()}>
          <FontAwesome5 name="times" size={24} color="black" />
        </Pressable>
        {children}
      </>
    </Modal>
  );
};

export default ModalComp;
