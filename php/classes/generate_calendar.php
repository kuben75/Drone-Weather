<?php
require_once __DIR__ . '/../init.php';
require_once __DIR__ . '/../db_connection.php';
require_once __DIR__ . '/../verify_Authorization.php';
require_once __DIR__ . '/../classes/templates/singleton.php';

use templates\DatabaseConnector;
date_default_timezone_set('Europe/Warsaw');
header('content-type: application/json');
class Calendar
{
    public string $activeYear, $activeMonth, $activeDay;
    private array $events = [];

    public function __construct(?string $date = null)
    {
        $this->activeYear = $date ? date('Y', strtotime($date)) : date('Y');
        $this->activeMonth = $date ? date('m', strtotime($date)) : date('m');
        $this->activeDay = $date ? date('d', strtotime($date)) : date('d');
    }

    public function addEvent($txt, $date, $days = 1, $color = ''): void
    {
        $this->events[] = [$txt, $date, $days, $color];
    }

    public function getCalendarData(): array
    {
        $numDays = date('t', strtotime("$this->activeYear-$this->activeMonth-$this->activeDay"));
        $lastMonth = date('j', strtotime("last day of previous month", strtotime("$this->activeYear-$this->activeMonth-$this->activeDay")));
        $daysOfWeek = ['Niedziela', 'Poniedziałek', 'Wtorek', 'Środa', 'Czwartek', 'Piątek', 'Sobota'];
        $firstDayOfWeek = date('w', strtotime("$this->activeYear-$this->activeMonth-1"));

        $calendarData = ['daysOfWeek' => $daysOfWeek, 'days' => [], 'events' => $this->events];

        for ($i = $firstDayOfWeek; $i > 0; $i--) {
            $calendarData['days'][] = ['day' => $lastMonth - $i + 1, 'isEmpty' => true];
        }

        for ($i = 1; $i <= $numDays; $i++) {
            $selected = $i == $this->activeDay ? 'selected' : '';
            $eventsForDay = $this->getEventsForDay($i);
            $calendarData['days'][] = ['day' => $i, 'selected' => $selected, 'events' => $eventsForDay];
        }

        for ($i = 1; $i <= (35 - $numDays - $firstDayOfWeek); $i++) {
            $calendarData['days'][] = ['day' => $i, 'isEmpty' => true];
        }

        return $calendarData;
    }

    private function getEventsForDay($day): array
    {
        $eventsForDay = [];
        foreach ($this->events as $event) {
            for ($d = 0; $d < $event[2]; $d++) {
                if (date('Y-m-d', strtotime("$this->activeYear-$this->activeMonth-$day -$d days")) == date('Y-m-d', strtotime($event[1]))) {
                    $eventsForDay[] = ['text' => $event[0], 'color' => $event[3]];
                }
            }
        }
        return $eventsForDay;
    }
}
class DataReader
{
    private string $lastDayOfMonth;

    public function __construct($lastDayOfMonth)
    {
        $this->lastDayOfMonth = $lastDayOfMonth;
    }

    public function returnDataBase(): array
    {
        $stmt = DatabaseConnector::getInstance()->prepare("SELECT id, user_id, drone, reserve, color, user_color FROM coords WHERE reserve > NOW() AND reserve < ?");
        $stmt->bind_param('s', $this->lastDayOfMonth);
        $stmt->execute();
        $result = $stmt->get_result();
        return $result->fetch_all(MYSQLI_ASSOC);
    }

    public function __destruct()
    {
        DatabaseConnector::destroyInstance();
    }
}
?>
