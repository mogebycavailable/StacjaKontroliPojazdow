package edu.bednarski.skpbackend.exceptions;

public class BadPasswordException extends RuntimeException{

    public BadPasswordException() {
        super();
    }

    public BadPasswordException(String message) {
        super(message);
    }

    @Override
    public String getMessage() {
        return super.getMessage();
    }
}
