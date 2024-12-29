package edu.bednarski.skpbackend.controllers;

import edu.bednarski.skpbackend.domain.dto.PasswordChangeDto;
import edu.bednarski.skpbackend.domain.dto.UserDetailsDto;
import edu.bednarski.skpbackend.services.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping(path = "/api/user")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping(path = "/my-account")
    public ResponseEntity<?> getAccountDetails() {
        String userContext = SecurityContextHolder.getContext().getAuthentication().getName();
        Optional<UserDetailsDto> userDetails = userService.getAccountDetails(userContext);
        if(userDetails.isPresent()) {
            return new ResponseEntity<>(userDetails.get(), HttpStatus.OK);
        }
        else return new ResponseEntity<>("Tozsamosc uzytkownika nie jest znana serwerowi.",HttpStatus.UNAUTHORIZED);
    }

    @PatchMapping(path = "/my-account")
    public ResponseEntity<?> partialUpdateUser(
            @RequestBody UserDetailsDto userDetailsDto
    ) {
        if(userDetailsDto.getPwdHash() != null) return new ResponseEntity<>("Nie mozna w ten sposob zmodyfikowac hasla!",HttpStatus.BAD_REQUEST);
        String userContext = SecurityContextHolder.getContext().getAuthentication().getName();
        Optional<UserDetailsDto> updatedUser = userService.partialUpdate(userContext,userDetailsDto);
        if(updatedUser.isPresent()) {
            return new ResponseEntity<>(updatedUser.get(), HttpStatus.OK);
        }
        else return new ResponseEntity<>("Tozsamosc uzytkownika nie jest znana serwerowi.",HttpStatus.UNAUTHORIZED);
    }

    @PatchMapping(path = "/my-account/change-password")
    public ResponseEntity<?> changePassword(
            @RequestBody PasswordChangeDto passwordChangeDto
    ) {
        if(
                passwordChangeDto == null
                || passwordChangeDto.getNewPassword() == null
                || passwordChangeDto.getOldPassword() == null
        ) return new ResponseEntity<>("Nie otrzymano danych!",HttpStatus.BAD_REQUEST);
        String userContext = SecurityContextHolder.getContext().getAuthentication().getName();
        userService.changePassword(userContext, passwordChangeDto);
        return new ResponseEntity<>("Haslo zostalo zmienione!",HttpStatus.OK);
    }

    @DeleteMapping(path = "/my-account")
    @PreAuthorize("hasRole('ROLE_CLIENT')")
    public ResponseEntity<?> deleteAccount() {
        String userContext = SecurityContextHolder.getContext().getAuthentication().getName();
        Optional<UserDetailsDto> deletedUser = userService.delete(userContext);
        if(deletedUser.isPresent()) {
            return new ResponseEntity<>(deletedUser.get(), HttpStatus.OK);
        }
        else return new ResponseEntity<>("Tozsamosc uzytkownika nie jest znana serwerowi.",HttpStatus.UNAUTHORIZED);
    }
}
