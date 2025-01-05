package edu.bednarski.skpbackend.services;

import java.time.LocalTime;
import java.util.Date;
import java.util.List;

public interface AppDatetimeFormatterService {

    String toStr(Date dateObject);

    Date toDate(String dateString);

    List<String> toStr(List<Date> dateObjects);

    List<Date> toDate(List<String> dateStrings);

    String toStr(LocalTime timeObject);

    LocalTime toLocalTime(String timeString);

}
