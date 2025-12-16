import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Platform,
  Text,
  TextInput,
  ToastAndroid,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

const showToast = (message: string) => {
  if (Platform.OS === "android") {
    ToastAndroid.show(message, ToastAndroid.SHORT);
  } else {
    Alert.alert("", message);
  }
};

export default function DetailScreen() {
  const { image }: any = useLocalSearchParams();
  const isDark = useColorScheme() === "dark";
  const [aspectRatio, setAspectRatio] = useState(1);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    first: "",
    last: "",
    email: "",
    phone: "",
  });

  const inputBg = isDark ? "#1E1E1E" : "#FFFFFF";
  const inputText = isDark ? "#FFFFFF" : "#000000";
  const placeholderColor = isDark ? "#9CA3AF" : "#6B7280";
  const labelColor = isDark ? "#FFFFFF" : "#000000";
  const borderColor = isDark ? "#374151" : "#D1D5DB";
  const cardBg = isDark ? "#121212" : "#F2F2F2";

  useEffect(() => {
    if (image) {
      Image.getSize(
        image,
        (width, height) => setAspectRatio(width / height),
        (err: any) => console.log("Image size error:", err)
      );
    }
  }, [image]);

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

  const submit = async () => {
    console.log("SUBMIT STARTED ");

    if (!validate()) {
      console.log("❌ VALIDATION FAILED");
      return;
    }
    // console.log(" VALIDATION PASSED");

    setLoading(true);

    try {
      // console.log("FORM VALUES");
      // console.log("First Name:", form.first);
      // console.log("Last Name:", form.last);
      // console.log("Email:", form.email);
      // console.log("Phone:", form.phone);
      // console.log("Image URI:", image);

      const formData = new FormData();
      // console.log("FormData CREATED");

      formData.append("first_name", form.first.trim());
      formData.append("last_name", form.last.trim());
      formData.append("email", form.email.trim());
      formData.append("phone", form.phone.trim());

      // console.log("TEXT FIELDS APPENDED");

      // 4️⃣ Image attachment
      if (image) {
        const filename = image.split("/").pop() || "photo.jpg";
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1]}` : "image/jpeg";

        // console.log("IMAGE DETAILS");
        // console.log("Filename:", filename);
        // console.log("Type:", type);

        formData.append("user_image", {
          uri: image,
          name: filename,
          type,
        } as any);

        // console.log("IMAGE APPENDED TO FORMDATA");
      } else {
        console.log("⚠️ NO IMAGE FOUND");
      }

      // 5️⃣ API call
      // console.log(" API REQUEST STARTED");

      const response = await fetch(
        "https://dev3.xicomtechnologies.com/xttest/savedata.php",
        {
          method: "POST",
          body: formData,
        }
      );

      // console.log("HTTP STATUS:", response.status);

      const rawText = await response.text();
      // console.log(" RAW API RESPONSE:", rawText);

      let result;
      try {
        result = JSON.parse(rawText);
        // console.log(" PARSED RESPONSE:", result);
      } catch (e) {
        console.log("JSON PARSE ERROR:", e);
        showToast("Invalid server response");
        return;
      }

      if (result.status === "success") {
        console.log(" SUBMISSION SUCCESS");
        showToast("Form submitted successfully!");
        router.back();
      } else {
        console.log(" API FAILURE MESSAGE:", result.message);
        showToast(result.message || "Submission failed");
      }
    } catch (error) {
      console.log(" FETCH / UPLOAD ERROR:", error);
      showToast("Something went wrong");
    } finally {
      setLoading(false);
      // console.log("SUBMIT FINISHED");
    }
  };

  return (
    <KeyboardAwareScrollView
      enableOnAndroid
      keyboardDismissMode="on-drag"
      keyboardShouldPersistTaps="handled"
      extraScrollHeight={Platform.OS === "android" ? 120 : 80}
      contentContainerStyle={{ flexGrow: 1 }}
      style={{ backgroundColor: cardBg }}
    >
      <View className="flex-1 px-4 pb-10">
        <Image
          source={{ uri: image }}
          resizeMode="contain"
          className="w-full rounded-lg mb-4"
          style={{ aspectRatio }}
        />

        <View className="rounded-lg p-4">
          <Text
            style={{ color: labelColor }}
            className="text-lg font-semibold mb-2"
          >
            First Name
          </Text>
          <TextInput
            placeholder="Enter your first name"
            placeholderTextColor={placeholderColor}
            style={{ backgroundColor: inputBg, color: inputText, borderColor }}
            className="border rounded-full px-4 py-3 mb-4"
            onChangeText={(t) => setForm({ ...form, first: t })}
          />

          <Text
            style={{ color: labelColor }}
            className="text-lg font-semibold mb-2"
          >
            Last Name
          </Text>
          <TextInput
            placeholder="Enter your last name"
            placeholderTextColor={placeholderColor}
            style={{ backgroundColor: inputBg, color: inputText, borderColor }}
            className="border rounded-full px-4 py-3 mb-4"
            onChangeText={(t) => setForm({ ...form, last: t })}
          />

          <Text
            style={{ color: labelColor }}
            className="text-lg font-semibold mb-2"
          >
            Email
          </Text>
          <TextInput
            placeholder="Enter your email address"
            placeholderTextColor={placeholderColor}
            keyboardType="email-address"
            style={{ backgroundColor: inputBg, color: inputText, borderColor }}
            className="border rounded-full px-4 py-3 mb-4"
            onChangeText={(t) => setForm({ ...form, email: t })}
          />

          <Text
            style={{ color: labelColor }}
            className="text-lg font-semibold mb-2"
          >
            Phone
          </Text>
          <TextInput
            placeholder="Enter phone number"
            placeholderTextColor={placeholderColor}
            keyboardType="number-pad"
            maxLength={10}
            style={{ backgroundColor: inputBg, color: inputText, borderColor }}
            className="border rounded-full px-4 py-3 mb-6"
            onChangeText={(t) => setForm({ ...form, phone: t })}
          />

          <TouchableOpacity
            className={`py-3 rounded-xl items-center ${
              loading ? "bg-blue-300" : "bg-blue-500"
            }`}
            onPress={submit}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text className="text-white text-base font-semibold">Submit</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAwareScrollView>
  );
}
