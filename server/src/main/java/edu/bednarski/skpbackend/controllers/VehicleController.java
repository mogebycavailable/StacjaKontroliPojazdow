package edu.bednarski.skpbackend.controllers;

import edu.bednarski.skpbackend.domain.dto.VehicleDto;
import edu.bednarski.skpbackend.services.VehicleService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
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

}
