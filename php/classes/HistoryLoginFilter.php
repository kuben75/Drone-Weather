<?php
require_once __DIR__ . '/../helpers.php';
require_once __DIR__ . '/../init.php';
require_once __DIR__ . '/../db_connection.php';
require_once __DIR__ . '/../verify_Authorization.php';
require_once __DIR__ . '/../classes/templates/message.php';
require_once __DIR__ . '/../classes/templates/singleton.php';

use JetBrains\PhpStorm\NoReturn;
use templates\ResponseSender;
use templates\DatabaseConnector;

class HistoryLoginFilter
{
    private array $rawData;
    private array $conditions = [];
    private string $baseSql = 'SELECT login_time, ip_address FROM login_history';
    private array $paramValues = [];
    private string $paramTypes = '';
    private int $pageRecords = 10;


    /**
     * @throws JsonException
     */
    public function __construct(array $getData)
    {
        $this->rawData = $getData;
        if (empty($_SESSION['id'])) {
            ResponseSender::getMessage()->sendResponse('error', 'Brak aktywnej sesji użytkownika.');
        }
        $this->addUserCondition();
    }

    private function addUserCondition(): void
    {
        $this->conditions[] = 'user_id = ?';
        $this->paramValues[] = $_SESSION['id'];
        $this->paramTypes .= 'i';
    }

    private function addCondition(string $field, string $operator, $value, string $type = 's'): void
    {
        $this->conditions[] = "$field $operator ?";
        $this->paramValues[] = $value;
        $this->paramTypes .= $type;
    }

    private function validateAndBuildConditions(): void
    {
        if (!empty($this->rawData['date_from'])) {
            $dateFromValue = $this->rawData['date_from'];
            $dateFromObj = DateTime::createFromFormat('Y-m-d', $dateFromValue);
            if (!$dateFromObj || $dateFromObj->format('Y-m-d') !== $dateFromValue)
                ResponseSender::getMessage()->sendResponse('error', 'Niepoprawny format daty');

            if ($dateFromObj > new DateTime())
                ResponseSender::getMessage()->sendResponse('error', 'Data "Od" nie może być z przyszłości.');

            $this->addCondition('login_time', '>=', $dateFromValue);
        }

        if (!empty($this->rawData['date_to'])) {
            $dateToValue = $this->rawData['date_to'];
            $dateToObj = DateTime::createFromFormat('Y-m-d', $dateToValue);
            if (!$dateToObj || $dateToObj->format('Y-m-d') !== $dateToValue)
                ResponseSender::getMessage()->sendResponse('error', 'Niepoprawny format daty.');

            if (!empty($this->rawData['date_from'])) {
                $dateFromObjCheck = DateTime::createFromFormat('Y-m-d', $this->rawData['date_from']);
                if ($dateFromObjCheck && $dateToObj < $dateFromObjCheck)
                    ResponseSender::getMessage()->sendResponse('error', 'Data "Do" nie może być wcześniejsza niż data "Od".');
            }
            $this->addCondition('login_time', '<=', $dateToValue . ' 23:59:59');
        }

        if (!empty($this->rawData['ip_address'])) {
            $ipAddress = $this->rawData['ip_address'];
            if (filter_var($ipAddress, FILTER_VALIDATE_IP) === false)
                ResponseSender::getMessage()->sendResponse('error', 'Podaj poprawny adres IP.');

            $this->addCondition('ip_address', 'LIKE', '%' . $ipAddress . '%');
        }
    }

    #[NoReturn]
    public function processRequest(): void
    {
        $this->validateAndBuildConditions();

        $whereClause = '';
        if (!empty($this->conditions))
            $whereClause = ' WHERE ' . implode(' AND ', $this->conditions);

        $countSql = "SELECT COUNT(*) as total_count FROM login_history" . $whereClause;
        $stmtCount = DatabaseConnector::getInstance()->prepare($countSql);

        if (!empty($this->paramTypes) && !empty($this->paramValues))
            $stmtCount->bind_param($this->paramTypes, ...$this->paramValues);

        $stmtCount->execute();
        $totalCountRecords = $stmtCount->get_result()->fetch_assoc()['total_count'] ?? 0;
        $stmtCount->close();
        $this->setPagination($totalCountRecords, $whereClause);


    }

    #[NoReturn] private function setPagination(int $totalCountRecords, string $whereClause): void
    {
        $totalPages = ceil($totalCountRecords / $this->pageRecords);
        $currentPage = isset($this->rawData['page']) ? (int)$this->rawData['page'] : 1;
        if ($currentPage < 1 || ($currentPage > $totalPages && $totalPages > 0))
            $currentPage = 1;

        $offset = ($currentPage - 1) * $this->pageRecords;
        $currentDataSql = $this->baseSql . $whereClause . " ORDER BY login_time DESC LIMIT ? OFFSET ?";
        $currentParamTypes = $this->paramTypes . 'ii';
        $currentDataValues = array_merge($this->paramValues, [$this->pageRecords, $offset]);

        $stmtData = DatabaseConnector::getInstance()->prepare($currentDataSql);
        $stmtData->bind_param($currentParamTypes, ...$currentDataValues);
        $stmtData->execute();
        $result = $stmtData->get_result();
        $resultsArray = [];
        while ($row = $result->fetch_assoc()) {
            $resultsArray[] = $row;
        }
        $stmtData->close();
        ResponseSender::getMessage()->sendResponse('success',
            'Dane zostały pobrane pomyślnie.',
            $resultsArray,
            [
                'pagination' => [
                    'current_page' => $currentPage,
                    'total_pages' => $totalPages,
                    'total_records' => $totalCountRecords,
                    'records_per_page' => $this->pageRecords
                ]
            ]
        );
    }
}

try {
    if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        $filter = new HistoryLoginFilter($_GET);
        $filter->processRequest();
    } else {
        ResponseSender::getMessage()->sendResponse('error', 'Nieprawidłowa metoda żądania.');
    }
} catch (Exception $e) {
    ResponseSender::getMessage()->sendResponse('error', 'Wystąpił nieoczekiwany błąd serwera.');
}