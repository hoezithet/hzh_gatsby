import Typography from "typography"

const typography = new Typography({
    googleFonts: [
        {
            name: 'Quicksand',
            styles: [
                '400',
                '700',
            ],
        },
    ],
    baseFontSize: '18px',
    baseLineHeight: 1.666,
    headerFontFamily: ['Quicksand', 'sans-serif'],
    bodyFontFamily: ['Quicksand', 'sans-serif'],
})

// Export helper functions
export const { scale, rhythm, options } = typography
export default typography
