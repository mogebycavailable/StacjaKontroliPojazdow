package edu.bednarski.skpbackend.exceptions;

public class BadDateFormatException extends RuntimeException {

    public BadDateFormatException() {
        super();
    }

    public BadDateFormatException(String message) {
        super(message);
    }

    @Override
    public String getMessage() {
        return super.getMessage();
    }
}
