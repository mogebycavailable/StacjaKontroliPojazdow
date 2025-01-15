package edu.bednarski.skpbackend.controllers;

import edu.bednarski.skpbackend.domain.dto.VehicleDto;
import edu.bednarski.skpbackend.services.VehicleService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import java.util.Optional;

@RestController
@RequestMapping(path = "/api")
@RequiredArgsConstructor
public class VehicleController {

    private final VehicleService vehicleService;

    @GetMapping(path = "/vehicles")
    public ResponseEntity<?> getAllUsersVehicles() {
        String userName = SecurityContextHolder.getContext().getAuthentication().getName();
        return new ResponseEntity<>(vehicleService.findAll(userName),HttpStatus.OK);
    }

    @GetMapping(path = "/vehicles/{id}")
    public ResponseEntity<?> getVehicleById(
            @PathVariable("id") Long id
    ) {
        String userName = SecurityContextHolder.getContext().getAuthentication().getName();
        Optional<VehicleDto> returnedVehicle = vehicleService.find(id, userName);
        if(returnedVehicle.isPresent())
            return new ResponseEntity<>(returnedVehicle,HttpStatus.OK);
        else {
            return new ResponseEntity<>("Nie ma takiego ID!",HttpStatus.BAD_REQUEST);
        }
    }

    @PostMapping(path = "/vehicles")
    public ResponseEntity<?> vehicleCreate(
            @RequestBody VehicleDto vehicleDto
    ) {
        String userName = SecurityContextHolder.getContext().getAuthentication().getName();
        Optional<VehicleDto> createdVehicle = vehicleService.create(vehicleDto, userName);
        if(createdVehicle.isPresent()) {
            return new ResponseEntity<>(createdVehicle, HttpStatus.CREATED);
        }
        else return new ResponseEntity<>("Ups! Cos poszlo nie tak!", HttpStatus.BAD_REQUEST);
    }

    @PatchMapping(path = "/vehicles/{id}")
    public ResponseEntity<?> vehicleUpdate(
            @PathVariable("id") Long id,
            @RequestBody VehicleDto vehicleDto
    ) {
        vehicleDto.setId(id);
        String userName = SecurityContextHolder.getContext().getAuthentication().getName();
        Optional<VehicleDto> updateResult = vehicleService.partialUpdate(vehicleDto,userName);
        if(updateResult.isPresent()) {
            return new ResponseEntity<>(updateResult.get(),HttpStatus.OK);
        }
        else {
            return new ResponseEntity<>("Ten pojazd nie istnieje, lub nie masz do niego dostepu!",HttpStatus.BAD_REQUEST);
        }
    }

    @DeleteMapping(path = "/vehicles/{id}")
    public ResponseEntity<?> vehicleDelete(
            @PathVariable("id") Long id
    ) {
        VehicleDto vehicleToDelete = VehicleDto
                .builder()
                .id(id)
                .build();
        String userName = SecurityContextHolder.getContext().getAuthentication().getName();
        Optional<VehicleDto> deletedVehicle = vehicleService.delete(vehicleToDelete,userName);
        if(deletedVehicle.isPresent()) {
            return new ResponseEntity<>(deletedVehicle.get(),HttpStatus.OK);
        }
        else {
            return new ResponseEntity<>("Ten pojazd nie istnieje, lub nie masz do niego dostepu!",HttpStatus.BAD_REQUEST);
        }
    }
}
