/** @type {import('tailwindcss').Config} */
const TRANSFORM = `translate3d(var(--tw-translate-x,0),var(--tw-translate-y,0),var(--tw-translate-z,0)) rotateX(var(--tw-rotate-x,0)) rotateY(var(--tw-rotate-y,0)) rotateZ(var(--tw-rotate-z,0)) skewX(var(--tw-skew-x,0)) skewY(var(--tw-skew-y,0)) scaleX(var(--tw-scale-x,1)) scaleY(var(--tw-scale-y,1))`;

module.exports = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  safelist: [
    {
      pattern:
        /(bg|text|border|from|via|to)-(emerald|blue|purple)-(400|500)(\/(5|10|20|30|40|50))?/,
    },
    "border-t-emerald-500/40",
    "border-t-blue-500/40",
    "border-t-purple-500/40",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        serif: ["Playfair Display", "serif"],
        bricolage: ["Bricolage Grotesque", "sans-serif"],
        mono: ["Space Mono", "monospace"],
      },
      keyframes: {
        cinematicEntrance: {
          "0%": { transform: "scale(1.4)", filter: "blur(20px) grayscale(100%)", opacity: "0" },
          "20%": { opacity: "1" },
          "100%": { transform: "scale(1)", filter: "blur(0px) grayscale(0%)", opacity: "1" },
        },
        slideUpFade: {
          "0%": { opacity: "0", transform: "translateY(40px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        animationIn: {
          "0%": { opacity: "0", transform: "translateY(30px)", filter: "blur(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)", filter: "blur(0px)" },
        },
        shimmerMove: {
          "0%": { transform: "translateX(-150%) skewX(-20deg)" },
          "100%": { transform: "translateX(200%) skewX(-20deg)" },
        },
        slideInLeft: {
          from: { opacity: "0", transform: "translateX(-60px)" },
          to: { opacity: "1", transform: "translateX(0)" },
        },
        slideInRight: {
          from: { opacity: "0", transform: "translateX(60px)" },
          to: { opacity: "1", transform: "translateX(0)" },
        },
        spinReverse: { from: { transform: "rotate(360deg)" }, to: { transform: "rotate(0deg)" } },
        barEqualizer: { "0%,100%": { transform: "scaleY(1)" }, "50%": { transform: "scaleY(0.3)" } },
      },
      animation: {
        cinematic: "cinematicEntrance 3.5s cubic-bezier(0.22,1,0.36,1) forwards",
        "slide-up": "slideUpFade 1s ease-out forwards",
        "shimmer-effect": "shimmerMove 3s ease-in-out infinite",
        "spin-slow-reverse": "spinReverse 12s linear infinite",
      },
    },
  },
  plugins: [
    function ({ addUtilities }) {
      const u = {};
      [0, 5, 10, 15, 20, 30, 45, 75].forEach((v) => {
        ["x", "y", "z"].forEach((axis) => {
          u[`.rotate-${axis}-${v}`] = { [`--tw-rotate-${axis}`]: `${v}deg`, transform: TRANSFORM };
          if (v) u[`.-rotate-${axis}-${v}`] = { [`--tw-rotate-${axis}`]: `-${v}deg`, transform: TRANSFORM };
        });
      });
      addUtilities({
        ...u,
        ".perspective-near": { perspective: "300px" },
        ".perspective-midrange": { perspective: "800px" },
        ".perspective-distant": { perspective: "1200px" },
        ".transform-style-preserve-3d": { "transform-style": "preserve-3d" },
      });
    },
  ],
};
