package edu.bednarski.skpbackend.controllers;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(path = "/api")
public class TestController {

    @GetMapping(path = "/secured")
    public ResponseEntity<?> securedEndpoint() {
        return new ResponseEntity<>("Hejka, jestem "+ SecurityContextHolder.getContext().getAuthentication().getName().toString(), HttpStatus.OK);
    }

}
