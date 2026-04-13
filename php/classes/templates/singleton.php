<?php
namespace templates;

require_once __DIR__ . '/../../db_connection.php';

class DatabaseConnector {
    private static ?\mysqli $con = null;
    private function __construct() {}

    public static function getInstance(): false|\mysqli|null
    {
        if(self::$con === null){
            self::$con = dbConnection();
        }
        return self::$con;
    }

    public static function destroyInstance(): void
    {
        if(self::$con !== null){
            self::$con->close();
            self::$con = null;
        }
    }
}
