package edu.bednarski.skpbackend.services.impl;

import edu.bednarski.skpbackend.domain.entities.BookedTimeEntity;
import edu.bednarski.skpbackend.domain.entities.CalendarDateEntity;
import edu.bednarski.skpbackend.domain.entities.InspectionEntity;
import edu.bednarski.skpbackend.domain.entities.StandEntity;
import edu.bednarski.skpbackend.domain.enums.VehicleType;
import edu.bednarski.skpbackend.repositories.BookedTimeRepository;
import edu.bednarski.skpbackend.repositories.InspectionRepository;
import edu.bednarski.skpbackend.repositories.StandRepository;
import edu.bednarski.skpbackend.services.BookedTimeService;
import edu.bednarski.skpbackend.services.InspectionTimeService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class BookedTimeServiceImpl implements BookedTimeService {

    private final BookedTimeRepository bookedTimeRepository;

    private final InspectionRepository inspectionRepository;

    private final StandRepository standRepository;

    private final InspectionTimeService calculator;

    @Override
    public List<BookedTimeEntity> busyHoursByDate(CalendarDateEntity day) {
        return bookedTimeRepository.findByDay(day);
    }

    @Override
    public List<BookedTimeEntity> reserveInspection(Long inspectionId, CalendarDateEntity day, Long standId, LocalTime time, VehicleType inspectionType, Boolean hasLpg) {
        ArrayList<BookedTimeEntity> reservedTimes = new ArrayList<>();
        Integer inspectionTime = calculator.calculateInspectionTimeMinutes(inspectionType,hasLpg);
        Integer offset = calculator.getDivider();
        int cycles = inspectionTime/offset;
        Optional<InspectionEntity> inspectionWrapped = inspectionRepository.findById(inspectionId);
        InspectionEntity inspection;
        if(inspectionWrapped.isPresent()) inspection = inspectionWrapped.get();
        else throw new RuntimeException("Rezerwowany jest nieutworzony przeglad!");
        Optional<StandEntity> standWrapped = standRepository.findById(standId);
        StandEntity stand;
        if(standWrapped.isPresent()) stand = standWrapped.get();
        else throw new RuntimeException("Rezerwowany jest przeglad na nieistniejacym stanowisku!");
        for(int i = 0;i < cycles;i++) {
            BookedTimeEntity cycle = BookedTimeEntity
                    .builder()
                    .day(day)
                    .time(time)
                    .inspection(inspection)
                    .stand(stand)
                    .build();
            reservedTimes.add(cycle);
            time = time.plusMinutes(offset);
            if(!bookedTimeRepository.findByDateTimeAndStand(day.getDate(),time,standId).isEmpty())
                return List.of();
        }
        for(BookedTimeEntity timeToReserve : reservedTimes) {
            bookedTimeRepository.save(timeToReserve);
        }
        return reservedTimes;
    }
}
