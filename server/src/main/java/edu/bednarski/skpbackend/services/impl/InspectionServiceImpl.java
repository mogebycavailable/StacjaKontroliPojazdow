package edu.bednarski.skpbackend.services.impl;

import edu.bednarski.skpbackend.domain.dto.*;
import edu.bednarski.skpbackend.domain.entities.*;
import edu.bednarski.skpbackend.domain.enums.InspectionStatus;
import edu.bednarski.skpbackend.exceptions.DataNotProvidedException;
import edu.bednarski.skpbackend.exceptions.DateUnavaliableException;
import edu.bednarski.skpbackend.exceptions.StandUnavaliableException;
import edu.bednarski.skpbackend.exceptions.UnknownVehicleTypeException;
import edu.bednarski.skpbackend.mappers.Mapper;
import edu.bednarski.skpbackend.repositories.CalendarDateRepository;
import edu.bednarski.skpbackend.repositories.InspectionRepository;
import edu.bednarski.skpbackend.repositories.StandRepository;
import edu.bednarski.skpbackend.repositories.VehicleRepository;
import edu.bednarski.skpbackend.services.AppDatetimeFormatterService;
import edu.bednarski.skpbackend.services.BookedTimeService;
import edu.bednarski.skpbackend.services.InspectionService;
import edu.bednarski.skpbackend.services.InspectionTimeService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.ZoneId;
import java.util.*;

@Service
@RequiredArgsConstructor
public class InspectionServiceImpl implements InspectionService {

    private final InspectionRepository inspectionRepository;

    private final CalendarDateRepository dateRepository;

    private final VehicleRepository vehicleRepository;

    private final BookedTimeService bookedTimeService;

    private final StandRepository standRepository;

    private final InspectionTimeService timeService;

    private final AppDatetimeFormatterService formatter;

    private final Mapper<InspectionEntity, InspectionDetailsDto> inspectionMapper;

    private final Mapper<StandEntity, StandDto> standMapper;

    private final Mapper<VehicleEntity, VehicleDto> vehicleMapper;

    @Override
    public List<InspectionDetailsDto> findAllInspections() {
        return inspectionRepository.findAll()
                .stream()
                .map(inspectionMapper::mapTo)
                .toList();
    }

    @Override
    public List<InspectionDetailsDto> findAllUsersInspections(String email) {
        return inspectionRepository.findAll()
                .stream()
                .filter(inspection -> inspection.getVehicle().getOwner().getEmail().equals(email))
                .map(inspectionMapper::mapTo)
                .toList();
    }

    @Override
    public Optional<InspectionDetailsDto> findInspectionById(Long id) {
        Optional<InspectionEntity> inspection = inspectionRepository.findById(id);
        return inspection.map(inspectionMapper::mapTo);
    }

    @Override
    public InspectionPreflightResponseDto findFreeHours(InspectionPreflightDto preflightData) {
        if(preflightData == null || preflightData.getDate() == null || preflightData.getVehicleId() == null)
            throw new DataNotProvidedException("Brakujace dane lub dane w nieprawidlowym formacie!");
        Date inspectionDate = formatter.toDate(preflightData.getDate());
        LocalDate inspectionLocalDate = inspectionDate
                .toInstant()
                .atZone(ZoneId.systemDefault())
                .toLocalDate();
        if(inspectionLocalDate.isBefore(LocalDate.now())) throw new DataNotProvidedException("Nie mozna umowic przegladu na date wczesniejsza niz dzien dzisiejszy!");
        Optional<CalendarDateEntity> inspectionDayWrapped = dateRepository.findByDate(inspectionDate);
        if(inspectionDayWrapped.isEmpty()) throw new DateUnavaliableException("Wskazana data jest nieaktywna!");
        CalendarDateEntity inspectionDay = inspectionDayWrapped.get();
        if(inspectionDay.getIsWorkFree()) throw new DateUnavaliableException("Wskazana data jest dniem wolnym od pracy!");
        List<BookedTimeEntity> bookedHours = bookedTimeService.busyHoursByDate(inspectionDay);
        Optional<VehicleEntity> vehicleWrapped = vehicleRepository.findById(preflightData.getVehicleId());
        if(vehicleWrapped.isEmpty()) throw new UnknownVehicleTypeException("Wskazany pojazd nie istnieje!");
        VehicleEntity vehicle = vehicleWrapped.get();
        Integer inspectionTimeMinutes = timeService.calculateInspectionTimeMinutes(vehicle.getVehicleType(),vehicle.getHasLpg());
        Integer offset = timeService.getDivider();
        int neededCycles = inspectionTimeMinutes/offset;
        int cycleCounter;
        LocalTime workEnd = inspectionDay.getWorkEnd();
        List<InspectionPreflightSingleHourDto> hours = new ArrayList<>();
        List<StandEntity> avaliableStands = standRepository.findAllActive();
        if(avaliableStands.isEmpty()) throw new StandUnavaliableException("Brak dostepnych stanowisk!");
        for(StandEntity stand : avaliableStands) {
            LocalTime timeIterator = inspectionDay.getWorkStart();
            cycleCounter = 0;
            while (timeIterator.isBefore(workEnd)) {
                boolean isHourBusy = inspectionLocalDate.equals(LocalDate.now()) && timeIterator.isBefore(LocalTime.now());
                for (BookedTimeEntity bt : bookedHours) {
                    if (bt.getStand().equals(stand) && bt.getTime().equals(timeIterator)) {
                        isHourBusy = true;
                        break;
                    }
                }
                if (isHourBusy) cycleCounter = 0;
                else cycleCounter++;
                if (cycleCounter >= neededCycles) {
                    hours.add(
                            InspectionPreflightSingleHourDto
                                    .builder()
                                    .time(formatter.toStr(timeIterator.minusMinutes((long) inspectionTimeMinutes - offset)))
                                    .stand(standMapper.mapTo(stand))
                                    .build()
                    );
                    cycleCounter = neededCycles - 1;
                }
                timeIterator = timeIterator.plusMinutes(offset);
            }
        }
        return InspectionPreflightResponseDto
                .builder()
                .vehicle(vehicleMapper.mapTo(vehicle))
                .hours(hours)
                .build();
    }

