package edu.bednarski.skpbackend.controllers;

import edu.bednarski.skpbackend.domain.dto.UserDetailsDto;
import edu.bednarski.skpbackend.domain.dto.UserUpdatedDto;
import edu.bednarski.skpbackend.services.UserService;
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
public class AdminUsersController {

    private final UserService userService;

    @GetMapping(path = "/users")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<List<UserDetailsDto>> findAll() {
        return new ResponseEntity<>(userService.getAllAccountsByRole("ROLE_CLIENT"), HttpStatus.OK);
    }

    @GetMapping(path = "/users/{email}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<?> findById(
            @PathVariable String email
    ) {
        Optional<UserDetailsDto> foundUser = userService.getAccountDetails(email);
        if(foundUser.isPresent()) return new ResponseEntity<>(foundUser.get(),HttpStatus.OK);
        else return new ResponseEntity<>("Nie znaleziono uzytkownika o takim e-mailu!",HttpStatus.NOT_FOUND);
    }

    @PatchMapping(path = "/users/{email}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<?> partialUpdate(
            @PathVariable String email,
            @RequestBody UserDetailsDto updateData
    ) {
        Optional<UserUpdatedDto> updatedUser = userService.partialUpdate(email,updateData);
        if(updatedUser.isPresent()) {
            UserUpdatedDto updatedUnwrapped = updatedUser.get();
            UserDetailsDto userResponse = UserDetailsDto
                    .builder()
                    .name(updatedUnwrapped.getName())
                    .surname(updatedUnwrapped.getSurname())
                    .phone(updatedUnwrapped.getPhone())
                    .email(updatedUnwrapped.getEmail())
                    .build();
            return new ResponseEntity<>(userResponse,HttpStatus.OK);
        }
        else return new ResponseEntity<>("Nie ma uzytkownika z takim adresem email!",HttpStatus.NOT_FOUND);
    }

    @DeleteMapping(path = "/users/{email}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<?> delete(
            @PathVariable String email
    ) {
        Optional<UserDetailsDto> deletedUser = userService.deleteWithoutConfirmation(email);
        if(deletedUser.isPresent()) {
            return new ResponseEntity<>(deletedUser.get(),HttpStatus.OK);
        }
        else return new ResponseEntity<>("Nie ma uzytkownika z takim adresem email!",HttpStatus.NOT_FOUND);
    }
}
