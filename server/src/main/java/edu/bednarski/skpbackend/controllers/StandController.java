package edu.bednarski.skpbackend.controllers;

import edu.bednarski.skpbackend.domain.dto.StandDto;
import edu.bednarski.skpbackend.services.StandService;
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
public class StandController {

    private final StandService standService;

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @GetMapping(path = "/stand")
    public ResponseEntity<List<StandDto>> findAllStands() {
        return new ResponseEntity<>(standService.findAll(), HttpStatus.OK);
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @GetMapping(path = "/stand/{id}")
    public ResponseEntity<?> findStandById(
            @PathVariable Long id
    ) {
        Optional<StandDto> foundStand = standService.findById(id);
        if(foundStand.isPresent()) {
            return new ResponseEntity<>(foundStand.get(),HttpStatus.OK);
        }
        else {
            return new ResponseEntity<>("To stanowisko nie istnieje!",HttpStatus.BAD_REQUEST);
        }
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @PostMapping(path = "/stand")
    public ResponseEntity<?> createStand(
            @RequestBody StandDto standDto
    ) {
        Optional<StandDto> createdStand = standService.create(standDto);
        if(createdStand.isPresent()) {
            return new ResponseEntity<>(createdStand.get(),HttpStatus.CREATED);
        }
        else {
            return new ResponseEntity<>("Ups! Cos poszlo nie tak. Sprobuj ponownie.", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @PatchMapping(path = "/stand/{id}")
    public ResponseEntity<?> partialUpdateStand(
            @PathVariable Long id,
            @RequestBody StandDto standDto
    ) {
        Optional<StandDto> updatedStand = standService.partialUpdate(id, standDto);
        if(updatedStand.isPresent()) {
            return new ResponseEntity<>(updatedStand.get(),HttpStatus.OK);
        }
        else {
            return new ResponseEntity<>("Ups! Cos poszlo nie tak. Sprobuj ponownie.", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @DeleteMapping(path = "/stand/{id}")
    public ResponseEntity<?> deleteStand(
            @PathVariable Long id
    ) {
        Optional<StandDto> deletedStand = standService.delete(id);
        if(deletedStand.isPresent()) return new ResponseEntity<>(deletedStand.get(),HttpStatus.OK);
        else {
            return new ResponseEntity<>("Usuwane stanowsiko nie istnieje!", HttpStatus.BAD_REQUEST);
        }
    }
}
