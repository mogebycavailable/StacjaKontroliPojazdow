package edu.bednarski.skpbackend.controllers;

import edu.bednarski.skpbackend.domain.dto.InspectionDetailsDto;
import edu.bednarski.skpbackend.services.InspectionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping(path = "/api/user")
@RequiredArgsConstructor
public class UserInspectionsController {

    private final InspectionService service;

    @GetMapping(path = "/inspections")
    public ResponseEntity<?> findAllUsersInspections() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        List<InspectionDetailsDto> allUsersInspections = service.findAllUsersInspections(email);
        return new ResponseEntity<>(allUsersInspections, HttpStatus.OK);
    }
}
