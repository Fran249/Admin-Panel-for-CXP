/** @type {import('tailwindcss').Config} */
export default {
	content: [
	  "./index.html",
	  "./src/**/*.{js,ts,jsx,tsx}",
	],
	theme: {
	  extend: {
		fontFamily: {
			'montserrat': 'Montserrat, sans-serif',
			'rajdhani': 'Rajdhani, sans-serif',
			'sans': 'Inter , sans-serif',
			'archivo': 'Archivo, sans-serif'
		}
	  },
	},
	plugins: [],
  }