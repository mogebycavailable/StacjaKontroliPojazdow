package edu.bednarski.skpbackend.controllers;

import edu.bednarski.skpbackend.domain.dto.WorkWeekTemplateDto;
import edu.bednarski.skpbackend.domain.enums.WeekDay;
import edu.bednarski.skpbackend.services.WorkWeekTemplateService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class WorkWeekController {

    private final WorkWeekTemplateService service;

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @GetMapping(path = "/workweek")
    public ResponseEntity<List<WorkWeekTemplateDto>> findAll() {
        return new ResponseEntity<>(service.findAll(), HttpStatus.OK);
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @GetMapping(path = "/workweek/{weekDay}")
    public ResponseEntity<?> findByWeekDay(
            @PathVariable String weekDay
    ) {
        WeekDay id;
        try {
            id = WeekDay.valueOf(weekDay);
        } catch (IllegalArgumentException ex) {
            return new ResponseEntity<>("Podano nieprawidlowy dzien tygodnia!",HttpStatus.BAD_REQUEST);
        }
        Optional<WorkWeekTemplateDto> foundDayConfig = service.findByWeekDay(id);
        if(foundDayConfig.isPresent()) {
            return new ResponseEntity<>(foundDayConfig.get(),HttpStatus.OK);
        }
        else return new ResponseEntity<>("Podany dzien tygodnia byl prawidlowy, lecz nie zostal odnaleziony w bazie danych. Powinienes jak najszybciej dodac konfiguracje dnia tygodnia "+id+" lub zresetowac serwer w celu przywrocenia ustawien domyslnych!",HttpStatus.NOT_FOUND);
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @PostMapping(path = "/workweek")
    public ResponseEntity<?> createWeekDayConfig(
            @RequestBody WorkWeekTemplateDto day
    ) {
        Optional<WorkWeekTemplateDto> createdDay = service.create(day);
        if(createdDay.isPresent()) return new ResponseEntity<>(createdDay.get(),HttpStatus.CREATED);
        else return new ResponseEntity<>("Konfiguracja domyslna tego dnia tygodnia juz istnieje. Uzyj metody PATCH na /api/admin/workweek/"+day.getWeekDay().toString()+", aby ja edytowac.",HttpStatus.BAD_REQUEST);
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @PatchMapping(path = "/workweek/{weekDay}")
    public ResponseEntity<?> partialUpdateWeekDay(
            @PathVariable String weekDay,
            @RequestBody WorkWeekTemplateDto day
    ) {
        WeekDay id;
        try {
            id = WeekDay.valueOf(weekDay);
        } catch (IllegalArgumentException ex) {
            return new ResponseEntity<>("Podano nieprawidlowy dzien tygodnia!",HttpStatus.BAD_REQUEST);
        }
        Optional<WorkWeekTemplateDto> updatedDayConfig = service.partialUpdate(id,day);
        if(updatedDayConfig.isPresent()) {
            return new ResponseEntity<>(updatedDayConfig.get(),HttpStatus.OK);
        }
        else return new ResponseEntity<>("Podany dzien tygodnia byl prawidlowy, lecz nie zostal odnaleziony w bazie danych. Powinienes jak najszybciej dodac konfiguracje dnia tygodnia "+id+" lub zresetowac serwer w celu przywrocenia ustawien domyslnych!",HttpStatus.NOT_FOUND);
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @DeleteMapping(path = "/workweek/{weekDay}")
    public ResponseEntity<?> deleteWeekDay(
            @PathVariable String weekDay
    ) {
        WeekDay id;
        try {
            id = WeekDay.valueOf(weekDay);
        } catch (IllegalArgumentException ex) {
            return new ResponseEntity<>("Podano nieprawidlowy dzien tygodnia!",HttpStatus.BAD_REQUEST);
        }
        Optional<WorkWeekTemplateDto> deleted = service.delete(id);
        if(deleted.isPresent()) {
            return new ResponseEntity<>(deleted.get(),HttpStatus.OK);
        }
        else {
            return new ResponseEntity<>("Podany dzien tygodnia byl prawidlowy, lecz nie zostal odnaleziony w bazie danych. Powinienes jak najszybciej dodac konfiguracje dnia tygodnia "+id+" lub zresetowac serwer w celu przywrocenia ustawien domyslnych!",HttpStatus.NOT_FOUND);
        }
    }
}
