package edu.bednarski.skpbackend.services.impl;

import edu.bednarski.skpbackend.domain.dto.CalendarDateDto;
import edu.bednarski.skpbackend.domain.entities.CalendarDateEntity;
import edu.bednarski.skpbackend.domain.entities.WorkWeekTemplateEntity;
import edu.bednarski.skpbackend.domain.enums.WeekDay;
import edu.bednarski.skpbackend.mappers.Mapper;
import edu.bednarski.skpbackend.repositories.CalendarDateRepository;
import edu.bednarski.skpbackend.repositories.WorkWeekTemplateRepository;
import edu.bednarski.skpbackend.services.CalendarDateService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.text.SimpleDateFormat;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CalendarDateServiceImpl implements CalendarDateService {

    private final CalendarDateRepository calendarDateRepository;

    private final WorkWeekTemplateRepository dayTemplateRepository;

    private final Mapper<CalendarDateEntity, CalendarDateDto> mapper;

    @Override
    public List<CalendarDateDto> findAllByYearAndMonth(int year, int month) {
        List<CalendarDateEntity> foundWorkDays = calendarDateRepository.findAllByYearAndMonth(year, month);
        return foundWorkDays.stream().map(mapper::mapTo).collect(Collectors.toList());
    }

    @Override
    public List<CalendarDateDto> findByDateBetween(Date startingDate, Date endingDate) {
        List<CalendarDateEntity> foundWorkDays = calendarDateRepository.findByDateBetween(startingDate, endingDate);
        return foundWorkDays.stream().map(mapper::mapTo).collect(Collectors.toList());
    }

    @Override
    public Optional<CalendarDateDto> findByDate(Date date) {
        Optional<CalendarDateEntity> foundWorkDay = calendarDateRepository.findByDate(date);
        return foundWorkDay.map(mapper::mapTo);
    }

    @Override
    public Optional<CalendarDateDto> insertSingleWorkDate(Date date) {
        Optional<CalendarDateEntity> foundWorkDay = calendarDateRepository.findByDate(date);
        return foundWorkDay.map(existingWorkDay -> Optional.<CalendarDateDto>empty())
                .orElseGet(() -> {
                    Locale locale = new Locale("en","US");
                    SimpleDateFormat sdf = new SimpleDateFormat("EEEE",locale);
                    String weekDayName = sdf.format(date).toUpperCase();
                    WeekDay weekDay = WeekDay.valueOf(weekDayName);
                    Optional<WorkWeekTemplateEntity> dayTemplate = dayTemplateRepository.findById(weekDay);
                    if(dayTemplate.isPresent()) {
                        WorkWeekTemplateEntity foundDayTemplate = dayTemplate.get();
                        CalendarDateEntity workDayToSave = CalendarDateEntity
                                .builder()
                                .date(date)
                                .isWorkFree(foundDayTemplate.getIsWorkFree())
                                .workStart(foundDayTemplate.getWorkStart())
                                .workEnd(foundDayTemplate.getWorkEnd())
                                .weekDay(weekDay)
                                .description("")
                                .build();
                        CalendarDateEntity savedWorkDay = calendarDateRepository.save(workDayToSave);
                        return Optional.of(mapper.mapTo(savedWorkDay));
                    }
                    else throw new RuntimeException("Nie udalo sie odczytac domyslnej konfiguracji dnia pracy: "+weekDayName);
                });
    }

    @Override
    public List<CalendarDateDto> fillCalendarByDateBetween(Date startingDate, Date endingDate) {
        Calendar calendar = Calendar.getInstance();
        calendar.setTime(startingDate);
        List<CalendarDateDto> insertedDates = new ArrayList<>();
        while(!calendar.getTime().after(endingDate)) {
            Date currentDate = calendar.getTime();
            Optional<CalendarDateDto> insertedWorkDay = this.insertSingleWorkDate(currentDate);
            insertedWorkDay.ifPresent(insertedDates::add);
            calendar.add(Calendar.DAY_OF_MONTH, 1);
        }
        return insertedDates;
    }

    @Override
    public List<CalendarDateDto> fillCalendarByListOfDates(List<Date> dates) {
        List<CalendarDateDto> insertedDates = new ArrayList<>();
        for(Date date : dates) {
            Optional<CalendarDateDto> insertedDate = this.insertSingleWorkDate(date);
            insertedDate.ifPresent(insertedDates::add);
        }
        return insertedDates;
    }

    @Override
    public Optional<CalendarDateDto> partialUpdateBySingleDate(Date date, CalendarDateDto customWorkDayData) {
        Optional<CalendarDateEntity> foundWorkDay = calendarDateRepository.findByDate(date);
        return foundWorkDay.map(existingWorkDay -> {
            CalendarDateEntity updateData = mapper.mapFrom(customWorkDayData);
            Optional.ofNullable(updateData.getDescription()).ifPresent(existingWorkDay::setDescription);
            Optional.ofNullable(updateData.getWorkStart()).ifPresent(existingWorkDay::setWorkStart);
            Optional.ofNullable(updateData.getWorkEnd()).ifPresent(existingWorkDay::setWorkEnd);
            Optional.ofNullable(updateData.getIsWorkFree()).ifPresent(existingWorkDay::setIsWorkFree);
            CalendarDateEntity savedChanges = calendarDateRepository.save(existingWorkDay);
            return Optional.of(mapper.mapTo(savedChanges));
        }).orElse(Optional.empty());
    }

    @Override
    public List<CalendarDateDto> partialUpdateByDateBetween(Date startingDate, Date endingDate, CalendarDateDto customWorkDayData) {
        Calendar calendar = Calendar.getInstance();
        calendar.setTime(startingDate);
        List<CalendarDateDto> modifiedDates = new ArrayList<>();
        while(!calendar.getTime().after(endingDate)) {
            Date currentDate = calendar.getTime();
            Optional<CalendarDateDto> insertedWorkDay = this.partialUpdateBySingleDate(currentDate,customWorkDayData);
            insertedWorkDay.ifPresent(modifiedDates::add);
            calendar.add(Calendar.DAY_OF_MONTH, 1);
        }
        return modifiedDates;
    }

    @Override
    public List<CalendarDateDto> partialUpdateByListOfDates(List<Date> dates, CalendarDateDto customWorkDayData) {
        List<CalendarDateDto> updatedDates = new ArrayList<>();
        for(Date date : dates) {
            Optional<CalendarDateDto> updatedDate = this.partialUpdateBySingleDate(date,customWorkDayData);
            updatedDate.ifPresent(updatedDates::add);
        }
        return updatedDates;
    }

    @Override
    public Optional<CalendarDateDto> deleteBySingleWorkDate(Date date) {
        Optional<CalendarDateEntity> workDayToDelete = calendarDateRepository.findByDate(date);
        return workDayToDelete.map(existingWorkDay -> {
            calendarDateRepository.delete(existingWorkDay);
            return Optional.of(mapper.mapTo(existingWorkDay));
        }).orElse(Optional.empty());
    }

    @Override
    public List<CalendarDateDto> deleteByDateBetween(Date startingDate, Date endingDate) {
        Calendar calendar = Calendar.getInstance();
        calendar.setTime(startingDate);
        List<CalendarDateDto> deletedDates = new ArrayList<>();
        while(!calendar.getTime().after(endingDate)) {
            Date currentDate = calendar.getTime();
            Optional<CalendarDateDto> deletedWorkDay = this.deleteBySingleWorkDate(currentDate);
            deletedWorkDay.ifPresent(deletedDates::add);
            calendar.add(Calendar.DAY_OF_MONTH, 1);
        }
        return deletedDates;
    }

    @Override
    public List<CalendarDateDto> deleteByListOfDates(List<Date> dates) {
        List<CalendarDateDto> deletedDates = new ArrayList<>();
        for(Date date : dates) {
            Optional<CalendarDateDto> deletedDate = this.deleteBySingleWorkDate(date);
            deletedDate.ifPresent(deletedDates::add);
        }
        return deletedDates;
    }
}