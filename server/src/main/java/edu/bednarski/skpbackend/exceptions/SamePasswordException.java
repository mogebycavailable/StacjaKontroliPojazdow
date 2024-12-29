package edu.bednarski.skpbackend.exceptions;

public class SamePasswordException extends RuntimeException {

    public SamePasswordException() {
        super();
    }

    public SamePasswordException(String message) {
        super(message);
    }

    @Override
    public String getMessage() {
        return super.getMessage();
    }
}
