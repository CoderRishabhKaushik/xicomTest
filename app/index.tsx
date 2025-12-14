import { Image } from "expo-image";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  Text,
  useColorScheme,
  View,
} from "react-native";
export default function HomeScreen() {
  const isDark = useColorScheme() === "dark";

  const [data, setData] = useState<any[]>([]);
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const fetchImages = async (pageOffset: number, replace = false) => {
    if (loading || !hasMore) return;

    try {
      setLoading(true);

      const url = `http://dev3.xicomtechnologies.com/xttest/getdata.php?user_id=108&offset=${pageOffset}&type=popular`;

      const res = await fetch(url);
      const json = await res.json();

      const newImages = json?.images ?? [];

      if (newImages.length === 0) {
        setHasMore(false);
        return;
      }

      setData((prev) => {
        if (replace) return newImages;
        const ids = new Set(prev.map((i) => i.id));
        const unique = newImages.filter((item: any) => !ids.has(item.id));
        return [...prev, ...unique];
      });

      if (newImages.length < 10) {
        setHasMore(false);
      }
    } catch (e) {
      console.log("Fetch error:", e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchImages(0);
  }, []);

  const loadMore = () => {
    const next = offset + 1;
    setOffset(next);
    fetchImages(next);
  };

  const onRefresh = () => {
    setRefreshing(true);
    setOffset(0);
    setHasMore(true);
    fetchImages(0, true); // replace current data
  };
  const renderItem = ({ item }: any) => (
    <Pressable
      className="mb-4"
      onPress={() =>
        router.push({
          pathname: "/detail",
          params: { image: item.xt_image },
        })
      }
    >
      <Image
        source={{ uri: item.xt_image }}
        className="w-full rounded-lg"
        contentFit="contain"
        transition={300}
        cachePolicy="memory-disk"
        style={{ width: "100%", aspectRatio: 1 }}
      />
    </Pressable>
  );

  return (
    <View className={`flex-1 ${isDark ? "bg-[#121212]" : "bg-[#F2F2F2]"}`}>
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingHorizontal: 16 }}
        refreshing={refreshing}
        onRefresh={onRefresh}
        ListFooterComponent={() =>
          hasMore ? (
            <View className="mb-20 items-center">
              <Pressable
                onPress={loadMore}
                disabled={loading}
                className={`
          flex-row items-center justify-center
          px-8 py-3 rounded-full
          ${loading ? "bg-gray-400" : "bg-blue-600"}
        `}
                style={{
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.3,
                  shadowRadius: 4,
                  elevation: 6,
                }}
              >
                {loading ? (
                  <>
                    <ActivityIndicator color="#fff" />
                    <Text className="ml-3 text-white text-base font-semibold">
                      Loading...
                    </Text>
                  </>
                ) : (
                  <Text className="text-white text-base font-semibold">
                    Load More Images
                  </Text>
                )}
              </Pressable>
            </View>
          ) : (
            <Text className="text-center text-gray-500 mb-24 font-bold">
              No more images
            </Text>
          )
        }
      />
    </View>
  );
}
