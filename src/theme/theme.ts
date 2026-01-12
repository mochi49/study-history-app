import { createSystem, defineConfig, defaultConfig } from "@chakra-ui/react";

const config = defineConfig({
  globalCss: {
    body: {
      margin: 0,
      fontFamily: "roboto, sans-serif",
      bg: "blue.50",
      color: "gray.600",
    },
  },
});

export const themeSystem = createSystem(defaultConfig, config);
