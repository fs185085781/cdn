<?php
error_reporting(0);
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: *");
include 'function.php';
define('RSA_PUBLIC',
'-----BEGIN PUBLIC KEY-----
MIGeMA0GCSqGSIb3DQEBAQUAA4GMADCBiAKBgGEXlwVlT35/HrL7/fAQ+G0adwVZ
1QB8KbszNwelyxdBdBcy9rcr0XU5+USnYROMJwCZOFMtBy/11q8DwCQmG6jW3Vvx
w6tyeBbwnJbpMQ5L0aYgreTBk1R6/79u5AqfxduJW2KTb4aQySB2kRZdMl8uDkqJ
pLdT63Dateg7D0+RAgMBAAE=
-----END PUBLIC KEY-----');
define('RSA_PRIVATE',
'-----BEGIN RSA PRIVATE KEY-----
MIICWgIBAAKBgGEXlwVlT35/HrL7/fAQ+G0adwVZ1QB8KbszNwelyxdBdBcy9rcr
0XU5+USnYROMJwCZOFMtBy/11q8DwCQmG6jW3Vvxw6tyeBbwnJbpMQ5L0aYgreTB
k1R6/79u5AqfxduJW2KTb4aQySB2kRZdMl8uDkqJpLdT63Dateg7D0+RAgMBAAEC
gYBASyTAd/QKKhekImZoAHThmrLSIkiAh7gCtMluEQXJophDfIYPib6sR/We1s/b
5+Uz6kJ4IcsuoTbGsk8cIPgTJCQq0CYFbknjYToK3gC18bYf0oNOTOMwsBVKtb9e
Rsv6k0HXgv2L1/c5Vmm/PP7WzjNl5nZc7ZAZy9DQxVLnOQJBALvNdMnGJ175saqW
tJBR4k1yBMmvZz/OeHW/ivG9wj/8VzOoy4wBI0AxwbihlcXLulwfyQXvjsZjfmBJ
rofR9esCQQCEWX3rDMLZrUUnRQN2l8WiNXrB4BUkgrM0WP/RRGoCN60u5GtTPMwF
4acrrxOicXasPI82aDSBIyaW6SkQgMVzAkAhoXFAkNOMFnrSaZp8Ha3A4KIq29ZJ
ftfjfiGLmMeoXa/f+GI6+Bkv7bkbLxR7DziYNrjw7y1KKZb/9zHh8J9xAkAOZ6Mh
2yC2CnrVXFiVJs226vUyds42TBdvIiStxTF4jlDGIsxfoeVe2oGUapjLfGf7NRgt
Rsg4KfhAQp5aknlrAkAfu9DVE1oREhpSov+mqFJlB6Kii4Ekbf8INTxoHnjZ9967
XTWvldK6l0XDKvlxrJ2AlhjVyDk+RLAxyze/NhBU
-----END RSA PRIVATE KEY-----');
function post(){
    $obj = array("flag"=>false,"msg"=>"未知操作类型");
    $private_key = openssl_pkey_get_private(RSA_PRIVATE);
    $public_key = openssl_pkey_get_public(RSA_PUBLIC);
    if(!$private_key){
        $obj['msg'] = "私钥不可用";
        return json_encode($obj);
    }
    if(!$public_key){
        $obj['msg'] = "公钥不可用";
        return json_encode($obj);
    }
    /*$source = "1234";
    echo "加密前: $source";
    openssl_public_encrypt($source,$crypttext,$public_key);
    echo "加密后:".base64_encode($crypttext);
    openssl_private_decrypt($crypttext,$newsource,$private_key);
    echo "解密后: $newsource";*/
    $jiamisql=$_POST['sql'];
    $res = openssl_private_decrypt(base64_decode($jiamisql), $sql, $private_key);
    if(!$res){
        $obj['msg'] = "sql解密失败";
        return json_encode($obj);
    }
    $flag = false;
    if(strpos(strtolower(trim($sql)),'select') === 0){
        $flag = true;
    }
    $result = sql_action($sql,$flag);
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