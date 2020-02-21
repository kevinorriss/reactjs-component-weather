import babel from 'rollup-plugin-babel'
import postcss from 'rollup-plugin-postcss'
import image from '@rollup/plugin-image'
import { terser } from "rollup-plugin-terser"

const config =
[
    {
        input: 'src/main.js',
        plugins: [
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
        ],
        output: {
            file: 'build/Weather.js',
            format: 'cjs'
        }
    }
]
export default config