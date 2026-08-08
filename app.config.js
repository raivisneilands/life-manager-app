import "dotenv/config";

export default {
  expo: {
    name: "Life Manager Pro",
    slug: "life-manager-pro",
    owner: "raivisneilands",
    version: "1.0.0",
    orientation: "portrait",

    icon: "./assets/icons/icon.png",
    scheme: "lifemanagerapp",
    userInterfaceStyle: "automatic",
    newArchEnabled: true,

    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.lifemanager.lifemanagerproapp",
    },

    android: {
      package: "com.lifemanager.lifemanagerproapp",
      adaptiveIcon: {
        backgroundColor: "#FFFFFF",
        foregroundImage: "./assets/icons/adaptive-icon.png",
        monochromeImage: "./assets/icons/adaptive-icon.png",
      },
      edgeToEdgeEnabled: true,
      predictiveBackGestureEnabled: false,
    },

    web: {
      output: "single",
      favicon: "./assets/images/life-manager-icon.png",
    },

    plugins: [
      "expo-router",
      [
        "expo-splash-screen",
        {
          image: "./assets/icons/splash.png",
          imageWidth: 200,
          resizeMode: "contain",
          backgroundColor: "#ffffff",
          dark: {
            image: "./assets/icons/splash.png",
            backgroundColor: "#000000",
          },
        },
      ],
    ],

    experiments: {
      typedRoutes: true,
      reactCompiler: true,
    },

    extra: {
      router: {},

      supabaseUrl: process.env.SUPABASE_URL,
      supabaseAnonKey: process.env.SUPABASE_ANON_KEY,

      eas: {
        projectId: "e19a3314-d61c-45f8-ac9b-c2aba7e0c36d",
      },
    },
  },
};
