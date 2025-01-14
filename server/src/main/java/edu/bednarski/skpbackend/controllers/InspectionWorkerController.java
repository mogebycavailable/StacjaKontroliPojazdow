package edu.bednarski.skpbackend.controllers;

import edu.bednarski.skpbackend.domain.dto.InspectionDetailsDto;
import edu.bednarski.skpbackend.domain.dto.InspectionPatchDto;
import edu.bednarski.skpbackend.services.InspectionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping(path = "/api/worker")
@RequiredArgsConstructor
public class InspectionWorkerController {

    private final InspectionService service;

    @PreAuthorize("hasRole('ROLE_WORKER') OR hasRole('ROLE_ADMIN')")
    @GetMapping(path = "/inspections/{standId}/{date}")
    public ResponseEntity<?> findAllByStandAndDate(
            @PathVariable("standId") Long standId,
            @PathVariable("date") String date
    ) {
        List<InspectionDetailsDto> inspections = service.findInspectionsByStandAndDate(standId, date);
        return new ResponseEntity<>(inspections, HttpStatus.OK);
    }

    @PreAuthorize("hasRole('ROLE_WORKER') OR hasRole('ROLE_ADMIN')")
    @PatchMapping(path = "/inspections/{id}")
    public ResponseEntity<?> partialUpdateInspection(
            @PathVariable("id") Long inspectionId,
            @RequestBody InspectionPatchDto updateData
            ) {
        Optional<InspectionDetailsDto> updatedInspection = service.partialUpdateInspection(inspectionId, updateData);
        if(updatedInspection.isPresent())
            return new ResponseEntity<>(updatedInspection.get(),HttpStatus.OK);
        else return new ResponseEntity<>("Nieprawidlowe ID przegladu!",HttpStatus.NOT_FOUND);
    }



}
