import React, { useEffect, useState } from 'react'
import { FlatList, RefreshControl, ScrollView, Text, TouchableOpacity, View } from 'react-native'
import { useRouter } from 'expo-router'
import { Image } from 'expo-image'

import { auth } from '@/services/auth'
import Loading from '@/components/loading'
import { MealAPI } from '@/services/meal-api'
import { homeStyles } from '@/assets/styles/home.styles'
import { Ionicons } from '@expo/vector-icons'
import { COLORS } from '@/constants/colors'
import CategoryFilter from '@/components/category-filter'
import RecipeCard from '@/components/recipe-card'

const HomeScreen = () => {
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [recipes, setRecipes] = useState<any[]>([]);
  const [featuredRecipe, setFeaturedRecipe] = useState<any>(null);
  const [selectedCategory, setSelectedCategory] = useState<any>(null);

  const { status } = auth();
  const router = useRouter();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);

      const [rawCategories, rawRecipes, rawFeaturedRecipe] = await Promise.all([
        MealAPI.getCategories(),
        MealAPI.getRandomMeals(12),
        MealAPI.getRandomMeal(),
      ]);

      const transformedCategories = rawCategories.map((category: any, i: number) => ({
        id: i + 1,
        name: category.strCategory,
        image: category.strCategoryThumb,
        description: category.strCategoryDescription,
      }));
      setCategories(transformedCategories);

      const transformedRecipes = rawRecipes.map((meal) => MealAPI.transformMealData(meal));
      setRecipes(transformedRecipes);

      const transformedFeaturedRecipe = MealAPI.transformMealData(rawFeaturedRecipe);
      setFeaturedRecipe(transformedFeaturedRecipe);

      if (!selectedCategory) setSelectedCategory(transformedCategories[0].name);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  const loadCategoryData = async (category: string) => {
    try {
      const meals = await MealAPI.filterByCategory(category);
      const transformedMeals = meals.map((meal) => MealAPI.transformMealData(meal)).filter((meal) => meal !== null);
      setRecipes(transformedMeals);
    } catch (error) {
      console.error(error);
      setRecipes([]);
    }
  }

  const handleCategorySelect = async (category: string) => {
    setSelectedCategory(category);
    await loadCategoryData(category);
  }

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  }

  if (loading) return <Loading />
  if (status === 'pending') return <Loading />
  if (status === 'logged-in') router.replace('/');

  return (
    <View style={homeStyles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={COLORS.primary}
          />
        }
        contentContainerStyle={homeStyles.scrollContent}
      >
        {/* WELCOME SECTION */}
        <View style={homeStyles.welcomeSection}>
          <Image
            source={require('../../assets/images/lamb.png')}
            style={{
              width: 100,
              height: 100,
            }}
          />
          <Image
            source={require('../../assets/images/chicken.png')}
            style={{
              width: 100,
              height: 100,
            }}
          />
          <Image
            source={require('../../assets/images/pork.png')}
            style={{
              width: 100,
              height: 100,
            }}
          />
        </View>

        {/* FEATURED SECTION */}
        {featuredRecipe && (
          <View style={homeStyles.featuredSection}>
            <TouchableOpacity
              style={homeStyles.featuredCard}
              activeOpacity={0.9}
              onPress={() => router.replace(`/recipe/${featuredRecipe.id}`)}
            >
              <View style={homeStyles.featuredImageContainer}>
                <Image
                  source={{ uri: featuredRecipe.image }}
                  style={homeStyles.featuredImage}
                  contentFit="cover"
                  transition={800}
                />
                <View style={homeStyles.featuredOverlay}>
                  <View style={homeStyles.featuredBadge}>
                    <Text style={homeStyles.featuredBadgeText}>
                      Featured
                    </Text>
                  </View>

                  <View style={homeStyles.featuredContent}>
                    <Text style={homeStyles.featuredTitle} numberOfLines={2}>
                      {featuredRecipe.title}
                    </Text>

                    <View style={homeStyles.featuredMeta}>
                      <View style={homeStyles.metaItem}>
                        <Ionicons name="time-outline" size={16} color={COLORS.white} />
                        <Text style={ homeStyles.metaText}>{featuredRecipe.cookTime}</Text>
                      </View>

                      <View style={homeStyles.metaItem}>
                        <Ionicons name="people-outline" size={16} color={COLORS.white} />
                        <Text style={ homeStyles.metaText}>{featuredRecipe.servings}</Text>
                      </View>

                      {featuredRecipe.area && (
                        <View style={homeStyles.metaItem}>
                          <Ionicons name="location-outline" size={16} color={COLORS.white} />
                          <Text style={ homeStyles.metaText}>{featuredRecipe.area}</Text>
                        </View>
                      )}
                    </View>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          </View>
        )}

        {/* CATEGORIES SECTION */}
        {categories.length > 0 && (
          <CategoryFilter
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={handleCategorySelect}
          />
        )}

        {/* RECIPES SECTION */}
        <View style={homeStyles.recipesSection}>
          <View style={homeStyles.sectionHeader}>
            <Text style={homeStyles.sectionTitle}>
              {selectedCategory}
            </Text>
          </View>

          {recipes.length > 0 ? (
            <FlatList
              data={recipes}
              renderItem={({ item }) => <RecipeCard recipe={item} />}
              keyExtractor={(item) => `recipe-${item.id}`}
              // numColumns={2}
              // columnWrapperStyle={homeStyles.row}
              contentContainerStyle={homeStyles.recipesGrid}
              scrollEnabled={false}
            />
          ) : (
            <View style={homeStyles.emptyState}>
              <Ionicons name="restaurant-outline" size={64} color={COLORS.textLight} />
              <Text style={homeStyles.emptyTitle}>No recipes found</Text>
              <Text style={homeStyles.emptyDescription}>Try a different category</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  )
}

export default HomeScreen