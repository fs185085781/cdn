<?php
require_once 'config.php';
function sql_action($sql,$flag){
    $con = mysql_connect($GLOBALS["mysql_host"], $GLOBALS["mysql_user"], $GLOBALS["mysql_pwd"]);
    mysql_query("set names 'utf8' ");
    mysql_query("set character_set_client=utf8");
    mysql_query("set character_set_results=utf8");
    if (!$con) {
        return '连接错误';
    } else {
        mysql_select_db($GLOBALS["mysql_db"], $con);
        $sql = stripslashes($sql);
        $result = mysql_query($sql, $con);
        mysql_close($con);
        if($flag){
            $allresult = array();
            while ($row = mysql_fetch_object($result)) {
                array_push($allresult, $row);
            }
            return $allresult;
        }else{
            return $result;
        }
    }
}
?>