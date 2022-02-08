<?php
error_reporting(0);
header("Content-type:text/html;charset=utf-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: *");
header("Access-Control-Allow-Headers: *");//这里“Access-Token”是我要传到后台的内容key
header("Access-Control-Expose-Headers: *");
require_once "cache.php";
if($_SERVER['REQUEST_METHOD']=='OPTIONS'){
    echo return_data(false,"不支持OPTIONS请求","");
    return;
}
function async_action($flag = "0"){
    if ($flag != "1") {
        return;
    }
    ob_start();
    echo "1";
    $size_o = ob_get_length();
    header("Content-Length: $size_o");
    header('Connection: close');
    header("HTTP/1.1 200 OK");
    header("Content-Type: application/json;charset=utf-8");
    ob_end_flush();
    if (ob_get_length()) {
        ob_flush();
        flush();
    }
    if (function_exists("fastcgi_finish_request")) {
        fastcgi_finish_request();
    }
    ignore_user_abort(true);
    set_time_limit(0);
}
function action_url($url){
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
    curl_setopt($ch, CURLOPT_HEADER, 0);
    curl_setopt($ch, CURLOPT_TIMEOUT, 30);
    curl_exec($ch);
    curl_close($ch);
}
$fileIo = file_get_contents('php://input');
$param = json_decode($fileIo,true);
if($_GET['type'] == "0"){
    // 增加链接
    if(!$param['url']){
        echo return_data(false,"增加失败",null);
        return;
    }
    $cacheData = cacheGet("url","url");
    if(!$cacheData){
        return array();
    }
    $cacheData[$param['url']] = "1";
    cacheSet("url","url",$cacheData);
    echo return_data(true,"增加成功",null);
}else if($_GET['type'] == "1"){
    // 调用心跳
    async_action("1");
    $cacheData = cacheGet("url","url");
    foreach ($cacheData as $url => $val) {
        action_url($url);
    }
    echo return_data(true,"调用完成",null);
}else{
    echo return_data(false,"此方法暂不支持","");
}


