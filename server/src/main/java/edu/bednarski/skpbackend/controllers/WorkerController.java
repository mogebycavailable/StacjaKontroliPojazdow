package edu.bednarski.skpbackend.controllers;

import edu.bednarski.skpbackend.domain.dto.UserDetailsDto;
import edu.bednarski.skpbackend.domain.dto.UserUpdatedDto;
import edu.bednarski.skpbackend.services.AuthenticationService;
import edu.bednarski.skpbackend.services.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;

@RestController
@RequiredArgsConstructor
@RequestMapping(path = "/api/admin")
public class WorkerController {

    private final AuthenticationService authenticationService;

    private final UserService userService;

    @GetMapping(path = "/worker")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<List<UserDetailsDto>> getAllWorkers() {
        String role = "ROLE_WORKER";
        return new ResponseEntity<>(userService.getAllAccountsByRole(role), HttpStatus.OK);
    }

    @GetMapping(path = "/worker/{email}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<?> getUserById(
            @PathVariable String email
    ) {
        Optional<UserDetailsDto> foundAccount = userService.getAccountDetails(email);
        if(foundAccount.isPresent()) {
            return new ResponseEntity<>(foundAccount.get(),HttpStatus.OK);
        }
        else {
            return new ResponseEntity<>("Nie znaleziono uzytkownika o takim emailu!",HttpStatus.NOT_FOUND);
        }
    }

    @PostMapping(path = "/worker")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<?> createWorker(
            @RequestBody UserDetailsDto workerData
    ) {
        Optional<UserDetailsDto> createdWorker = authenticationService.registerWorker(workerData);
        if(createdWorker.isPresent()) {
            return new ResponseEntity<>(createdWorker.get(),HttpStatus.CREATED);
        }
        else {
            return new ResponseEntity<>("Ten email jest juz zajety!",HttpStatus.BAD_REQUEST);
        }
    }

    @PatchMapping(path = "/worker/{email}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<?> partialUpdateWorker(
            @PathVariable String email,
            @RequestBody UserDetailsDto updateData
    ) {
        Optional<UserUpdatedDto> userUpdatedDto = userService.partialUpdate(email, updateData);
        if(userUpdatedDto.isPresent()) {
            UserUpdatedDto userToReturn = userUpdatedDto.get();
            UserDetailsDto updatedWorker = UserDetailsDto
                    .builder()
                    .name(userToReturn.getName())
                    .email(userToReturn.getEmail())
                    .phone(userToReturn.getPhone())
                    .surname(userToReturn.getSurname())
                    .build();
            return new ResponseEntity<>(updatedWorker,HttpStatus.OK);
        }
        else return new ResponseEntity<>("Konto o takim mailu nie istnieje!",HttpStatus.NOT_FOUND);
    }

    @DeleteMapping(path = "/worker/{email}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<?> deleteWorker(
            @PathVariable String email
    ) {
        Optional<UserDetailsDto> deletedUser = userService.deleteWithoutConfirmation(email);
        if(deletedUser.isPresent()) {
            return new ResponseEntity<>(deletedUser.get(),HttpStatus.OK);
        }
        else return new ResponseEntity<>("Konto o takim mailu nie istnieje!",HttpStatus.NOT_FOUND);
    }
}
