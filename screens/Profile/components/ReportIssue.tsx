import React, { Dispatch, SetStateAction, useState } from "react";
import Layout from "../../../layouts/layout";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { colors } from "../../../constants/colors";
import CustomRadioButton from "../../../components/RadioButton/RadioButton";
import { Button, TextInput } from "react-native-paper";
import { ApiRequest } from "../../../services/ApiNetwork";

const ReportIssue = ({
  setPages,
}: {
  setPages: Dispatch<SetStateAction<number>>;
}) => {
  const { request } = ApiRequest();
  const [radioBtnChecked, setRadioBtnChecked] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [issue, setIssue] = useState({
    reasons: "",
    others: "",
  });

  const issues: { id: number; issue: string }[] = [
    {
      id: 1,
      issue: "I haven't gotten my salary",
    },
    {
      id: 2,
      issue: "Successful but not reflected",
    },
    {
      id: 3,
      issue: "Long time pending",
    },
    {
      id: 4,
      issue: "Failed and has not been resent",
    },
    {
      id: 5,
      issue: "Other Reasons",
    },
  ];

  const setBottomSheetFn = (item: string, index: number) => {
    if (radioBtnChecked !== index) {
      setRadioBtnChecked(index);
      setIssue({ ...issue, reasons: item });
    } else {
      setRadioBtnChecked(null);
      setIssue({ ...issue, reasons: "" });
    }
  };

  const handleSendReport = async () => {
    setLoading(true);
    const { others, reasons } = issue;

    let payload: any = {
      others,
      reasons,
    };

    if (others == "") {
      payload = { reasons };
    } else {
      payload = { reasons: others };
    }

    const resp = await request("POST", {
      url: "/rider/orders/cancel-order",
      payload: payload,
    });

    if (resp.status === "success") {
      setLoading(false);
      alert("message here");
    }
  };

  return (
    <Layout>
      <Layout.Header back={() => setPages(0)} />
      <Text style={[styles.headerText, { padding: 20 }]}>Report an Issue</Text>
      <Layout.ScrollView>
        {issues.map((item, index) => (
          <Pressable
            key={item.id}
            onPress={() => {
              setBottomSheetFn(item.issue, item.id);
            }}
            style={{
              marginBottom: 5,
              paddingBottom: 10,
              borderBottomWidth: 1,
              borderBottomColor: "#ededed",
            }}
          >
            <View
              style={{
                alignItems: "center",
                flexDirection: "row",
                gap: 20,
              }}
            >
              <Text
                style={{
                  fontWeight: "500",
                  fontSize: 16,
                  flex: 1,
                  color: "#475467",
                }}
              >
                {item.issue}
              </Text>
              <CustomRadioButton
                value={item.id}
                selected={radioBtnChecked === item.id}
                onSelect={() => {
                  setBottomSheetFn(item.issue, item.id);
                }}
              />
            </View>
          </Pressable>
        ))}

        {issue.reasons === "Other Reasons" && (
          <>
            <Text
              style={{
                fontWeight: "500",
                fontSize: 16,
                flex: 1,
                color: "#475467",
              }}
            >
              Other complaint? Type your complain here
            </Text>
            <TextInput
              value={issue.others}
              onChangeText={(state) => setIssue({ ...issue, others: state })}
              multiline={true}
              numberOfLines={3}
              //   placeholder="Please describe the problem"
              outlineColor={colors.inputBorder}
              activeOutlineColor={colors.primary + "99"}
              activeUnderlineColor="#00000000"
              placeholderTextColor="#667085"
              outlineStyle={{ borderRadius: 15 }}
              mode="outlined"
              style={{
                backgroundColor: colors.inputBackground,
                color: colors.primary,
                height: 150,
              }}
            />
          </>
        )}

        <Button
          style={{ borderRadius: 10, padding: 3, marginTop: 10 }}
          labelStyle={{ fontWeight: "bold", flex: 1 }}
          buttonColor={colors.primary}
          mode="contained"
          textColor="white"
          onPress={handleSendReport}
          disabled={loading}
          loading={loading}
        >
          Send Report
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
    // textAlign: "center",
  },
  headerContainer: {
    position: "relative",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    marginTop: 12,
  },
});

export default ReportIssue;
