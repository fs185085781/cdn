<?php
error_reporting(0);
function return_data($flag,$msg,$data){
    $res = array("flag"=>$flag,"msg"=>$msg);
    if(!empty($data)){
        $res["data"] = $data;
    }
    $str = json_encode($res);
    return $str;
}
function cacheKey($path,$key){
    return 'db/file_cache_'.$path. md5($key).".php";
}
function autoMkdir(){
    if(!is_dir("db")){
        mkdir("db",0777,true);
    }
}
function cacheSet($path,$key,$obj){
    autoMkdir();
    file_put_contents(cacheKey($path,$key),"<?php ".json_encode($obj));
}
function cacheGet($path,$key){
    $data = file_get_contents(cacheKey($path,$key));
    if(!$data){
        return false;
    }
    $data = substr($data,strlen("<?php "));
    return json_decode($data,true);
}
function cacheDel($path,$key){
    unlink(cacheKey($path,$key));
}
