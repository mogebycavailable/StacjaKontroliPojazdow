package edu.bednarski.skpbackend.mappers.impl;

import edu.bednarski.skpbackend.domain.dto.InspectionDetailsDto;
import edu.bednarski.skpbackend.domain.dto.StandDto;
import edu.bednarski.skpbackend.domain.dto.VehicleDto;
import edu.bednarski.skpbackend.domain.entities.BookedTimeEntity;
import edu.bednarski.skpbackend.domain.entities.InspectionEntity;
import edu.bednarski.skpbackend.domain.entities.StandEntity;
import edu.bednarski.skpbackend.domain.entities.VehicleEntity;
import edu.bednarski.skpbackend.domain.enums.InspectionStatus;
import edu.bednarski.skpbackend.mappers.Mapper;
import edu.bednarski.skpbackend.repositories.VehicleRepository;
import edu.bednarski.skpbackend.services.AppDatetimeFormatterService;
import edu.bednarski.skpbackend.services.InspectionTimeService;
import edu.bednarski.skpbackend.services.StandService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.time.LocalTime;
import java.util.Comparator;
import java.util.Optional;

@Component
@RequiredArgsConstructor
public class InspectionDetailsMapper implements Mapper<InspectionEntity, InspectionDetailsDto> {

    private final InspectionTimeService inspectionTimeService;

    private final VehicleRepository vehicleRepository;

    private final StandService standService;

    private final AppDatetimeFormatterService formatter;

    private final Mapper<VehicleEntity, VehicleDto> vehicleMapper;

    private final Mapper<StandEntity, StandDto> standMapper;

    @Override
    public InspectionDetailsDto mapTo(InspectionEntity inspectionEntity) {
        LocalTime inspectionStart = inspectionEntity.getReservedTimestamps()
                .stream()
                .min(Comparator.comparing(BookedTimeEntity::getTime))
                .map(BookedTimeEntity::getTime)
                .orElseThrow(() -> new RuntimeException("Blad mapowania - czas rozpoczecia przegladu nie zapisany w bazie!"));
        LocalTime inspectionEnd = inspectionEntity.getReservedTimestamps()
                .stream()
                .max(Comparator.comparing(BookedTimeEntity::getTime))
                .map(BookedTimeEntity::getTime)
                .orElseThrow(() -> new RuntimeException("Blad mapowania - czas zakonczenia przegladu nie zapisany w bazie!"));
        inspectionEnd = inspectionEnd.plusMinutes(inspectionTimeService.getDivider());
        String inspectionStartString = formatter.toStr(inspectionStart);
        String inspectionEndString = formatter.toStr(inspectionEnd);
        StandDto stand = inspectionEntity
                .getReservedTimestamps()
                .stream()
                .findFirst()
                .map(existingInspection -> standMapper.mapTo(existingInspection.getStand()))
                .orElseThrow(() -> new RuntimeException("Blad mapowania - timestamps niedostepne!"));
        String date = inspectionEntity
                .getReservedTimestamps()
                .stream()
                .findAny()
                .map(existingInspectionTimeDetails -> formatter.toStr(
                        existingInspectionTimeDetails
                                .getDay()
                                .getDate()
                )).orElseThrow(() -> new RuntimeException("Blad mapowania - data w CalendarDateEntity niedostepna!"));
        String userEmail = inspectionEntity.getVehicle().getOwner().getEmail();
        return InspectionDetailsDto
                .builder()
                .id(inspectionEntity.getId())
                .status(inspectionEntity.getStatus().toString())
                .date(date)
                .description(inspectionEntity.getDescription())
                .inspectionStart(inspectionStartString)
                .inspectionEnd(inspectionEndString)
                .vehicle(vehicleMapper.mapTo(inspectionEntity.getVehicle()))
                .stand(stand)
                .userEmail(userEmail)
                .build();
    }

    @Override
    public InspectionEntity mapFrom(InspectionDetailsDto inspectionDetailsDto) {
        Optional<VehicleEntity> vehicleWrapped = vehicleRepository.findById(inspectionDetailsDto.getVehicle().getId());
        VehicleEntity vehicle;
        if(vehicleWrapped.isPresent()) vehicle = vehicleWrapped.get();
        else throw new RuntimeException("Blad mapowania: nie ma takiego samochodu w bazie!");
        return InspectionEntity
                .builder()
                .id(inspectionDetailsDto.getId())
                .vehicle(vehicle)
                .status(InspectionStatus.valueOf(inspectionDetailsDto.getStatus()))
                .build();
    }
}
