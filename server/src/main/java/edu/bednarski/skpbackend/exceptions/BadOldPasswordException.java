package edu.bednarski.skpbackend.exceptions;

public class BadOldPasswordException extends RuntimeException {

    public BadOldPasswordException() {
        super();
    }

    public BadOldPasswordException(String message) {
        super(message);
    }

    @Override
    public String getMessage() {
        return super.getMessage();
    }
}
