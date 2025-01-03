package edu.bednarski.skpbackend.domain.dto;

import edu.bednarski.skpbackend.domain.entities.UserEntity;
import jakarta.persistence.*;
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

    private String validityPeriod;

}
