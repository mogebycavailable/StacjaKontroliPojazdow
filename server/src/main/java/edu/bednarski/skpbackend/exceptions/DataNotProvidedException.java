package edu.bednarski.skpbackend.exceptions;

public class DataNotProvidedException extends RuntimeException{

    public DataNotProvidedException() {
        super();
    }

    public DataNotProvidedException(String message) {
        super(message);
    }

    @Override
    public String getMessage() {
        return super.getMessage();
    }
}
