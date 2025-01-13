package edu.bednarski.skpbackend.controllers;

import edu.bednarski.skpbackend.domain.dto.InspectionDetailsDto;
import edu.bednarski.skpbackend.domain.dto.InspectionPreflightDto;
import edu.bednarski.skpbackend.domain.dto.InspectionPreflightResponseDto;
import edu.bednarski.skpbackend.domain.dto.InspectionRequestDto;
import edu.bednarski.skpbackend.services.InspectionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping(path = "/api/user")
@RequiredArgsConstructor
public class InspectionController {

    private final InspectionService service;

    @GetMapping(path = "/inspections/{vehicleId}/{date}")
    public ResponseEntity<?> findFreeHours(
            @PathVariable("vehicleId") Long vehicleId,
            @PathVariable("date") String date
    ) {
        InspectionPreflightDto data = InspectionPreflightDto
                .builder()
                .vehicleId(vehicleId)
                .date(date)
                .build();
        List<InspectionPreflightResponseDto> freeHours = service.findFreeHours(data);
        return new ResponseEntity<>(freeHours, HttpStatus.OK);
    }

    @PostMapping(path = "/inspections")
    public ResponseEntity<?> reserveInspection(
            @RequestBody InspectionRequestDto data
    ) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        Optional<InspectionDetailsDto> createdInspection = service.createInspection(email, data);
        if(createdInspection.isPresent())
            return new ResponseEntity<>(createdInspection.get(),HttpStatus.CREATED);
        else
            return new ResponseEntity<>("Ups! Cos poszlo nie tak!", HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @DeleteMapping(path = "/inspections/{id}")
    public ResponseEntity<?> deleteInspection(
            @PathVariable("id") Long id
    ) {
        Optional<InspectionDetailsDto> deletedInspection = service.delete(id);
        if(deletedInspection.isPresent())
            return new ResponseEntity<>(deletedInspection.get(),HttpStatus.OK);
        else return new ResponseEntity<>("Przeglad o takim ID nie istnieje!",HttpStatus.NOT_FOUND);
    }

}
