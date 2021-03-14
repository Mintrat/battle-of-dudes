module.exports = {
    configureWebpack: {
        module: {
            rules: [
                {
                    test: /\.(cur)$/i,
                    loader: 'file-loader',
                },
            ],
        },
    }
}