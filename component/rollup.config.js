import babel from 'rollup-plugin-babel'
import { uglify } from 'rollup-plugin-uglify'
import postcss from 'rollup-plugin-postcss'

const config = [{
    input: 'src/WeatherComponent.js',
    plugins: [
        postcss({extensions: ['.css']}),
        babel({
            exclude: "node_modules/**",
            presets: ["@babel/env", "@babel/react"],
            plugins: [
                "@babel/plugin-proposal-class-properties",
                "@babel/plugin-proposal-object-rest-spread"
            ]
        }),
        uglify()
    ],
    output: {
        file: 'build/WeatherComponent.js',
        format: 'cjs'
    }
    }, {
        input: 'src/WeatherData.js',
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
            uglify()
        ],
        output: {
            file: 'build/WeatherData.js',
            format: 'cjs'
        }
    }]
export default config