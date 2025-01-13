package edu.bednarski.skpbackend.controllers;

import edu.bednarski.skpbackend.domain.dto.InspectionDetailsDto;
import edu.bednarski.skpbackend.services.InspectionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping(path = "/api/admin")
@RequiredArgsConstructor
public class AdminInspectionsController {

    private final InspectionService service;

    @GetMapping(path = "/inspections")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<?> findAll() {
        List<InspectionDetailsDto> allInspections = service.findAllInspections();
        return new ResponseEntity<>(allInspections, HttpStatus.OK);
    }

    @GetMapping(path = "/inspections/{id}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<?> findById(
            @PathVariable("id") Long id
    ) {
        Optional<InspectionDetailsDto> foundInspection = service.findInspectionById(id);
        if(foundInspection.isPresent())
            return new ResponseEntity<>(foundInspection.get(), HttpStatus.OK);
        else return new ResponseEntity<>("Przeglad o takim ID nie istnieje!",HttpStatus.NOT_FOUND);
    }

    @DeleteMapping(path = "/inspections/{id}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<?> deleteById(
            @PathVariable("id") Long id
    ) {
        Optional<InspectionDetailsDto> deletedInspection = service.delete(id);
        if(deletedInspection.isPresent())
            return new ResponseEntity<>(deletedInspection.get(),HttpStatus.OK);
        else return new ResponseEntity<>("Przeglad o takim ID nie istnieje!",HttpStatus.NOT_FOUND);
    }

}
