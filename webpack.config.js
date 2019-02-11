const path = require('path');

module.exports = {
    entry: './src/junisen.tsx',
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/
            }
        ]
    },
    devServer: {
        contentBase: "./dist"
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js']
    },
    output: {
        filename: 'junisen.js',
        path: path.resolve(__dirname, 'dist')
    }
};
