package edu.bednarski.skpbackend.exceptions;

public class DateUnavaliableException extends RuntimeException {

    public DateUnavaliableException() {
        super();
    }

    public DateUnavaliableException(String message) {
        super(message);
    }

    @Override
    public String getMessage() {
        return super.getMessage();
    }
}
