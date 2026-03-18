/** @type {import('tailwindcss').Config} */

import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";

export default {
	darkMode: "class",
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				// Brand palettes added per designer input
				'brand-purple': {
					'50': '#f4ebff',
					'100': '#e6d1ff',
					'200': '#d1a8ff',
					'300': '#b388ff', // Light Purple
					'400': '#9b5de5',
					'500': '#8a42d8', // Primary Purple
					'600': '#7b33c4',
					'700': '#6524a3',
					'800': '#512da8', // Dark Purple
					'900': '#45258a',
					'950': '#2d1460',
				},
				'brand-orange': {
					'50': '#fff5ed',
					'100': '#ffe6d4',
					'200': '#ffcca8',
					'300': '#f4a460', // Orange/Peach
					'400': '#e89a6a', // Secondary Orange
					'500': '#e67e22', // Darker Orange
					'600': '#d96659', // Reddish/Coral
					'700': '#c25247',
					'800': '#9c4037',
					'900': '#7d362f',
					'950': '#421814',
				},
				'brand-blue': {
					'50': '#e0f7fa',
					'100': '#b2ebf2',
					'200': '#81d4fa', // Light Blue
					'300': '#4dd0e1', // Cyan
					'400': '#26c6da',
					'500': '#00bcd4',
					'600': '#00acc1',
					'700': '#0097a7',
					'800': '#00838f',
					'900': '#006064',
					'950': '#00363a',
				},
				'brand-pink': {
					'50': '#fce4ec',
					'100': '#f8bbd0',
					'200': '#f48fb1', // Pink
					'300': '#f06292', // Dark Pink
					'400': '#ec407a',
					'500': '#e91e63',
					'600': '#d81b60',
					'700': '#c2185b',
					'800': '#ad1457',
					'900': '#880e4f',
					'950': '#560027',
				},
				'black-light': {
					"800":"#2C2B30",
					"900": "#011425",
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				},
				// Role-specific colors
				client: {
					DEFAULT: '#933bff', // Purple
					light: '#c5a6ff',
					dark: '#8308ff',
				},
				business: {
					DEFAULT: '#10B981', // Green
					light: '#6EE7B7',
					dark: '#047857',
				},
				staff: {
					DEFAULT: '#F59E0B', // Orange
					light: '#FCD34D',
					dark: '#B45309',
				},
				admin: {
					DEFAULT: '#6B7280', // Gray
					light: '#9CA3AF',
					dark: '#4B5563',
				},
			},
			fontFamily: {
				sans: ['"Zain"', 'sans-serif'],
				fsans: ['Inter var', 'Inter', 'sans-serif'],
			},
			boxShadow: {
				'skeuo': '6px 6px 12px #d1d5db, -6px -6px 12px #ffffff',
				'skeuo-inner': 'inset 6px 6px 12px #d1d5db, inset -6px -6px 12px #ffffff',
				'skeuo-dark': '6px 6px 12px #1a1a1a, -6px -6px 12px #2a2a2a',
				'skeuo-inner-dark': 'inset 6px 6px 12px #1a1a1a, inset -6px -6px 12px #2a2a2a',
				'premium': '0 10px 30px -10px rgba(138, 66, 216, 0.3)',
				'premium-hover': '0 20px 40px -10px rgba(138, 66, 216, 0.4)',
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				'fade-in': {
					'0%': {
						opacity: '0',
						transform: 'translateY(10px)'
					},
					'100%': {
						opacity: '1',
						transform: 'translateY(0)'
					}
				},
				'slide-in-right': {
					'0%': { transform: 'translateX(100%)' },
					'100%': { transform: 'translateX(0)' }
				},
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-in': 'fade-in 0.3s ease-out',
				'slide-in-right': 'slide-in-right 0.3s ease-out',
			}
		}
	},
	plugins: [tailwindcssAnimate],
} satisfies Config;
