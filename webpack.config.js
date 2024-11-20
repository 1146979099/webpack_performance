const path=require('path')
// const FriendlyErrorsWebpackPlugin =require('friendly-errors-webpack-plugin')
const notifier=require('node-notifier')
const ICON=path.join(__dirname, 'icon.jpg');
// const SpeedMeasureWebpack5Plugin=require('speed-measure-webpack5-plugin');
// const smw=new SpeedMeasureWebpack5Plugin();
const { BundleAnalyzerPlugin }=require('webpack-bundle-analyzer');
const bootstrap=path.resolve(__dirname,'node_modules/bootstrap/dist/css/bootstrap.css');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const { IncomingMessage } = require('http');
const loadersPath=path.resolve(__dirname,'loaders');
module.exports={
    mode:'development',//配置的模式
    devtool:'source-map',//调试工具的选择 
    context:process.cwd(),//上下文目录 根目录
    entry:'./src/index.js',
    output:{
        path:path.resolve(__dirname,'dist'),//输出的路径
        filename:'[name].js'//输出的文件名
    },
    resolve:{
        extensions:['.js','.jsx','.json'],//指定文件的扩展名
        alias:{
            '@':path.resolve(__dirname,'src'),
            bootstrap//指定查找别名
        },
        modules:["node_modules"],//指定查找目录
        mainFields:['browser','model','main'],
        mainFiles:['index']//如果找不到mainFields的话，会找索引文件，index.js

    },
    resolveLoader:{
        modules:[loadersPath,"node_modules"]
    },
    externals:{
        jQuery:'jQuery' //jQuery就不进行打包了
    },
    //oneOf只匹配数组中的某一个，找到一个之后就不再继续查找剩下的loader了

    module:{
        //如果模块的路径匹配此正则的话，就不需要去查找里面的依赖项 require import
        noParse: /title.js/,
        rules:[
            {
                oneOf:[
                {
                    test:/\.js$/,
                    include:path.resolve(__dirname,'src'),
                    exclude:/node_modules/,
                    use:[
                        {loader:'thread-loader',options:{workers:3}},
                        {
                            loader:'babel-loader',
                            options:{
                                cacheDirectory:true,//启动离线缓存
                            }
                        },
                        'style-loader',
                        'css-loader'
                    ]
                },
                {
                    test:/\.less$/,
                    use:[
                        'style-loader',
                        'css-loader',
                        'less-loader'
                    ]
                }
            ]
        }
        ]
    },
    plugins:[
        // new FriendlyErrorsWebpackPlugin({
        //     onErrors: (severity, errors) => {
        //         if (severity !== 'error') {
        //             return;
        //         }
        //         const error = errors[0];
        //         notifier.notify({
        //             title: 'Webpack编译失败',
        //             message: `${severity}: ${error.name}`,
        //             sound: 'Pop',
        //             icon: ICON
        //         });
        //     }
        // }),
        new BundleAnalyzerPlugin({
            analyzerMode:'disabled',//不启动展示报告的HTTP服务器
            generateStatsFile: true,//要生成stats.json文件
        }),
        new HtmlWebpackPlugin({
            template:'./src/index.html',//模板路径
            filename:'index.html',//输出路径
            title:'My App',//标题
            minify:{
                removeComments:true,
                collapseWhitespace:true,
                removeAttributeQuotes:true
            }
        }),
        new webpack.IgnorePlugin({
            resourceRegExp: /^\.\/locale$/,//资源正则
            contextRegExp: /moment$/  //目录正则-忽略moment下的locale文件   
        })
    ],
}