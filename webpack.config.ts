import configuration from 'config'
import glob from 'glob';
import path from 'path';
import webpack from 'webpack';

const webpackConfig: any = configuration.get("webpack")
const outputDir = webpackConfig.outputDir;

const config: webpack.Configuration = {
    mode: 'production',
    entry: glob.sync('./src/*.ts').reduce((acc, file) => {
        return {...acc, [file.substring(6, file.length - 3)]: file}
    }, {}),
    target: "node",
    output: {
        filename: '[name].js',
        libraryTarget: 'commonjs',
        path: path.resolve(__dirname, outputDir)
    },
	optimization: {
		// We no not want to minimize our code.
        minimize: false,
        // TODO: Find out how to not inline dependencies
        // splitChunks: {
        //     chunks: 'all',
        //     maxInitialRequests: Infinity,
        //     minSize: 0
        // }
	},
    module: {
        rules: [
            {
                test: /\.[tj]s(on)?$/,
                use: {
                    loader: 'ts-loader',

                    options: { allowTsInNodeModules: true }
                }
            }
        ]
    },
    resolve: {
      extensions: ['.ts', '.js', '.json'],
      alias: {
          lib: path.resolve(__dirname, './lib/')
      }
    },
    externals: {
      'lib/lodash': 'commonjs lib/lodash'
    },
    plugins: [
        new webpack.NamedModulesPlugin()
    ]
}

export default config