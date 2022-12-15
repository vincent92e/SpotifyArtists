const path = require("path");
const isDev = process.env.NODE_ENV !== "production";
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
  mode: "development",
  entry: {
    main: [path.resolve("./js")],
  },
  output: {
    path: path.resolve("./assets"),
    filename: isDev ? "[name].js" : "[name].[chunkhash].js",
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
      },
      {
        test: /\.scss$/,
        exclude: /node_modules/,
        use: [
          MiniCssExtractPlugin.loader,
          "css-loader",
          "postcss-loader",
          "sass-loader",
        ],
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: isDev ? "[name].css" : "[name].[hash].css",
      chunkFilename: isDev ? "[id].css" : "[id].[hash].css",
    }),
  ],
  resolve: {
    extensions: [".js", ".jsx"],
  },
};
