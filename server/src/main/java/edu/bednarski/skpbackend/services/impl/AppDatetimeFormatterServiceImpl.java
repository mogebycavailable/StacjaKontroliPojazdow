package edu.bednarski.skpbackend.services.impl;

import edu.bednarski.skpbackend.config.DateFormatConfig;
import edu.bednarski.skpbackend.exceptions.BadDateFormatException;
import edu.bednarski.skpbackend.services.AppDatetimeFormatterService;
import org.springframework.stereotype.Service;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AppDatetimeFormatterServiceImpl implements AppDatetimeFormatterService {

    private final SimpleDateFormat sdf;

    private final String TIME_FORMATTER_PATTERN;

    public AppDatetimeFormatterServiceImpl(DateFormatConfig dateFormatConfig) {
        this.sdf = new SimpleDateFormat(dateFormatConfig.getDate());
        this.TIME_FORMATTER_PATTERN = dateFormatConfig.getTime();
    }

    @Override
    public String toStr(Date dateObject) {
        return sdf.format(dateObject);
    }

    @Override
    public Date toDate(String dateString) throws BadDateFormatException {
        try {
            return sdf.parse(dateString);
        } catch (ParseException e) {
            throw new BadDateFormatException("Podana data jest w nieprawidlowym formacie!");
        }
    }

    @Override
    public List<String> toStr(List<Date> dateObjects) {
        return dateObjects
                .stream()
                .map(this::toStr)
                .collect(Collectors.toList());
    }

    @Override
    public List<Date> toDate(List<String> dateStrings) {
        return dateStrings.stream().map(this::toDate).collect(Collectors.toList());
    }

    @Override
    public String toStr(LocalTime timeObject) {
        return timeObject.format(DateTimeFormatter.ofPattern(TIME_FORMATTER_PATTERN));
    }

    @Override
    public LocalTime toLocalTime(String timeString) {
        try {
            return LocalTime.parse(timeString, DateTimeFormatter.ofPattern(TIME_FORMATTER_PATTERN));
        } catch (DateTimeParseException ex) {
            throw new BadDateFormatException("Podany czas ("+timeString+") jest w nieprawidlowym formacie! Wymagany format: "+TIME_FORMATTER_PATTERN);
        }
    }
}
