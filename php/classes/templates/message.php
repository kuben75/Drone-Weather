<?php
namespace templates;
use JetBrains\PhpStorm\NoReturn;
class ResponseSender {
    private static ?ResponseSender $instance = null;
    private function __construct () {}

    public static function getMessage(): null|ResponseSender {
        if(self::$instance === null){
            self::$instance = new ResponseSender();
        }
        return self::$instance;
    }

    /**
     * @throws \JsonException
     */
    #[NoReturn] public function sendResponse(string $status, string $message, array $data = null, array $paginationData = null): void {
        header("Content-Type: application/json");
        $response = [
            'status' => $status,
            'message' => $message
        ];
        if($data !== null)
            $response['data'] = $data;

        if($paginationData !== null)
            $response['pagination'] = $paginationData;

        echo json_encode($response, JSON_THROW_ON_ERROR);
        exit;
    }
}