package edu.bednarski.skpbackend.services;

import edu.bednarski.skpbackend.domain.dto.CalendarDateDto;
import edu.bednarski.skpbackend.domain.entities.CalendarDateEntity;

import java.util.Date;
import java.util.List;
import java.util.Optional;

public interface CalendarDateService {

    List<CalendarDateDto> findAllByYearAndMonth(int year, int month);

    List<CalendarDateDto> findByDateBetween(Date startingDate, Date endingDate);

    Optional<CalendarDateDto> findByDate(Date date);

    Optional<CalendarDateDto> insertSingleWorkDate(Date date);

    List<CalendarDateDto> fillCalendarByDateBetween(Date startingDate, Date endingDate);

    List<CalendarDateDto> fillCalendarByListOfDates(List<Date> dates);

    Optional<CalendarDateDto> partialUpdateBySingleDate(Date date, CalendarDateDto customWorkDayData);

    List<CalendarDateDto> partialUpdateByDateBetween(Date startingDate, Date endingDate, CalendarDateDto customWorkDayData);

    List<CalendarDateDto> partialUpdateByListOfDates(List<Date> dates, CalendarDateDto customWorkDayData);

    Optional<CalendarDateDto> deleteBySingleWorkDate(Date date);

    List<CalendarDateDto> deleteByDateBetween(Date startingDate, Date endingDate);

    List<CalendarDateDto> deleteByListOfDates(List<Date> dates);

}
