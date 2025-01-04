package edu.bednarski.skpbackend.mappers.impl;

import edu.bednarski.skpbackend.config.DateFormatConfig;
import edu.bednarski.skpbackend.domain.dto.VehicleDto;
import edu.bednarski.skpbackend.domain.entities.VehicleEntity;
import edu.bednarski.skpbackend.domain.enums.VehicleType;
import edu.bednarski.skpbackend.exceptions.BadDateFormatException;
import edu.bednarski.skpbackend.exceptions.UnknownVehicleTypeException;
import edu.bednarski.skpbackend.mappers.Mapper;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;

import java.text.ParseException;
import java.text.SimpleDateFormat;

@Component
public class VehicleMapper implements Mapper<VehicleEntity, VehicleDto> {

    private final String DATE_FORMAT;

    private final String DATETIME_FORMAT;

    public VehicleMapper(DateFormatConfig dateFormatConfig) {
        this.DATE_FORMAT = dateFormatConfig.getDate();
        this.DATETIME_FORMAT = dateFormatConfig.getDatetime();
    }

    @Override
    public VehicleDto mapTo(VehicleEntity vehicleEntity) {
        VehicleDto mapped = VehicleDto
                .builder()
                .id(vehicleEntity.getId())
                .model(vehicleEntity.getModel())
                .brand(vehicleEntity.getBrand())
                .year(vehicleEntity.getYear())
                .registrationNumber(vehicleEntity.getRegistrationNumber())
                .vehicleIdentificationNumber(vehicleEntity.getVehicleIdentificationNumber())
                .vehicleType(vehicleEntity.getVehicleType().toString())
                .hasLpg(vehicleEntity.getHasLpg())
                .build();
        SimpleDateFormat sdf = new SimpleDateFormat(DATE_FORMAT);
        mapped.setValidityPeriod(sdf.format(vehicleEntity.getValidityPeriod()));
        return mapped;
    }

    @Override
    public VehicleEntity mapFrom(VehicleDto vehicleDto) {
        VehicleEntity mapped;
        try {
            mapped = VehicleEntity
                    .builder()
                    .id(null)
                    .model(vehicleDto.getModel())
                    .brand(vehicleDto.getBrand())
                    .year(vehicleDto.getYear())
                    .vehicleIdentificationNumber(vehicleDto.getVehicleIdentificationNumber())
                    .registrationNumber(vehicleDto.getRegistrationNumber())
                    .vehicleType(VehicleType.valueOf(vehicleDto.getVehicleType()))
                    .hasLpg(vehicleDto.getHasLpg())
                    .build();
        } catch (IllegalArgumentException ex) {
            throw new UnknownVehicleTypeException("Nieprawidlowy typ pojazdu. Dostepne opcje: CAR/TRUCK/MOTORCYCLE/VINTAGE/SLOW_MOVING");
        }
        SimpleDateFormat sdf = new SimpleDateFormat(DATE_FORMAT);
        try {
            mapped.setValidityPeriod(sdf.parse(vehicleDto.getValidityPeriod()));
        } catch (ParseException ex) {
            throw new BadDateFormatException("Podano date w zlym formacie!");
        }
        return mapped;

    }
}
