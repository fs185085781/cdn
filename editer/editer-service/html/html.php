<?php
$editerPath = "https://fs185085781.gitee.io/cdn/editer/";
$toPathName = $_GET['toPathName'];
$html = file_get_contents($editerPath.$toPathName);
$html = str_replace('src="asserts','src="'.$editerPath.'asserts',$html);
echo $html;

