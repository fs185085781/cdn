<?php
error_reporting(0);
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: *");
function httpdata(){
    $obj = array("flag"=>false,"msg"=>"未知操作类型");
    return json_encode($obj);
}
echo httpdata();
?>