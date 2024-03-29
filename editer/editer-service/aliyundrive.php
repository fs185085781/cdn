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
function bchexdec($hex){
    $dec = 0;
    $len = strlen($hex);
    for ($i = 1; $i <= $len; $i++) {
        $dec = bcadd($dec, bcmul(strval(hexdec($hex[$i - 1])), bcpow('16', strval($len - $i))));
    }
    return $dec;
}
function proof_code($data,$token){
    $n = $token;
    $r = bchexdec(substr(md5($n),0,16));
    $i = strlen($data);
    $o = $i ? bcmod($r,$i) : 0;
    $length = 8;
    if($length > $i - $o){
        $length = $i - $o;
    }
    $b = substr($data,$o,$length);
    return base64_encode($b);
}
function fileUpload($tokenData,$data,$name){
    $token = $tokenData['access_token'];
    $driveid = $tokenData['default_drive_id'];
    $setting = cacheGet("setting","token");
    $list_id = $setting['list_id'];
    $param = array(
        "drive_id"=>$driveid,
        "part_info_list"=>array(
            0=>array(
                "part_number"=>1
            )
        ),
        "parent_file_id"=>$list_id,
        "name"=>$name,
        "type"=>"file",
        "check_name_mode"=>"auto_rename",
        "size"=>strlen($data),
        "content_hash"=>sha1($data),
        "content_hash_name"=>"sha1",
        "proof_code"=>proof_code($data,$token),
        "proof_version"=>"v1"
    );
    $headers = array("Content-Type: application/json",
        "authorization: Bearer ".$token,
        "cache-control: no-cache");
    $res = aliRequest("/adrive/v2/file/createWithFolders",$param,$headers);
    if($res['rapid_upload']){
        return $res['file_id'];
    }
    aliRequest($res['part_info_list'][0]['upload_url']
        ,$data,
        array("Content-Type:"),
        "putfile"
    );
    $param = array(
        "drive_id"=>$driveid,
        "upload_id"=>$res['upload_id'],
        "file_id"=>$res['file_id']
    );
    $res = aliRequest("/v2/file/complete",$param,$headers);
    return $res['file_id'];
}
function strStartWith($str,$one){
    return strpos($str, $one) === 0;
}
function strEndWith($str,$one){
    return strrpos($str,$one) == strlen($str)-strlen($one);
}
function aliRequest($url, $data=false, $headers=false,$type=false){
    if(!$type){
        $type = "ajax";
    }
    $curl = curl_init();
    if(!strStartWith($url,"http")) {
        $url = 'https://api.aliyundrive.com' . $url;
    }
    curl_setopt($curl, CURLOPT_URL, $url);
    curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($curl, CURLOPT_SSL_VERIFYHOST, false);
    curl_setopt($curl, CURLOPT_REFERER, 'https://www.aliyundrive.com/');
    if($type == "content"){
        curl_setopt($curl, CURLOPT_POST, 0);
    }else if($type == "putfile"){
        curl_setopt($curl, CURLOPT_CUSTOMREQUEST, "PUT");
        if($data){
            curl_setopt($curl, CURLOPT_POSTFIELDS, $data);
        }
    }else if($type == "ajax"){
        curl_setopt($curl, CURLOPT_POST, 1);
        if($data){
            curl_setopt($curl, CURLOPT_POSTFIELDS, json_encode($data));
        }
    }
    if($headers){
        curl_setopt($curl, CURLOPT_HTTPHEADER,$headers);
    }
    curl_setopt($curl, CURLOPT_HEADER, 0);
    curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);
    $res = curl_exec($curl);
    curl_errno($curl);
    curl_close($curl);
    if($type == "ajax" && $res){
        $res = json_decode($res,true);
    }
    return $res;
}
function getTokenNew($refresh_token){
    $data = array('refresh_token'=>$refresh_token);
    $url = "/token/refresh";
    $res = aliRequest(
        $url,
        $data,
        array(
            "Content-Type: application/json"
        )
    );
    if($res && $res['access_token']){
        return array(
            'access_token'=>$res['access_token'],
            'refresh_token'=>$res['refresh_token'],
            'expire_time'=>$res['expire_time'],
            'default_drive_id'=>$res['default_drive_id'],
            'flag'=>true
        );
    }
    return array();
}
function checkToken(){
    $cacheData = cacheGet("token","token");
    if(!$cacheData){
        return array();
    }
    $expire_time = $cacheData['expire_time'];
    $refresh_token = $cacheData['refresh_token'];
    if(strtotime($expire_time) > time() + 1800){
        return $cacheData;
    }
    $cacheData = getTokenNew($refresh_token);
    if($cacheData['flag']){
        cacheSet("token","token",$cacheData);
    }
    return $cacheData;
}
function fileListAjax($pid){
    $items = array();
    $marker = false;
    $count = 0;
    do {
        $tmp = fileListAjaxByMarker($pid,$marker);
        $count++;
        $tmpItems = $tmp['items'];
        foreach ($tmpItems as $tmpItem) {
            array_push($items,$tmpItem);
        }
        $marker = $tmp['next_marker'];
        if($count>=5){
            break;
        }
    } while ($marker);
    return $items;
}
function fileListAjaxByMarker($pid,$marker=false){
    $res = checkToken();
    $param = array("parent_file_id"=>$pid,"drive_id"=>$res['default_drive_id'],"limit"=>200,"order_by"=>"updated_at","order_direction"=>"ASC");
    if($marker){
        $param['marker'] = $marker;
    }
    $headers = array("Content-Type: application/json",
        "authorization: Bearer ".$res['access_token'],
        "cache-control: no-cache");
    $data = aliRequest('/adrive/v3/file/list', $param, $headers);
    return $data;
}
function fileList(){
    $setting = cacheGet("setting","token");
    return fileListAjax($setting['list_id']);
}
function deleteFiles($file_ids){
    $res = checkToken();
    $param = array(
        "resource"=>"file",
        "requests"=>array()
    );
    foreach ($file_ids as $file_id) {
        array_push($param['requests'],array(
            "body"=>array(
                "file_id"=>$file_id,
                "drive_id"=>$res['default_drive_id'],
            ),
            "headers"=>array(
                "Content-Type"=>"application/json"
            ),
            "id"=>$file_id,
            "method"=>"POST",
            "url"=>"/recyclebin/trash"
        ));
    }
    $headers = array("Content-Type: application/json",
        "authorization: Bearer ".$res['access_token'],
        "cache-control: no-cache");
    aliRequest('/v2/batch', $param, $headers);
}
function getFileByUrl($url,$isAliyun){
    $curl = curl_init();
    curl_setopt($curl, CURLOPT_URL, $url);
    curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($curl, CURLOPT_SSL_VERIFYHOST, false);
    curl_setopt($curl, CURLOPT_CUSTOMREQUEST, "GET");
    if($isAliyun){
        curl_setopt($curl, CURLOPT_REFERER, 'https://www.aliyundrive.com/');
    }
    curl_setopt($curl, CURLOPT_HEADER, 0);
    curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);
    curl_setopt($curl, CURLOPT_FOLLOWLOCATION,1);
    $res = curl_exec($curl);
    curl_errno($curl);
    curl_close($curl);
    return $res;
}
function logStr($fileName,$text){
    $myfile = fopen(dirname(__FILE__)."/".$fileName.".txt", "a");
    fwrite($myfile, date('Y-m-d H:i:s').$text."\n\n");
    fclose($myfile);
}
function refererToHost(){
    $sz = explode("/",$_SERVER['HTTP_REFERER']);
    if(count($sz)>=3){
        return $sz[0]."/".$sz[1]."/".$sz[2];
    }
    return "";
}
$fileIo = file_get_contents('php://input');
$param = json_decode($fileIo,true);
if($_GET['type'] == "0"){
    // 设置refresh_token
    $flag = false;
    $data = null;
    if(!$param['password']){
        echo return_data(false,"密码不可为空",$data);
        return;
    }
    if(!$param['refresh_token']){
        echo return_data(false,"refresh_token不可为空",$data);
        return;
    }
    if(!$param['list_id']){
        echo return_data(false,"目录id不可为空",$data);
        return;
    }
    $setting = cacheGet("setting","token");
    if($setting && $setting['password']){
        if($param['password'] != $setting['password']){
            echo return_data(false,"密码错误",$data);
            return;
        }
    }
    $cacheData = getTokenNew($param['refresh_token']);
    if(!$cacheData['flag']){
        echo return_data(false,"设置失败",null);
        return;
    }
    cacheSet("token","token",$cacheData);
    cacheSet("setting","token",array(
        "password"=>$param['password'],
        "list_id"=>$param['list_id']
    ));
    echo return_data(true,"设置成功",null);
}else if($_GET['type'] == "1"){
    //获取文件id
    $file_id = $param['file_id'];
    $tokenData = checkToken();
    if($file_id){
        $token = $tokenData['access_token'];
        $driveid = $tokenData['default_drive_id'];
        $param2 = array(
            "drive_id"=>$driveid,
            "file_id"=>$file_id
        );
        $headers = array("Content-Type: application/json",
            "authorization: Bearer ".$token,
            "cache-control: no-cache");
        $res = aliRequest("/v2/file/get_download_url",$param2,$headers);
        if($res['url']){
            $resData = array(
                "file_id"=>$file_id
            );
            echo return_data(true,"获取文件id成功",$resData);
            return;
        }
    }
    $data = getFileByUrl($param['url'],false);
    /*if(!$data){
        echo return_data(false,"文件数据不能为空",null);
        return;
    }*/
    $file_id = fileUpload($tokenData,$data,$param['name']);
    if(!$file_id){
        echo return_data(false,"获取文件id失败",null);
        return;
    }
    $resData = array(
        "file_id"=>$file_id
    );
    echo return_data(true,"获取文件id成功",$resData);
}else if($_GET['type'] == "2"){
    //获取预览链接
    $tdata = checkToken();
    $token = $tdata['access_token'];
    $driveid = $tdata['default_drive_id'];
    $file_id = $param['file_id'];
    $param = array(
        "drive_id"=>$driveid,
        "file_id"=>$file_id
    );
    $headers = array("Content-Type: application/json",
        "authorization: Bearer ".$token,
        "cache-control: no-cache");
    $res = aliRequest("/v2/file/get_office_preview_url",$param,$headers);
    if(!$res['preview_url'] || !$res['access_token']){
        echo return_data(false,"获取预览链接失败",null);
        return;
    }
    $resData = array(
        "preview_url"=>$res['preview_url'],
        "access_token"=>$res['access_token']
    );
    echo return_data(true,"获取预览链接成功",$resData);
}else if($_GET['type'] == "3"){
    //获取编辑链接
    $tdata = checkToken();
    $token = $tdata['access_token'];
    $driveid = $tdata['default_drive_id'];
    $file_id = $param['file_id'];
    $param = array(
        "drive_id"=>$driveid,
        "file_id"=>$file_id,
        "option"=>array(
            "readonly"=>false
        )
    );
    $headers = array("Content-Type: application/json",
        "authorization: Bearer ".$token,
        "cache-control: no-cache");
    $res = aliRequest("/v2/file/get_office_edit_url",$param,$headers);
    if(!$res['edit_url'] || !$res['office_access_token']){
        echo return_data(false,"获取编辑链接失败",null);
        return;
    }
    $resData = array(
        "edit_url"=>$res['edit_url'],
        "office_access_token"=>$res['office_access_token'],
        "office_refresh_token"=>$res['office_refresh_token']
    );
    echo return_data(true,"获取编辑链接成功",$resData);
}else if($_GET['type'] == "4"){
    //删除31天前的文件,刷新token 建议每小时调一次
    $cacheData = cacheGet("del","file");
    if($cacheData && strtotime($cacheData['last_time']) > time() - 1800){
        echo return_data(false,"时间未到,请稍后重试",null);
        return;
    }
    cacheSet("del","file",array("last_time"=>date("Y-m-d H:i:s")));
    $items = fileList();
    $nums = count($items);
    $nums6 = 0;
    $file_ids = array();
    foreach ($items as $item) {
        if(strtotime($item['updated_at']) < time() - 3600 * 24 * 31){
            $nums6++;
            array_push($file_ids,$item['file_id']);
        }
    }
    deleteFiles($file_ids);
    $file_text = "总文件:".$nums.",删除31天前:".$nums6;
    $dellog = $file_text;
    if($_GET['remark']){
        $dellog = $dellog.",来自:".$_GET['remark'];
    }else{
        $dellog = $dellog.",来自:".refererToHost();
    }
    logStr("dellog",$dellog);
    echo return_data(true,$file_text,null);
}else if($_GET['type'] == "5"){
    //获取阿里文件流
    $file_id = $_GET['file_id'];
    $name = $_GET['name'];
    $tdata = checkToken();
    $token = $tdata['access_token'];
    $driveid = $tdata['default_drive_id'];
    //获取阿里云盘的流,并写入本地
    $param = array("file_id"=>$file_id,"drive_id"=>$driveid);
    $headers = array("Content-Type: application/json",
        "authorization: Bearer ".$token,
        "cache-control: no-cache");
    $data = aliRequest('/v2/file/get_download_url', $param, $headers);
    if(!$data['url']){
        echo return_data(false,"保存失败:文件地址获取失败",null);
        return;
    }
    $content = getFileByUrl($data['url'],true);
    header('Content-Type: application/octet-stream');
    header('Content-Disposition: attachment; filename="'.$name.'";');
    echo $content;
}else{
    echo return_data(false,"此方法暂不支持","");
}


