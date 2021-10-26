<?php

/**
 * 接口API地址
 */
$api = "http://api.storagesdk.com/";


/**
 * 接口方法
 */
$method_gettoken = "restful/storageapi/storage/getToken"; // 获取操作密钥token
$method_upload = "restful/storageapi/file/uploadFile"; // 上传文件
$method_geturl = "restful/storageapi/file/getFileUrl"; // 获取文件访问链接
$method_delfile = "restful/storageapi/file/deleteFile"; // 删除文件
$method_create_folder = "restful/storageapi/folder/createFolder";// 创建文件夹
$method_delete_folder = "restful/storageapi/folder/deleteFolder"; // 删除文件夹
$method_sub_folderandfiles = "restful/storageapi/folder/getSubFoldersAndFiles"; // 获取当前目录下子目录及其文件
$method_rename_folder = "restful/storageapi/folder/renameFolder"; // 重命名文件夹
$method_rename_file = "restful/storageapi/file/renameFile"; // 重命名文件
$method_copyfile = "restful/storageapi/file/copyFile"; // 复制文件
$method_copyfolder = "restful/storageapi/folder/copyFolder"; // 复制文件夹

/**
 * 参数，此处为测试账号业务信息； 替换为用户的对象存储业务信息，在会员中心可以获取
 */
$accessKey = ""; // 用户key值对：Access_Key，可在会员中心获取
$secretKey = ""; // 用户key值对：Secret_Key，可在会员中心获取
$resource = ""; // API调用来源，可在会员中心点击获取
$voucher = ""; // 凭证，用户通过accesskey和secretkey获取的，可在会员中心点击，以邮件形式获取
//
$token = "" ; // 用户操作秘钥，是用户调用api接口时必须用到的的秘钥；可以通过API获取

/**
 * 公共类、方法
 */
class URLRequest
{
    public $url;
    public $headers;
    public $params;
    public $body;
    public $expectedFormat;
    public $method;
    public $data;
    //
    public function URLRequest($aUrl, array $aHeaders, array $aParams, $aFormat = "json", $isPost = false, $aBody = "+")
    {
        $this->url = $aUrl;
        $this->headers = $aHeaders;
        $this->params = $aParams;
        $this->expectedFormat = $aFormat;
        $this->method = ($isPost ? "POST" : "GET");
        $this->body = $aBody;
    }
    //
    public function exec()
    {
        $url = $this->url;
        $request = curl_init();
        curl_setopt($request, CURLOPT_URL, $url);
        curl_setopt($request, CURLOPT_HEADER, 1);
        curl_setopt($request, CURLOPT_HTTPHEADER, $this->headers);
        curl_setopt($request, CURLOPT_RETURNTRANSFER, 1);
        if($this->method == "POST")
        {
            curl_setopt($request, CURLOPT_POST, 1);
            curl_setopt($request, CURLOPT_POSTFIELDS, $this->body);
        }
        $response = curl_exec($request);
        $httpCode = curl_getinfo($request, CURLINFO_HTTP_CODE);
        if ($httpCode == '200') {
            $headerSize = curl_getinfo($request, CURLINFO_HEADER_SIZE);
            $header = substr($response, 0, $headerSize);
            $body = substr($response, $headerSize);
            curl_close($request);
            return $body;
        }else{
            curl_close($request);
            return $response;
        }
    }
}

/** 获取操作秘钥token函数 **/
function get_token(){
    global $api,$method_gettoken,$voucher,$accessKey,$secretKey,$resource;
    $url = "{$api}{$method_gettoken}";
    $query = array();
    $data = array();
    $data["voucher"] = $voucher;
    $data["accessKey"] = $accessKey ;
    $data["secretKey"] = $secretKey;
    $data["resource"] = $resource;
    $body = json_encode($data);
    $headers = array("Content-Type: application/json; charset=utf-8");
    $request = new URLRequest($url, $headers, $query, "json", true, $body);
    $response = $request->exec();
    //print_r($response);
    return $response;
}
/** 根据文件流上传 */
function send_file_io($bucketName,$data,$fileName){
    global $api,$method_upload,$token,$resource;
    $url = "{$api}{$method_upload}";
    $query = array();
    $file = base64_encode($fileName);
    $len = strlen($data);
    $headers = array("Content-Type: application/json;charset=utf-8",
        "token:{$token}",
        "resource:{$resource}",
        "bucketName:{$bucketName}",
        "fileName:{$file}",
        "length:{$len}");
    $request = new URLRequest($url, $headers, $query, "json", true, $data);
    $response = $request->exec();
    //print_r($response);
    $msg = json_decode($response,true)["message"];
    return $msg;
}

/** 上传文件函数 **/
function send_file($bucketName,$localFile,$fileName){
    $data = file_get_contents($localFile);
    return send_file_io($bucketName,$data,$fileName);
}

/** 获取文件的url函数 **/
function get_url($bucketName,$fileName,$minutes){
    global $api,$method_geturl,$token,$resource;
    $url = "{$api}{$method_geturl}";
    $query = array();
    $data = array();
    $data["token"] = $token;
    $data["resource"] =$resource;
    $data["fileName"] = $fileName;
    $data["bucketName"] = $bucketName;
    $data["minutes"] = $minutes;
    $body = json_encode($data);
    $headers = array("Content-Type: application/json; charset=utf-8");
    $request = new URLRequest($url, $headers, $query, "json", true, $body);
    $response = $request->exec();
    //print_r($response);
    $url = json_decode($response,true)["message"];
    return $url;
}

