package edu.bednarski.skpbackend.domain.entities;

import edu.bednarski.skpbackend.domain.enums.VehicleType;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Entity
@Table(name = "vehicles")
@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class VehicleEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    @Column(name = "id")
    private Long id;

    @Column(name = "brand")
    private String brand;
    @Column(name = "model")
    private String model;
    @Column(name = "year")
    private int year;

    @Column(name = "registration_number")
    private String registrationNumber;

    @Column(name = "vin", unique = true)
    private String vehicleIdentificationNumber;

    @Column(name = "type")
    @Enumerated(EnumType.STRING)
    private VehicleType vehicleType;

    @Column(name = "has_lpg")
    private Boolean hasLpg;

    @Column(name = "validity")
    private Date validityPeriod;

    @JoinColumn(name = "fk_user")
    @ManyToOne
    private UserEntity owner;

}
