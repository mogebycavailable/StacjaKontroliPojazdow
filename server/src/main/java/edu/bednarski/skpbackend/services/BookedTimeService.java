package edu.bednarski.skpbackend.services;

import edu.bednarski.skpbackend.domain.entities.BookedTimeEntity;
import edu.bednarski.skpbackend.domain.entities.CalendarDateEntity;
import edu.bednarski.skpbackend.domain.enums.VehicleType;

import java.time.LocalTime;
import java.util.List;

public interface BookedTimeService {

    List<BookedTimeEntity> busyHoursByDate(CalendarDateEntity day);

    List<BookedTimeEntity> reserveInspection(Long inspectionId, CalendarDateEntity day, Long standId, LocalTime time, VehicleType inspectionType, Boolean hasLpg);

}
