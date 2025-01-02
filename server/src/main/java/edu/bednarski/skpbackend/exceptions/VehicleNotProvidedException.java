package edu.bednarski.skpbackend.exceptions;

public class VehicleNotProvidedException extends RuntimeException{

    public VehicleNotProvidedException() {
        super();
    }

    public VehicleNotProvidedException(String message) {
        super(message);
    }

    @Override
    public String getMessage() {
        return super.getMessage();
    }
}
