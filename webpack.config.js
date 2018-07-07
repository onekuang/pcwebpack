const webpack = require('webpack');
const htmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const Ex = require('extract-text-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const path = require('path');
module.exports = {
	// 模式设置
	mode: 'development',

	optimization: {
	// 压缩js代码
		minimize: true
	},
	// 调试模式
	devtool: 'eval-source-map',

	// 入口文件
	entry 	: {
		main : __dirname + "/src/main.js",
	},
		
	output 	: {
		//打包后文件存放的地方
		path: __dirname + "/dist", 

		// 打包后输出文件的文件名
		filename: 'js/[name].js',

		// 上线的时候,可以给地址添加前缀
		publicPath: "http://localhost:8086/"
		// publicPath: "./"
	},


	// 本地服务器
	devServer: {
	    // contentBase: "./public",//本地服务器所加载的页面所在的目录 默认为根目录
	    contentBase: path.join(__dirname, "dist"),

	    // 在开发单页应用时非常有用，它依赖于HTML5 history API，如果设置为true，所有的跳转将指向index.html
	    historyApiFallback: false,//跳转 

	    // 设置默认监听端口，如果省略，默认为”8080“
	    port: 8086,

	    // 当源文件改变时会自动刷新页面
	    inline: true,//设置为true，当源文件改变时会自动刷新页面

	    hot: true
	},

	module: {
		rules: [
			{
				test: /\.js$/,
				loader: "babel-loader",
				
				// 以下目录不处理
				exclude: path.resolve(__dirname, 'node_modules'),
				// 只处理以下目录
				include: path.resolve(__dirname, 'src'),
				query:{
					presets: ["env","es2015"]
				},
			},
   		{
        test: /(\.css|\.less)$/,
        use: Ex.extract({
        	fallback: "style-loader",
        	use: "css-loader?importLoaders=1!postcss-loader!less-loader"
        })
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'file-loader',
        options: {
        	name: 'img/[name].[ext]',
        } 
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'file-loader',
        options: {
          name: 'fonts/[name].[ext]',
        }
      },
      {
      	test: /\.(html|htm)$/i,
      	loader: "html-withimg-loader?min=false",
      }
		]
	},

	// 插件
	plugins: [
	  // 每次打包清除/dist
		new CleanWebpackPlugin(['dist/*.*']),
		// 复制插件
		new CopyWebpackPlugin([{
				// 定义要拷贝的源目录
		    from: __dirname + '/static',
		    // 定义要拷贝到的目标目录
		    to : __dirname + '/dist/static'
		}]),
		// 全局jquery
		new webpack.ProvidePlugin({
			$: "jquery",
			jQuery: "jquery",
		}),
		// 分离js css
		new Ex("[name].css"),

	  new webpack.BannerPlugin('版权所有，翻版必究'),
	  // 热加载
	  new webpack.HotModuleReplacementPlugin(),
	  // 为组件分配id
	  new webpack.optimize.OccurrenceOrderPlugin(),

		
		new htmlWebpackPlugin({
			// 打包后的文件名
			// 定义变量
			// 调用: <%= htmlWebpackPlugin.options.title %>
			title: "首页",
			filename: 	'index.html', 
			// 模版位置
			template: 'html-withimg-loader!' + __dirname + "/view/index.htm",  
			// script标签的位置
			inject: 		'true',
			// 指定引用的js, 默认引入所有打包的js
			chunks: [
				'main'
			],
			// 同上相反,除了xxxjs,其他全部引入,不能和上面共用
			// excludeChunks: [
			// 	'main'
			// ],

			// 打包规则
			minify: {
				// removeComments: true,			//	去除注释
				// collapseWhitespace: true	// 	去除空格
			},
		}),

		new htmlWebpackPlugin({
			title: "产品列表",
			filename: 	'product.html', 
			template: 'html-withimg-loader!' +  __dirname + "/view/product.htm",  
			// 指定引用的js, 默认引入所有打包的js
			chunks: [
				'main'
			],
		}),

	],
}