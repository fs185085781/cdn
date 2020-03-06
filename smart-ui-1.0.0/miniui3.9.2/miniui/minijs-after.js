(function () {
    window.eval = window.evalData;
    try{
        delete window["evalData"];
    }catch (e) {
        window["evalData"] = undefined;
    }
})()