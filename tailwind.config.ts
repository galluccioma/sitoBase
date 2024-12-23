import type { Config } from "tailwindcss";

const config: Config = {
  content: ['./src/**/*.{tsx,ts}'],
  
  theme: {
    extend: {},
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
  blocklist:["table"],
};
export default config;
