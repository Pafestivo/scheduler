import { Inter, Merriweather, Roboto_Mono } from "next/font/google";

export const inter = Inter({ subsets: ["latin"] });

export const merriweather = Merriweather({
  weight: ["400", "700"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  display: "swap",
});

export const roboto_mono = Roboto_Mono({
  subsets: ["latin"],
  display: "swap",
});
