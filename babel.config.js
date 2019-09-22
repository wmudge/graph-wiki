module.exports = function(api) {
    api.cache(true);

    const presets = [
        [
            '@babel/preset-env',
            {
                targets: {
                    node: 'current'
                }
            }
        ]
    ];

    const sourceMaps = "inline";
    const retainLines = true;

    return { presets, sourceMaps, retainLines };
}