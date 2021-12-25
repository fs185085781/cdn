<?php
$cdn = json_decode(file_get_contents("../cdn.js"),true);
$editerPath = $cdn['cdn']."/editer/";
$toPathName = $_GET['toPathName'];
$html = file_get_contents($editerPath.$toPathName);
$html = str_replace('src="asserts','src="'.$editerPath.'asserts',$html);
echo $html;

