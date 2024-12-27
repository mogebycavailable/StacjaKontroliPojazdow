package edu.bednarski.skpbackend.controllers;

import edu.bednarski.skpbackend.domain.dto.JwtTokenDto;
import edu.bednarski.skpbackend.domain.dto.UserDto;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(path = "/api")
public class AuthorizationController {

    @PostMapping(path = "/login")
    public ResponseEntity<?> login(@RequestBody UserDto userDto) {
        if(userDto.getEmail().equals("admin@abc.def") && userDto.getPassword().equals("admin")) {
            return new ResponseEntity<>(new JwtTokenDto("abcdef","reftoken-876234876534","USER"),HttpStatus.OK);
        }
        else return new ResponseEntity<>("Nieprawidlowe dane logowania!",HttpStatus.UNAUTHORIZED);
    }

    @PostMapping(path = "/register")
    public ResponseEntity<?> register(@RequestBody UserDto userDto) {
        if(userDto.getEmail().equals("admin@abc.def")) {
            return new ResponseEntity<>("Taki uzytkownik juz istnieje!",HttpStatus.UNAUTHORIZED);
        }
        else {
            return new ResponseEntity<>("Zarejestrowano",HttpStatus.CREATED);
        }
    }

}
