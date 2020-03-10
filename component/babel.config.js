module.exports = {
    exclude: "node_modules/**",
    presets: [
        [
            '@babel/preset-env',
            {
                targets: { node: 'current' }
            }
        ],
        [
            '@babel/preset-react',
            {
                targets: { node: 'current' }
            }
        ]
    ],
    plugins: [ 'inline-import-data-uri', 'react-css-modules-transform' ]
}