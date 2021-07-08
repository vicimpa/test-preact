import { join } from "path";
import { Configuration } from "webpack";
import { compilerOptions } from "./tsconfig.json";
import { Configuration as DevServer } from "webpack-dev-server";

const { env, argv } = process
const { NODE_ENV = 'development', NODE_PORT = 8080 } = env
const isServeMode = argv.indexOf('serve') != -1
const isDevMode = NODE_ENV != 'production'

const getAliaces = () => {
  return Object.entries(compilerOptions.paths)
    .reduce((acc, [key, values]) => {
      const [value] = values as string[]
      acc[key] = join(__dirname, value)
      return acc
    }, {} as { [key: string]: string })
}

module.exports = {
  entry: {
    'index': './index.tsx'
  },
  output: {
    path: join(__dirname, 'dist'),
    filename: '[name].js',
    publicPath: '/dist/'
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'ts-loader'
      }
    ]
  },
  devServer: { port: +NODE_PORT },
  watch: !isServeMode && isDevMode,
  mode: isDevMode ? 'development' : 'production',
  devtool: isDevMode ? 'inline-source-map' : false,
  resolve: { 
    alias: getAliaces(), 
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.mjs', '.json'] 
  },
} as Configuration & { devServer?: DevServer }