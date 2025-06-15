
import type { Config } from "tailwindcss";
import { baseConfig } from "./src/config/tailwind/base";
import { theme } from "./src/config/tailwind/theme";

export default {
  ...baseConfig,
  theme,
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
