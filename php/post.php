<?php
error_reporting(0);
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: *");
include 'function.php';
function post(){
    $sql=$_POST['sql'];
    $flag = false;
    if(strpos(strtolower(trim($sql)),'select') === 0){
        $flag = true;
    }
    $result = sql_action($sql,$flag);
    $obj = array("flag"=>false,"msg"=>"未知操作类型");
    if(is_array($result)){
        $flag = count($result)>0;
        $obj = array("flag"=>$flag,"msg"=>$flag?"获取成功":"获取失败","data"=>$result);
    }else if(is_bool($result)){
        $obj = array("flag"=>$result,"msg"=>$result?"操作成功":"操作失败");
    }
    return json_encode($obj);
}
echo post($json);
?>