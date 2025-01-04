package edu.bednarski.skpbackend.controllers;

import edu.bednarski.skpbackend.exceptions.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(BadOldPasswordException.class)
    public ResponseEntity<?> handleBadOldPasswordException(final BadOldPasswordException ex) {
        return new ResponseEntity<>(ex.getMessage(), HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(SamePasswordException.class)
    public ResponseEntity<?> handleSamePasswordException(final SamePasswordException ex) {
        return new ResponseEntity<>(ex.getMessage(), HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(BadPasswordException.class)
    public ResponseEntity<?> handleBadPasswordException(final BadPasswordException ex) {
        return new ResponseEntity<>(ex.getMessage(), HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(DataNotProvidedException.class)
    public ResponseEntity<?> handleVehicleNotProvidedException(final BadPasswordException ex) {
        return new ResponseEntity<>(ex.getMessage(), HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(DuplicateVinException.class)
    public ResponseEntity<?> handleDuplicateVinException(final DuplicateVinException ex) {
        return new ResponseEntity<>(ex.getMessage(), HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(UnknownVehicleTypeException.class)
    public ResponseEntity<?> handleUnknownVehicleTypeException(final UnknownVehicleTypeException ex) {
        return new ResponseEntity<>(ex.getMessage(), HttpStatus.BAD_REQUEST);
    }

}