    @Override
    public Optional<InspectionDetailsDto> createInspection(String email, InspectionRequestDto inspectionData) {
        if(inspectionData == null
                || inspectionData.getDate() == null
                || inspectionData.getTime() == null
                || inspectionData.getVehicleId() == null
                || inspectionData.getStandId() == null)
            throw new DataNotProvidedException("Brakujace dane lub dane w nieprawidlowym formacie!");
        Optional<VehicleEntity> vehicleWrapped = vehicleRepository.findById(inspectionData.getVehicleId());
        if(vehicleWrapped.isEmpty()) throw new UnknownVehicleTypeException("Wskazany pojazd nie istnieje!");
        VehicleEntity vehicle = vehicleWrapped.get();
        if(!vehicle.getOwner().getEmail().equals(email)) throw new UnknownVehicleTypeException("Wskazany pojazd nie istnieje!");
        InspectionEntity inspectionToSave = InspectionEntity
                .builder()
                .status(InspectionStatus.ARRANGED)
                .vehicle(vehicle)
                .build();
        InspectionEntity savedInspection = inspectionRepository.save(inspectionToSave);
        Optional<CalendarDateEntity> inspectionDayWrapped = dateRepository.findByDate(
                formatter.toDate(inspectionData.getDate())
        );
        if(inspectionDayWrapped.isEmpty()) throw new DateUnavaliableException("Wskazana data jest nieaktywna!");
        CalendarDateEntity inspectionDay = inspectionDayWrapped.get();
        if(inspectionDay.getIsWorkFree()) throw new DateUnavaliableException("Wskazana data jest dniem wolnym od pracy!");
        List<BookedTimeEntity> bookedHours = bookedTimeService.reserveInspection(
                savedInspection.getId(),
                inspectionDay,
                inspectionData.getStandId(),
                formatter.toLocalTime(inspectionData.getTime()),
                vehicle.getVehicleType(),
                vehicle.getHasLpg()
        );
        if(bookedHours.isEmpty()) {
            inspectionRepository.delete(savedInspection);
            throw new DateUnavaliableException("Te godziny sa juz zajete!");
        }
        StandDto stand = bookedHours
                .stream()
                .findAny()
                .map(bookedHour -> standMapper.mapTo(bookedHour.getStand()))
                .orElseThrow(() -> new RuntimeException("Fatalny blad przy rezerwowaniu uslugi - BookedTimeService nie zarezerwowal zadnej godziny!"));
        LocalTime inspectionStart = bookedHours
                .stream()
                .min(Comparator.comparing(BookedTimeEntity::getTime))
                .get()
                .getTime();
        LocalTime inspectionEnd = bookedHours
                .stream()
                .max(Comparator.comparing(BookedTimeEntity::getTime))
                .get()
                .getTime();
        inspectionEnd = inspectionEnd.plusMinutes(timeService.getDivider());
        String inspectionStartString = formatter.toStr(inspectionStart);
        String inspectionEndString = formatter.toStr(inspectionEnd);
        InspectionDetailsDto result = InspectionDetailsDto
                .builder()
                .id(savedInspection.getId())
                .userEmail(email)
                .stand(stand)
                .vehicle(vehicleMapper.mapTo(savedInspection.getVehicle()))
                .status(savedInspection.getStatus().toString())
                .date(formatter.toStr(inspectionDay.getDate()))
                .inspectionStart(inspectionStartString)
                .inspectionEnd(inspectionEndString)
                .build();
        return Optional.of(result);
    }

    @Override
    public Optional<InspectionDetailsDto> delete(Long inspectionId) {
        Optional<InspectionEntity> inspectionToDelete = inspectionRepository.findById(inspectionId);
        if(inspectionToDelete.isPresent()) {
            inspectionRepository.delete(inspectionToDelete.get());
            return Optional.of(inspectionMapper.mapTo(inspectionToDelete.get()));
        }
        else return Optional.empty();
    }
}
