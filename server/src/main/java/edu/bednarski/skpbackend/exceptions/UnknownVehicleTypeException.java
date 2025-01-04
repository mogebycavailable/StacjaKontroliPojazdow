package edu.bednarski.skpbackend.exceptions;

public class UnknownVehicleTypeException extends RuntimeException {

    public UnknownVehicleTypeException() {
        super();
    }

    public UnknownVehicleTypeException(String message) {
        super(message);
    }

    @Override
    public String getMessage() {
        return super.getMessage();
    }
}
