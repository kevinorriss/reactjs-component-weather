import babel from 'rollup-plugin-babel'
import postcss from 'rollup-plugin-postcss'
import { terser } from "rollup-plugin-terser"
const babelConfig = require('./babel.config')

const config = [
    {
        input: 'src/WeatherComponent.js',
        plugins: [ babel(babelConfig), postcss({ extensions: ['.css'] }), terser() ],
        output: { file: 'build/WeatherComponent.js', format: 'cjs' }
    }, {
        input: 'src/WeatherApi.js',
        plugins: [ babel(babelConfig), terser() ],
        output: { file: 'build/WeatherApi.js', format: 'cjs' }
    }
]
export default config