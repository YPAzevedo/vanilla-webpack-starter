const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { merge: webpackMerge } = require("webpack-merge");
const path = require("path");

const modeConfig = (env) => require(`./webpack.${env.mode}`)(env);

module.exports = (env = { mode: "production" }) => {
  return webpackMerge(
    {
      mode: env.mode,
      output: {
        path: path.join(__dirname, "build"),
        filename: "bundle.js",
      },
      module: {
        rules: [
          {
            test: /\.(js|jsx|ts|tsx)?$/,
            exclude: [/node_modules/],
            loader: "babel-loader",
            options: {
              presets: [
                [
                  "@babel/preset-env",
                  {
                    corejs: 3,
                    modules: false, // Ensure no compilers transform your ES2015 module syntax into CommonJS modules (this is the default behavior of the popular Babel preset @babel/preset-env - see the documentation for more details).
                    useBuiltIns: "usage",
                  },
                ],
              ],
              plugins: [
                "@babel/plugin-proposal-object-rest-spread",
                "@babel/plugin-proposal-class-properties",
                "@babel/plugin-proposal-export-default-from",
                "@babel/plugin-proposal-export-namespace-from",
                "@babel/plugin-proposal-nullish-coalescing-operator",
                "@babel/plugin-proposal-optional-chaining",
              ],
            },
          },
          {
            test: /\.(jpe?g|png|gif|svg|pdf|csv|xlsx|ttf|woff(2)?)$/i,
            use: [
              {
                loader: "url-loader",
                options: {
                  limit: 5000,
                  name: "[name].[ext]",
                  outputPath: "img/",
                },
              },
            ],
          },
        ],
      },
      plugins: [
        new HtmlWebpackPlugin({ template: "./src/index.html" }),
        new webpack.ProgressPlugin({ percentBy: "entries" }),
      ],
      devServer: {
        contentBase: path.join(__dirname, "build"),
        disableHostCheck: true,
        historyApiFallback: {
          disableDotRule: true,
        },
        hot: true,
        hotOnly: false,
        compress: true,
        open: true,
        port: "4040",
      },
    },
    modeConfig(env)
  );
};
