/** @type {import('tailwindcss').Config} */

import type { Config } from "tailwindcss";

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
				'black-pearl': {
					'50': '#eff8ff',
					'100': '#ddf1ff',
					'200': '#b4e3ff',
					'300': '#72cdff',
					'400': '#27b4ff',
					'500': '#009afd',
					'600': '#007ad9',
					'700': '#0060af',
					'800': '#005290',
					'900': '#034477',
					'950': '#011425',
				},
				'smalt-blue': {
					'50': '#f4f7f7',
					'100': '#e2eaeb',
					'200': '#c7d5da',
					'300': '#a1b8bf',
					'400': '#73929d',
					'500': '#5c7c89',
					'600': '#4b636f',
					'700': '#41535d',
					'800': '#3b474f',
					'900': '#343e45',
					'950': '#20272c',
				},
				'vivid-tangerine': {
					'50': '#fef4f2',
					'100': '#fde7e3',
					'200': '#fdd3cb',
					'300': '#fab4a7',
					'400': '#f58f7c',
					'500': '#ea6249',
					'600': '#d7462b',
					'700': '#b53720',
					'800': '#96311e',
					'900': '#7c2e20',
					'950': '#43150c',
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
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
