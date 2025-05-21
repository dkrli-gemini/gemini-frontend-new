import localFont from "next/font/local";

export const filsonPro = localFont({
  src: [
    {
      path: "../../public/fonts/FilsonProRegular.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/FilsonProMedium.otf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../public/fonts/FilsonProBold.otf",
      weight: "700",
      style: "normal",
    },
    // Add more variants (italic, light, etc.) as needed
  ],
  variable: "--font-filson-pro", // Define a CSS variable name
  display: "swap", // This helps prevent layout shifts
});
