<?php
require_once __DIR__ . '/../init.php';
require_once __DIR__ . '/../db_connection.php';
require_once __DIR__ . '/../verify_Authorization.php';
require '../classes/generate_calendar.php';

function populateCalendarWithEvents(Calendar $calendar, array $events): void {
    foreach ($events as $event) {
        $eventDescription = 'Nazwa drona: ' . $event['drone'];
        $reservationFullDate = $event['reserve'];
        $eventDaySpan = 1;
        $eventDisplayColor = ($event['user_id'] !== $_SESSION['id'])
            ? $event['color']
            : $event['user_color'];
        $calendar->addEvent($eventDescription, $reservationFullDate, $eventDaySpan, $eventDisplayColor);
    }
}
$calendar = new Calendar();
$lastDayOfVisibleMonth = date('Y-m-t', strtotime($calendar->activeYear . '-' . $calendar->activeMonth . '-01'));

$dataReader = new DataReader($lastDayOfVisibleMonth);
$eventsFromDatabase = $dataReader->returnDataBase();

populateCalendarWithEvents($calendar, $eventsFromDatabase);
$calendarViewData = $calendar->getCalendarData();

$daysOfWeekNames = $calendarViewData['daysOfWeek'];
$daysForMonthDisplay = $calendarViewData['days'];
$currentDisplayYear = $calendar->activeYear;
$currentDisplayMonth = $calendar->activeMonth;
$currentDisplayDay = $calendar->activeDay;
$formattedMonthYearHeader = date('F Y', strtotime($currentDisplayYear . '-' . $currentDisplayMonth . '-' . $currentDisplayDay));

$eventRenderLoopIndex = 0;
?>
<section class="dashboard__header">
    <h2 class="dashboard__title">Kalendarz</h2>
</section>
<section class="calendar" data-calendar="true">
    <section class="calendar__header">
        <section class="calendar__month-year">
            <?php echo htmlspecialchars($formattedMonthYearHeader); ?>
        </section>
    </section>
    <section class="calendar__days">
        <?php foreach ($daysOfWeekNames as $dayName): ?>
            <section class="calendar__days__day"><?php echo htmlspecialchars($dayName); ?></section>
        <?php endforeach; ?>
        <?php foreach ($daysForMonthDisplay as $dayData): ?>
            <?php if (isset($dayData['isEmpty']) && $dayData['isEmpty']): ?>
                <section class="calendar__days__num calendar__days__num--empty"><?php echo htmlspecialchars($dayData['day']); ?></section>
            <?php else: ?>
                <section class="calendar__days__num <?php echo htmlspecialchars($dayData['selected'] ?? ''); ?>">
                    <span><?php echo htmlspecialchars($dayData['day']); ?></span>
                    <?php if (!empty($dayData['events'])): ?>
                        <?php foreach ($dayData['events'] as $event): ?>
                            <section class="calendar__days__num__modal" data-index="<?php echo $eventRenderLoopIndex; ?>">test</section>
                            <section class="calendar__days__num__event <?php echo htmlspecialchars($event['color']); ?>" data-index="<?php echo $eventRenderLoopIndex; ?>">
                                <?php echo htmlspecialchars($event['text']); ?>
                            </section>
                            <?php $eventRenderLoopIndex++; ?>
                        <?php endforeach; ?>
                    <?php endif; ?>
                </section>
            <?php endif; ?>
        <?php endforeach; ?>
    </section>
</section>