/** 删除文件函数**/
function del_file($bucketName,$fileName){
    global $api,$method_delfile,$token,$resource;
    $url = "{$api}{$method_delfile}";
    $query = array();
    $data = array();
    $data["token"] = $token;
    $data["resource"] = $resource;
    $data["bucketName"] = $bucketName;
    $data["fileName"] = $fileName;
    $body = json_encode($data);
    $headers = array("Content-Type: application/json; charset=utf-8");
    $request = new URLRequest($url, $headers, $query, "json", true, $body);
    $response = $request->exec();
    $result = json_decode($response, true)["message"];
    return $result;
}

/** 创建文件夹**/
function create_folder($bucketName,$folderName){
    global $api,$method_create_folder,$token,$resource;
    $url = "{$api}{$method_create_folder}";
    $query = array();
    $data = array();
    $data["token"] = $token;
    $data["resource"] = $resource;
    $data["bucketName"] = $bucketName;
    $data["folderName"] = $folderName;
    $body = json_encode($data);
    $headers = array("Content-Type: application/json; charset=utf-8");
    $request = new URLRequest($url, $headers, $query, "json", true, $body);
    $response = $request->exec();
    $result = json_decode($response, true)["message"];
    return $result;
}

/** 删除文件夹**/
function delete_folder($bucketName,$folderName){
    global $api,$method_delete_folder,$token,$resource;
    $url = "{$api}{$method_delete_folder}";
    $query = array();
    $data = array();
    $data["token"] = $token;
    $data["resource"] = $resource;
    $data["bucketName"] = $bucketName;
    $data["folderName"] = $folderName;
    $body = json_encode($data);
    $headers = array("Content-Type: application/json; charset=utf-8");
    $request = new URLRequest($url, $headers, $query, "json", true, $body);
    $response = $request->exec();
    $result = json_decode($response, true)["message"];
    return $result;
}


/** 获取当前目录下子目录及文件**/
function get_sub_folderandfiles($bucketName,$folderName,$isGetFile){
    global $api,$method_sub_folderandfiles,$token,$resource;
    $url = "{$api}{$method_sub_folderandfiles}";
    $query = array();
    $data = array();
    $data["token"] = $token;
    $data["resource"] = $resource;
    $data["bucketName"] = $bucketName;
    $data["folderName"] = $folderName;
    $data["isGetFile"] = $isGetFile;
    $body = json_encode($data);
    $headers = array("Content-Type: application/json; charset=utf-8");
    $request = new URLRequest($url, $headers, $query, "json", true, $body);
    $response = $request->exec();
    $result = json_decode($response, true)["message"];
    return $result;
}

/*重命名文件*/
function rename_file($bucketName,$oldFileName,$newFileName){
    global $api,$method_rename_file,$token,$resource;
    $url = "{$api}{$method_rename_file}";
    $query = array();
    $data = array();
    $data["token"] = $token;
    $data["resource"] = $resource;
    $data["bucketName"] = $bucketName;
    $data["oldFileName"] = $oldFileName;
    $data["newFileName"] = $newFileName;
    $body = json_encode($data);
    $headers = array("Content-Type: application/json; charset=utf-8");
    $request = new URLRequest($url, $headers, $query, "json", true, $body);
    $response = $request->exec();
    $result = json_decode($response, true)["message"];
    return $result;
}

/*重命名文件夹*/
function rename_folder($bucketName,$oldFolderName,$newFolderName){
    global $api,$method_rename_folder,$token,$resource;
    $url = "{$api}{$method_rename_folder}";
    $query = array();
    $data = array();
    $data["token"] = $token;
    $data["resource"] = $resource;
    $data["bucketName"] = $bucketName;
    $data["oldFolderName"] = $oldFolderName;
    $data["newFolderName"] = $newFolderName;
    $body = json_encode($data);
    $headers = array("Content-Type: application/json; charset=utf-8");
    $request = new URLRequest($url, $headers, $query, "json", true, $body);
    $response = $request->exec();
    $result = json_decode($response, true)["message"];
    return $result;
}

/*复制文件*/
function copyfile($oldBucketName,$oldFileName,$newBucketName,$newFileName){
    global $api,$method_copyfile,$token,$resource;
    $url = "{$api}{$method_copyfile}";
    $query = array();
    $data = array();
    $data["token"] = $token;
    $data["resource"] = $resource;
    $data["oldBucketName"] = $oldBucketName;
    $data["oldFileName"] = $oldFileName;
    $data["newBucketName"] = $newBucketName;
    $data["newFileName"] = $newFileName;
    $body = json_encode($data);
    $headers = array("Content-Type: application/json; charset=utf-8");
    $request = new URLRequest($url, $headers, $query, "json", true, $body);
    $response = $request->exec();
    $result = json_decode($response, true)["message"];
    return $result;
}
/*复制文件夹*/
function copyfolder($oldBucketName,$oldFolderName,$newBucketName,$newFolderName){
    global $api,$method_copyfolder,$token,$resource;
    $url = "{$api}{$method_copyfolder}";
    $query = array();
    $data = array();
    $data["token"] = $token;
    $data["resource"] = $resource;
    $data["oldBucketName"] = $oldBucketName;
    $data["oldFolderName"] = $oldFolderName;
    $data["newBucketName"] = $newBucketName;
    $data["newFolderName"] = $newFolderName;
    $body = json_encode($data);
    $headers = array("Content-Type: application/json; charset=utf-8");
    $request = new URLRequest($url, $headers, $query, "json", true, $body);
    $response = $request->exec();
    $result = json_decode($response, true)["message"];
    return $result;
}
$tokenMsg = get_token();
$msg = json_decode($tokenMsg,true)["message"];
$arr = explode(":",$msg);
$token = $arr[1];
?>
