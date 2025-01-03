package edu.bednarski.skpbackend.exceptions;

public class DuplicateVinException extends RuntimeException {

    public DuplicateVinException() {
        super();
    }

    public DuplicateVinException(String message) {
        super(message);
    }

    @Override
    public String getMessage() {
        return super.getMessage();
    }
}
