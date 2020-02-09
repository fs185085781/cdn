(function (path,plugins) {
    for(var i=0;i<plugins.length;i++){
        var plugin = plugins[i];
        if(plugin=="md5"){
            document.write('<script src="' + path + '/md5/md5.js" type="text/javascript"></sc' + 'ript>');
        }
        /*请自行添加插件*/
    }
})(utils.pluginPath,utils.plugins);