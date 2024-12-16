import type { Config } from "tailwindcss";

const config: Config = {
  content: ['./src/**/*.{tsx,ts}'],
  theme: {
    extend: {},
  },
  plugins: [],
  blocklist:["table"],
};
export default config;
