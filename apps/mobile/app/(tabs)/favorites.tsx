import { useEffect, useState } from "react";
import { View, Text, Alert, ScrollView, TouchableOpacity, FlatList } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

import { API_URL } from "@/constants/api";
import { COLORS } from "@/constants/colors";
import { favoritesStyles } from "@/assets/styles/favorites.styles";
import { auth } from "@/services/auth";
import NoFavoritesFound from "@/components/no-favorites-found";
import RecipeCard from "@/components/recipe-card";
import Loading from "@/components/loading";

const FavoritesScreen = () => {
  const { signOut, getSession, status } = auth();
  const [favoriteRecipes, setFavoriteRecipes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const loadFavorites = async () => {
      const session = await getSession();

      if (!session || !session.user) {
        console.error('no session found');
        return;
      }
      console.log('found user');

      try {
        const response = await fetch(`${API_URL}/favorites?user=${'Fbu2t1IBRDldi0oa8hlprCpirD2bnCKG'}`);
        // const response = await fetch(`${API_URL}/favorites?user=${session.user.id}`);
        if (!response.ok) throw new Error("Failed to fetch favorites");

        const responseJson = await response.json();
        console.log(responseJson.data);

        // transform the data to match the RecipeCard component's expected format
        const transformedFavorites = responseJson.data.map((favorite: any) => ({
          ...favorite,
          id: favorite.recipeId,
        }));

        setFavoriteRecipes(transformedFavorites);
      } catch (error) {
        console.log("Error loading favorites", error);
      }
    };

    loadFavorites().then(() => {
      setLoading(false);
    });
  }, []);

  const handleSignOut = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      { text: "Logout", style: "destructive", onPress: signOut },
    ]);
  };

  if (loading) return <Loading />
  if (status === 'pending') return <Loading />
  if (status === 'logged-in') router.replace('/');

  return (
    <View style={favoritesStyles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={favoritesStyles.header}>
          <Text style={favoritesStyles.title}>Favorites</Text>
          <TouchableOpacity style={favoritesStyles.logoutButton} onPress={handleSignOut}>
            <Ionicons name="log-out-outline" size={22} color={COLORS.text} />
          </TouchableOpacity>
        </View>

        <View style={favoritesStyles.recipesSection}>
          <FlatList
            data={favoriteRecipes}
            renderItem={({ item }) => <RecipeCard recipe={item} />}
            keyExtractor={(item) => item.id.toString()}
            numColumns={2}
            columnWrapperStyle={favoritesStyles.row}
            contentContainerStyle={favoritesStyles.recipesGrid}
            scrollEnabled={false}
            ListEmptyComponent={<NoFavoritesFound />}
          />
        </View>
      </ScrollView>
    </View>
  );
};

export default FavoritesScreen;