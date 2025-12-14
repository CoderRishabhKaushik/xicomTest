import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  Image,
  Platform,
  Pressable,
  Text,
  TextInput,
  ToastAndroid,
  useColorScheme,
  View,
} from "react-native";

import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

const showToast = (message: string) => {
  if (Platform.OS === "android") {
    ToastAndroid.show(message, ToastAndroid.SHORT);
  } else {
    Alert.alert("", message); // iOS fallback
  }
};

export default function DetailScreen() {
  const { image }: any = useLocalSearchParams();
  const isDark = useColorScheme() === "dark";

  const [aspectRatio, setAspectRatio] = useState(1);

  const [form, setForm] = useState({
    first: "",
    last: "",
    email: "",
    phone: "",
  });

  useEffect(() => {
    if (image) {
      Image.getSize(
        image,
        (width, height) => setAspectRatio(width / height),
        (err) => console.log("Image size error:", err)
      );
    }
  }, [image]);

  // Validation
  const validate = () => {
    const first = form.first.trim();
    const last = form.last.trim();
    const email = form.email.trim();
    const phone = form.phone.trim();

    const nameRegex = /^[A-Za-z]+$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9]{10}$/;

    if (!first) {
      showToast("Please fill the first name");
      return false;
    } else if (!nameRegex.test(first)) {
      showToast("First name must contain only letters");
      return false;
    }

    if (!last) {
      showToast("Please fill the last name");
      return false;
    } else if (!nameRegex.test(last)) {
      showToast("Last name must contain only letters");
      return false;
    }

    if (!email) {
      showToast("Please fill the email");
      return false;
    } else if (!emailRegex.test(email)) {
      showToast("Please enter a valid email");
      return false;
    }

    if (!phone) {
      showToast("Please fill the phone number");
      return false;
    } else if (!phoneRegex.test(phone)) {
      showToast("Phone must be 10 digits");
      return false;
    }

    return true;
  };

  // Submit function now logs data instead of calling API
  const submit = () => {
    if (!validate()) return;

    // Log form data + image to console
    console.log("Form Data Submitted:");
    console.log({
      first_name: form.first.trim(),
      last_name: form.last.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      user_image: image,
    });

    showToast("Form submitted successfully!");
    // Optionally go back
    router.back();
  };

  return (
    <KeyboardAwareScrollView
      enableOnAndroid
      keyboardDismissMode="on-drag"
      keyboardShouldPersistTaps="handled"
      extraScrollHeight={Platform.OS === "android" ? 120 : 80}
      contentContainerStyle={{ flexGrow: 1 }}
      className={`${isDark ? "bg-[#121212]" : "bg-[#F2F2F2]"} `}
    >
      <View className="flex-1 px-4 pb-10">
        {/* Image */}
        <Image
          source={{ uri: image }}
          resizeMode="contain"
          className="w-full rounded-lg mb-4"
          style={{ aspectRatio }}
        />

        {/* Form Container */}
        <View className="rounded-lg p-4 ">
          {/* First Name */}
          <Text className="text-lg font-semibold mb-2">First Name</Text>
          <TextInput
            placeholder="Enter your first name"
            placeholderTextColor="gray"
            className="border border-gray-300 rounded-full px-3 py-3 mb-4 text-black  bg-white"
            onChangeText={(t) => setForm({ ...form, first: t })}
          />

          {/* Last Name */}
          <Text className="text-lg font-semibold mb-2">Last Name</Text>
          <TextInput
            placeholder="Enter your last name"
            placeholderTextColor="gray"
            className="border border-gray-300 rounded-full px-3 py-3 mb-4 text-black  bg-white"
            onChangeText={(t) => setForm({ ...form, last: t })}
          />

          {/* Email */}
          <Text className="text-lg font-semibold mb-2">Email</Text>
          <TextInput
            placeholder="Enter your email address"
            placeholderTextColor="gray"
            keyboardType="email-address"
            className="border border-gray-300 rounded-full px-3 py-3 mb-4 text-black  bg-white"
            onChangeText={(t) => setForm({ ...form, email: t })}
          />

          {/* Phone */}
          <Text className="text-lg font-semibold mb-2">Phone</Text>
          <TextInput
            placeholder="Enter phone number"
            placeholderTextColor="gray"
            keyboardType="number-pad"
            maxLength={10}
            className="border border-gray-300 rounded-full px-3 py-3 mb-4 text-black  bg-white"
            onChangeText={(t) => setForm({ ...form, phone: t })}
          />

          {/* Submit */}
          <Pressable
            className="bg-blue-500 py-3 rounded-xl  items-center mb-10"
            onPress={submit}
          >
            <Text className="text-white text-base font-semibold">Submit</Text>
          </Pressable>
        </View>
      </View>
    </KeyboardAwareScrollView>
  );
}
