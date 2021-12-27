<?php
function getCdn(){
    $str = file_get_contents("../cdn.js");
    $str = strstr($str,"http");
    $str = strstr($str,'"',true);
    return $str;
}
$editerPath = getCdn()."/editer/";
$toPathName = $_GET['toPathName'];
$html = file_get_contents($editerPath.$toPathName);
$html = str_replace('src="asserts','src="'.$editerPath.'asserts',$html);
echo $html;