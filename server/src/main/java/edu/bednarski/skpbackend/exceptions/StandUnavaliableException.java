package edu.bednarski.skpbackend.exceptions;

public class StandUnavaliableException extends RuntimeException {

    public StandUnavaliableException() {
        super();
    }

    public StandUnavaliableException(String message) {
        super(message);
    }

    @Override
    public String getMessage() {
        return super.getMessage();
    }
}
