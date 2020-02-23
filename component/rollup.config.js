import babel from 'rollup-plugin-babel'
import postcss from 'rollup-plugin-postcss'
import image from '@rollup/plugin-image'
import { terser } from "rollup-plugin-terser"

const plugins = [
    postcss({extensions: ['.css']}),
    babel({
        exclude: "node_modules/**",
        presets: ["@babel/env", "@babel/react"],
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
    image(),
    terser()
]

const config =
[
    {input: 'src/WeatherComponent.js', plugins, output: { file: 'build/WeatherComponent.js', format: 'cjs' }},
    {input: 'src/WeatherApi.js', plugins, output: { file: 'build/WeatherApi.js', format: 'cjs' }}
]
export default config