package edu.bednarski.skpbackend.exceptions;

public class DuplicateStandNameException extends RuntimeException {

    public DuplicateStandNameException() {
        super();
    }

    public DuplicateStandNameException(String message) {
        super(message);
    }

    @Override
    public String getMessage() {
        return super.getMessage();
    }
}
