import babel from 'rollup-plugin-babel'
import postcss from 'rollup-plugin-postcss'
import image from '@rollup/plugin-image'
import { terser } from "rollup-plugin-terser"

const componentPlugins = [
    postcss({ extensions: ['.css'] }),
    babel({
        exclude: "node_modules/**",
        presets: ["@babel/env", "@babel/react"],
        plugins: [
            "@babel/plugin-proposal-class-properties",
            "@babel/plugin-proposal-object-rest-spread"
        ]
    }),
    image(),
    terser()
]

const config = [
    { input: 'src/WeatherComponent.js', plugins: componentPlugins, output: { file: 'build/WeatherComponent.js', format: 'cjs' } },
    { input: 'src/components/Icon.js', plugins: componentPlugins, output: { file: 'build/Icon.js', format: 'cjs' } },
    { input: 'src/components/Location.js', plugins: componentPlugins, output: { file: 'build/Location.js', format: 'cjs' } },
    { input: 'src/components/HourSlider.js', plugins: componentPlugins, output: { file: 'build/HourSlider.js', format: 'cjs' } },
    {
        input: 'src/WeatherApi.js',
        plugins: [
            babel({
                exclude: "node_modules/**",
                presets: ["@babel/env"],
                runtimeHelpers: true,
                plugins: [
                    ["@babel/plugin-transform-runtime",
                        {
                            "regenerator": true
                        }
                    ],
                    "@babel/plugin-proposal-class-properties",
                    "@babel/plugin-proposal-object-rest-spread"
                ]
            }),
            terser()
        ],
        output: {
            file: 'build/WeatherApi.js',
            format: 'cjs'
        }
    }
]
export default config