package edu.bednarski.skpbackend.controllers;

import edu.bednarski.skpbackend.domain.dto.*;
import edu.bednarski.skpbackend.services.AppDatetimeFormatterService;
import edu.bednarski.skpbackend.services.CalendarDateService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping(path = "/api/admin")
@RequiredArgsConstructor
public class CalendarController {

    private final CalendarDateService calendarService;

    private final AppDatetimeFormatterService dateFormatter;

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @GetMapping("/calendar/{year}/{month}")
    public ResponseEntity<?> getAllDatesByYearAndMonth(
            @PathVariable("year") Integer year,
            @PathVariable("month") Integer month
    ) {
        if(year!=null && month!=null && month>=1 && month<=12) return new ResponseEntity<>(calendarService.findAllByYearAndMonth(year,month), HttpStatus.OK);
        else return new ResponseEntity<>("Nie podano poprawnych danych URL zapytania!",HttpStatus.BAD_REQUEST);
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @GetMapping("/calendar/{date}")
    public ResponseEntity<?> getCalendarDayByDate(
            @PathVariable("date") String dateString
    ) {
        Date dateObject = dateFormatter.toDate(dateString);
        Optional<CalendarDateDto> foundCalendarDay = calendarService.findByDate(dateObject);
        if(foundCalendarDay.isPresent()) {
            return new ResponseEntity<>(foundCalendarDay.get(), HttpStatus.OK);
        }
        else return new ResponseEntity<>("Nie dodano jeszcze dnia o takiej dacie do kalendarza!",HttpStatus.NOT_FOUND);
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @GetMapping("/calendar")
    public ResponseEntity<?> getCalendarByDateRange(
            @RequestBody DateRangeDto dateRange
    ) {
        if(dateRange == null || dateRange.getStartingDate() == null || dateRange.getEndingDate() == null) {
            return new ResponseEntity<>("Wykryto brakujace dane w ciele zapytania!",HttpStatus.BAD_REQUEST);
        }
        Date startingDate = dateFormatter.toDate(dateRange.getStartingDate());
        Date endingDate = dateFormatter.toDate(dateRange.getEndingDate());
        List<CalendarDateDto> foundDates = calendarService.findByDateBetween(startingDate, endingDate);
        return new ResponseEntity<>(foundDates,HttpStatus.OK);
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @PostMapping("/calendar")
    public ResponseEntity<?> insertSingleDate(
            @RequestBody SingleDateDto singleDateDto
    ) {
        if(singleDateDto == null || singleDateDto.getDate() == null) return new ResponseEntity<>("Wykryto brakujace dane w ciele zapytania!",HttpStatus.BAD_REQUEST);
        Date date = dateFormatter.toDate(singleDateDto.getDate());
        Optional<CalendarDateDto> insertedDate = calendarService.insertSingleWorkDate(date);
        if(insertedDate.isPresent()) return new ResponseEntity<>(insertedDate.get(), HttpStatus.CREATED);
        else return new ResponseEntity<>("Ta data jest juz aktywowana! Uzyj metody PATCH aby modyfikowac jej dane!",HttpStatus.BAD_REQUEST);
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @PostMapping("/calendar/range")
    public ResponseEntity<?> insertDatesByRange(
            @RequestBody DateRangeDto dateRange
    ) {
        if(dateRange == null || dateRange.getStartingDate() == null || dateRange.getEndingDate() == null) {
            return new ResponseEntity<>("Wykryto brakujace dane w ciele zapytania!",HttpStatus.BAD_REQUEST);
        }
        Date startingDate = dateFormatter.toDate(dateRange.getStartingDate());
        Date endingDate = dateFormatter.toDate(dateRange.getEndingDate());
        List<CalendarDateDto> activatedDates = calendarService.fillCalendarByDateBetween(startingDate, endingDate);
        if(activatedDates.isEmpty()) return new ResponseEntity<>("Te daty sa juz aktywowane! Uzyj metody PATCH aby modyfikowac ich dane!",HttpStatus.BAD_REQUEST);
        return new ResponseEntity<>(activatedDates,HttpStatus.CREATED);
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @PostMapping("/calendar/list")
    public ResponseEntity<?> insertDatesByList(
            @RequestBody DateListDto dateList
    ) {
        if(dateList == null || dateList.getDateList() == null) return new ResponseEntity<>("Wykryto brakujace dane w ciele zapytania!",HttpStatus.BAD_REQUEST);
        if(dateList.getDateList().isEmpty()) return new ResponseEntity<>("Wewnatrz listy dat nie podano zadnych dat!",HttpStatus.BAD_REQUEST);
        List<Date> dateObjectList = dateFormatter.toDate(dateList.getDateList());
        List<CalendarDateDto> activatedDates = calendarService.fillCalendarByListOfDates(dateObjectList);
        if(activatedDates.isEmpty()) return new ResponseEntity<>("Te daty sa juz aktywowane! Uzyj metody PATCH aby modyfikowac ich dane!",HttpStatus.BAD_REQUEST);
        return new ResponseEntity<>(activatedDates,HttpStatus.CREATED);
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @PatchMapping("/calendar")
    public ResponseEntity<?> partialUpdateSingleDate(
            @RequestBody SingleDateUpdateDto updateRequest
    ) {
        if(updateRequest == null || updateRequest.getDate() == null || updateRequest.getUpdateData() == null) return new ResponseEntity<>("Wykryto brakujace dane w ciele zapytania!",HttpStatus.BAD_REQUEST);
        Date date = dateFormatter.toDate(updateRequest.getDate());
        CalendarDateDto updateData = updateRequest.getUpdateData();
        Optional<CalendarDateDto> updated = calendarService.partialUpdateBySingleDate(date, updateData);
        if(updated.isPresent()) return new ResponseEntity<>(updated.get(),HttpStatus.OK);
        else return new ResponseEntity<>("Wskazana data jest nieaktywna. Utworz ja najpierw za pomoca metody POST!",HttpStatus.BAD_REQUEST);
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @PatchMapping("/calendar/range")
    public ResponseEntity<?> partialUpdateDateRange(
            @RequestBody DateRangeUpdateDto updateRequest
    ) {
        if(updateRequest == null || updateRequest.getStartingDate() == null || updateRequest.getEndingDate() == null || updateRequest.getUpdateData() == null) return new ResponseEntity<>("Wykryto brakujace dane w ciele zapytania!",HttpStatus.BAD_REQUEST);
        Date startDate = dateFormatter.toDate(updateRequest.getStartingDate());
        Date endDate = dateFormatter.toDate(updateRequest.getEndingDate());
        CalendarDateDto updateData = updateRequest.getUpdateData();
        List<CalendarDateDto> updatedDates = calendarService.partialUpdateByDateBetween(startDate, endDate, updateData);
        if(updatedDates.isEmpty()) return new ResponseEntity<>("Te daty nie sa jeszcze aktywowane! Uzyj metody POST aby je utworzyc!",HttpStatus.BAD_REQUEST);
        return new ResponseEntity<>(updatedDates,HttpStatus.OK);
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @PatchMapping("/calendar/list")
    public ResponseEntity<?> partialUpdateDateList(
            @RequestBody DateListUpdateDto updateRequest
    ) {
        if(updateRequest == null || updateRequest.getDateList() == null || updateRequest.getUpdateData() == null)
            return new ResponseEntity<>("Wykryto brakujace dane w ciele zapytania!",HttpStatus.BAD_REQUEST);
        if(updateRequest.getDateList().isEmpty())
            return new ResponseEntity<>("Wewnatrz listy dat nie podano zadnych dat!",HttpStatus.BAD_REQUEST);
        List<Date> dateObjects = dateFormatter.toDate(updateRequest.getDateList());
        List<CalendarDateDto> updatedDates = calendarService.partialUpdateByListOfDates(dateObjects, updateRequest.getUpdateData());
        if(updatedDates.isEmpty()) return new ResponseEntity<>("Te daty nie sa jeszcze aktywowane! Uzyj metody POST aby je utworzyc!",HttpStatus.BAD_REQUEST);
        return new ResponseEntity<>(updatedDates,HttpStatus.OK);
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @DeleteMapping("/calendar")
    public ResponseEntity<?> deactivateSingleDate(
            @RequestBody SingleDateDto date
    ) {
        if(date == null || date.getDate() == null)
            return new ResponseEntity<>("Wykryto brakujace dane w ciele zapytania!",HttpStatus.BAD_REQUEST);
        Date dateToDelete = dateFormatter.toDate(date.getDate());
        Optional<CalendarDateDto> deleted = calendarService.deleteBySingleWorkDate(dateToDelete);
        if(deleted.isPresent()) return new ResponseEntity<>(deleted.get(), HttpStatus.OK);
        else return new ResponseEntity<>("Ta data jest nieaktywna, to znaczy ze nie jest dodana, wiec nie mozna jej usunac!",HttpStatus.NOT_FOUND);
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @DeleteMapping("/calendar/range")
    public ResponseEntity<?> deactivateDateRange(
            @RequestBody DateRangeDto dateRange
    ) {
        if(dateRange == null || dateRange.getStartingDate() == null || dateRange.getEndingDate() == null) return new ResponseEntity<>("Wykryto brakujace dane w ciele zapytania!",HttpStatus.BAD_REQUEST);
        Date startDate = dateFormatter.toDate(dateRange.getStartingDate());
        Date endDate = dateFormatter.toDate(dateRange.getEndingDate());
        List<CalendarDateDto> deletedDates = calendarService.deleteByDateBetween(startDate, endDate);
        if(!deletedDates.isEmpty()) return new ResponseEntity<>(deletedDates, HttpStatus.OK);
        else return new ResponseEntity<>("Te daty sa nieaktywne, to znaczy ze nie sa dodane, wiec nie mozna ich usunac!",HttpStatus.NOT_FOUND);
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @DeleteMapping("/calendar/list")
    public ResponseEntity<?> deactivateDateList(
            @RequestBody DateListDto dateList
    ) {
        if(dateList == null || dateList.getDateList() == null)
            return new ResponseEntity<>("Wykryto brakujace dane w ciele zapytania!",HttpStatus.BAD_REQUEST);
        if(dateList.getDateList().isEmpty())
            return new ResponseEntity<>("Wewnatrz listy dat nie podano zadnych dat!",HttpStatus.BAD_REQUEST);
        List<Date> datesToDelete = dateFormatter.toDate(dateList.getDateList());
        List<CalendarDateDto> deletedDates = calendarService.deleteByListOfDates(datesToDelete);
        if(!deletedDates.isEmpty()) return new ResponseEntity<>(deletedDates, HttpStatus.OK);
        else return new ResponseEntity<>("Te daty sa nieaktywne, to znaczy ze nie sa dodane, wiec nie mozna ich usunac!",HttpStatus.NOT_FOUND);
    }
}
