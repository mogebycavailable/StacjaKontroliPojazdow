package edu.bednarski.skpbackend.controllers;

import edu.bednarski.skpbackend.domain.dto.JwtTokenDto;
import edu.bednarski.skpbackend.domain.dto.UserDetailsDto;
import edu.bednarski.skpbackend.domain.dto.UserDto;
import edu.bednarski.skpbackend.services.AuthenticationService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping(path = "/api")
@RequiredArgsConstructor
public class AuthorizationController {

    private final AuthenticationService authenticationService;

    @PostMapping(path = "/login")
    public ResponseEntity<?> login(@RequestBody UserDto userDto) {
        Optional<JwtTokenDto> tokenResponse = authenticationService.login(userDto);
        if(tokenResponse.isPresent()) {
            return new ResponseEntity<>(tokenResponse.get(),HttpStatus.OK);
        }
        else {
            return new ResponseEntity<>("Nieprawidlowe dane logowania!",HttpStatus.UNAUTHORIZED);
        }
    }

    @PostMapping(path = "/register")
    public ResponseEntity<?> register(@RequestBody UserDetailsDto userDetailsDto) {
        Optional<JwtTokenDto> tokenResponse = authenticationService.register(userDetailsDto);
        if(tokenResponse.isPresent()) {
            return new ResponseEntity<>(tokenResponse.get(),HttpStatus.CREATED);
        }
        else {
            return new ResponseEntity<>("Ten email jest juz zajety!",HttpStatus.BAD_REQUEST);
        }
    }

    @PostMapping(path = "/refresh")
    public ResponseEntity<?> refresh(
            HttpServletRequest request,
            HttpServletResponse response
    ) {
        Optional<JwtTokenDto> refreshed = authenticationService.refreshToken(request, response);
        if(refreshed.isPresent()) {
            return new ResponseEntity<>(refreshed.get(),HttpStatus.OK);
        }
        else {
            return new ResponseEntity<>("Sesja wygasla. Zaloguj sie ponownie.",HttpStatus.UNAUTHORIZED);
        }
    }


}
