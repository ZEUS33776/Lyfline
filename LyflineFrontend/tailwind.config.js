/** @type {import('tailwindcss').Config} */
export default {
  content: [
   
    "./src/**/*.{vue,js,ts,jsx,tsx}",
    "./src/components/**/*.{js,jsx,ts,tsx}",
    "./pages/**/*.{js,jsx,ts,tsx}"
    
    
  ],
  theme: {
    extend: {
      fontFamily: {
        palanquin: ['Palanquin', 'sans-serif'],
        montserrat: ['Montserrat', 'sans-serif'],
        ubuntu: ['Ubuntu', 'sans-serif'],
      },
      colors: {
        'custom-red':"#EB3030",
        'custom-blue': "#7B83A9",
        'primary': "#ECEEFF",
        "coral-red": "#FF6452",
        "slate-gray": "#6D6D6D",
        "pale-blue": "#F5F6FF",
        "white-400": "rgba(255, 255, 255, 0.80)"
      },
    },
  },
  plugins: [],
}

