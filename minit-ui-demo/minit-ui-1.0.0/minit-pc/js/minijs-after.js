(function () {
    window.eval = utils.evalData;
    utils.removeProp(utils,"evalData");
    JSON.stringify=mini.encode;
    JSON.encode=mini.encode;
    JSON.parse=mini.decode;
    JSON.decode=mini.decode;
})()