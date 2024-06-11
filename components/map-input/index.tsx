import { Dispatch, SetStateAction, useState } from "react";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { GOOGLE_PLACES_API_KEY } from "../../constants/app";

const GooglePlaceInput = ({
  onSelectPlace,
  closeBottomSheet
}: {
  onSelectPlace: (details: any) => void;
  closeBottomSheet: Dispatch<SetStateAction<boolean>>
}) => {
  const apiKey = GOOGLE_PLACES_API_KEY;

  return (
    <GooglePlacesAutocomplete
    query={{
        key: apiKey,
        language: "en",
        components: "country:ng",
      }}
      styles={{
        textInputContainer: {
          width: "100%",
        },
        textInput: {
          height: 40,
          borderWidth: 1,
          borderRadius: 5,
          borderColor: "#D0D5DD",
          paddingHorizontal: 16,
        },
      }}
      fetchDetails={true}
      placeholder="Search"
      enableHighAccuracyLocation={true}
      keyboardShouldPersistTaps="handled"
      onPress={(data, details = null) => {
        if (details) {
          onSelectPlace(details);
          closeBottomSheet(false)
        } else {
          console.error("No details available for selected place");
        }
      }}
      GooglePlacesSearchQuery={{
        rankby: "distance",
      }}
      listViewDisplayed="auto"
      debounce={200}
    />
  );
};

export default GooglePlaceInput;
