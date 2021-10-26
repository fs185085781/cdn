<?php
header("Content-type:text/html;charset=utf-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: *");
header("Access-Control-Allow-Headers: *");//这里“Access-Token”是我要传到后台的内容key
header("Access-Control-Expose-Headers: *");
require_once "medoo.php";
$database = new medoo([
    // 必须配置项
    'database_type' => 'mysql',
    'database_name' => '数据库名',
    'server' => '数据库ip',
    'username' => '数据库用户名',
    'password' => '数据库密码',
    'charset' => 'utf8'
]);
/*
 CREATE TABLE `nes_user`  (
  `id` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `username` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `password` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;
*/
function return_data($flag,$msg,$data){
    $res = array("flag"=>$flag,"msg"=>$msg);
    if(!empty($data)){
        $res["data"] = $data;
    }
    $str = json_encode($res);
    return $str;
}
if($_SERVER['REQUEST_METHOD']=='OPTIONS'){
echo return_data(false,"不支持OPTIONS请求","");
return;
}
$fileIo = file_get_contents('php://input');
$data = json_decode($fileIo,true);
if($_GET["type"] == "login"){
    //登录 {id:"",username:"",password:""}
    if(empty($data["id"]) && (empty($data["username"]) || empty($data["password"]))){
        echo return_data(false,"用户登录失败","");
        return;
    }
    $where = array("or"=>array());
    if(!empty($data["id"])){
        $where["or"]["id"] = $data["id"];
    }
    if(!empty($data["username"]) && !empty($data["password"])){
        $where["or"]["and"] = array(
            "username"=>$data["username"],
            "password"=>$data["password"]
        );
    }
    $user = $database->get("nes_user", "*", $where);
    if(empty($user)){
        echo return_data(false,"用户登录失败","");
        return;
    }
    $user["password"] = "";
    echo return_data(true,"用户登录成功",$user);
}else if($_GET["type"] == "reg"){
    //注册 {username:"",password:""}
    if(empty($data["username"]) || empty($data["password"])){
        echo return_data(false,"用户名密码不可为空","");
        return;
    }
    $user = $database->get("nes_user", "*", [
        "username" => $data["username"]
    ]);
    if(!empty($user)){
        echo return_data(false,"当前用户已被注册","");
        return;
    }
    $db = array(
    "id"=>md5(time()."-".rand(1000,9999)),
    "username"=>$data["username"],
    "password"=>$data["password"]
    );
    $database->insert("nes_user", $db);
    $db = $database->get("nes_user", "*", [
        "id" => $db["id"]
    ]);
    if(empty($db)){
        echo return_data(false,"注册失败","");
        return;
    }
    $db["password"] = "";
    echo return_data(true,"用户注册成功",$db);
}else{
    echo return_data(false,"不支持此请求","");
}
