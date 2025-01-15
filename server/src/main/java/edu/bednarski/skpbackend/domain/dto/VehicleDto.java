package edu.bednarski.skpbackend.domain.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class VehicleDto {

    private Long id;

    private String brand;

    private String model;

    private Integer year;

    private String registrationNumber;

    private String vehicleIdentificationNumber;

    private String vehicleType;

    private Boolean hasLpg;

    private String validityPeriod;

}
