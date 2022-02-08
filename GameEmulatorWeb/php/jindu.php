<?php
error_reporting(0);
header("Content-type:text/html;charset=utf-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: *");
header("Access-Control-Allow-Headers: *");//这里“Access-Token”是我要传到后台的内容key
header("Access-Control-Expose-Headers: *");
require_once "medoo.php";
require_once "jingan.php";
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
 CREATE TABLE `nes_user_jindu`  (
  `id` int(20) NOT NULL AUTO_INCREMENT,
  `user_id` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `game` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `name` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `file_id` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 7 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;*/
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
if($_GET["type"] == "1"){
    //获取用户当前游戏进度列表 {openId:"",game:""}
    $list = $database->select("nes_user_jindu","*", ["and"=>
        [
            "user_id" => $data["user_id"],
            "game" => $data["game"]
        ]
    ]);
    echo return_data(true,"进度读取成功",$list);
}else if($_GET["type"] == "2"){
    //获取加载数据 {fileId:""}
    $file_url = get_url("nesdata","nes_cache/".$data["fileId"].".nes_cache",100);
    $jdtext = file_get_contents($file_url);
    echo return_data(true,"进度下载成功",$jdtext);
}else if($_GET["type"] == "3"){
     //保存用户的进度 {user_id:"",game:"111111",name:"",text:"","fileId":""}
     $upload_res = send_file_io("nesdata",$data["text"],"nes_cache/".$data["fileId"].".nes_cache");
     if($upload_res != "success"){
        echo return_data(false,"进度上传失败","");
        return;
     }
     $save_res = $database->insert("nes_user_jindu", [
         "user_id" => $data["user_id"],
         "game" => $data["game"],
         "name" => $data["name"],
         "file_id"=>$data["fileId"]
     ]);
     if($save_res == 0){
        echo return_data(false,"进度保存失败","");
        return;
     }
     echo return_data(true,"进度保存成功","");
}else if($_GET["type"] == "4"){
     //进度删除 {id:"",fileId:""}
     $delete_res = del_file("nesdata","nes_cache/".$data["fileId"].".nes_cache");
     if($delete_res != "success" && $delete_res != "该文件不存在"){
         echo return_data(false,"进度缓存删除失败","");
         return;
     }
     $sql_delete_res = $database->delete("nes_user_jindu", [
         "id"=>$data["id"]
     ]);
     if($sql_delete_res < 1){
         echo return_data(false,"进度删除失败","");
         return;
      }
     echo return_data(true,"进度删除成功","");
 }else{
    echo return_data(false,"不支持此请求","");
}
