var path = require("path");
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var webpack = require("webpack");
var WebpackStrip = require('strip-loader');
var package = require("./package.json");

var node_env = process.env.NODE_ENV;
var logless_base = process.env.LOGLESS_BASE;
var source_api_token = process.env.SOURCE_API_ACCESS_TOKEN;
var pusher_app_key = process.env.PUSHER_APP_KEY;
var projectName = "dashboard";
var version = package.version;
var buildNumber = process.env.TRAVIS_BUILD_NUMBER;
var buildId = process.env.TRAVIS_BUILD_ID

// A couple of default buildVariables, these are then made available
// within the project.  Make sure they are also declared in typings/config.d.ts
// to let TypeScript know about them.
var buildVariables = {
  'process.env': {
    NODE_ENV: JSON.stringify(node_env),
    LOGLESS_BASE: JSON.stringify(logless_base),
    PUSHER_APP_KEY: JSON.stringify(pusher_app_key),
    SOURCE_API_ACCESS_TOKEN: JSON.stringify(source_api_token)
  },
  'BASENAME': JSON.stringify("/dashboard"),
  'GOOGLE_ANALYTICS': JSON.stringify(""),
  'VERSION': JSON.stringify(version),
  'BUILD_NUMBER': JSON.stringify(buildNumber),
  'BUILD_ID': JSON.stringify(buildId),
  'LOGLESS_BASE': JSON.stringify(logless_base),
  'SOURCE_API_ACCESS_TOKEN': JSON.stringify(source_api_token)
}

// A list of plugins
var plugins = [];

// If it is production
if (node_env === "production") {
  // For production postfix min to the file names
  projectName += ".min";
  buildVariables.GOOGLE_ANALYTICS = JSON.stringify("UA-40630247-7");
  // Add the production plugins
  plugins.push(new webpack.optimize.UglifyJsPlugin());
}

// Used by our dev instances
if (node_env === "development") {
  buildVariables.BASENAME = JSON.stringify("/");
}

// Now that everything is configured, add the plugins
plugins.push(new ExtractTextPlugin("style/" + projectName + ".css", { allChunks: true }))
plugins.push(new webpack.DefinePlugin(buildVariables));

var moduleLoaders = [];
// All files with a '.ts' or '.tsx' extension will be handled by 'ts-loader'.
moduleLoaders.push({
  test: /\.tsx?$/,
  loader: "ts-loader"
});
// Styling loader for scss and css files.
moduleLoaders.push({
  test: /\.(scss|css)$/,
  loader: ExtractTextPlugin.extract('style', 'typings-for-css-modules?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]!postcss!sass')
});
// This loader will strip out all console methods.  We don't care if it's in development.
if (node_env === "production") {
  moduleLoaders.push({
    test: /\.tsx?$/,
    loader: "strip-loader?strip[]=debug,strip[]=console.log,strip[]=console.info,strip[]=console.debug,strip[]=console.time,strip[]=console.timeEnd"
  });
}

// The remaining webpack config
var config = {
  entry: "./src/index.tsx",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "scripts/" + projectName + ".js",
  },
  // Enable sourcemaps for debugging webpack's output.
  // devtool: "source-map",

  resolve: {
    // Add '.ts' and '.tsx' as resolvable extensions.
    extensions: ["", ".scss", ".css", ".webpack.js", ".web.js", ".ts", ".tsx", ".js"],
    modulesDirectories: [
      'node_modules',
      path.resolve(__dirname, './node_modules')
    ]
  },

  module: {
    loaders: moduleLoaders,

    sassLoader: {
      data: '@import "' + path.resolve(__dirname, 'theme/_theme.scss') + '";'
    },

    /*
    preLoaders: [
      // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
      {
        test: /\.js$/,
        loader: "source-map-loader"
      }
    ]
    */
  },

  plugins: plugins,
}

module.exports = config;
