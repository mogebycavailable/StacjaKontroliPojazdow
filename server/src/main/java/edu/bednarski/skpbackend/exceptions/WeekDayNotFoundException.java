package edu.bednarski.skpbackend.exceptions;

public class WeekDayNotFoundException extends RuntimeException {

    public WeekDayNotFoundException() {
        super();
    }

    public WeekDayNotFoundException(String message) {
        super(message);
    }

    @Override
    public String getMessage() {
        return super.getMessage();
    }
}
