<?php
require_once __DIR__ . '/helpers.php';
require_once __DIR__ . '/init.php';
require_once __DIR__ . '/db_connection.php';
require_once __DIR__ . '/classes/callDatabase.php';

function verifyUser(): bool {
    if (!checkLogin()) {
        return false;
    }
    if (!checkDbUsers()) {
        redirect('index.php');
        return false;
    }
    return true;
}

?>