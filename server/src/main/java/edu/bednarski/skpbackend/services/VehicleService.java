package edu.bednarski.skpbackend.services;


import edu.bednarski.skpbackend.domain.dto.UserDetailsDto;
import edu.bednarski.skpbackend.domain.dto.VehicleDto;
import edu.bednarski.skpbackend.domain.entities.UserEntity;
import edu.bednarski.skpbackend.domain.entities.VehicleEntity;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.List;
import java.util.Optional;

public interface VehicleService {

    Optional<VehicleDto> create(VehicleDto vehicleDto, String userEmail);
    List<VehicleDto> findAll(String userEmail);

    Optional<VehicleDto> find(Long id,String userEmail);

    Optional<VehicleDto> partialUpdate(VehicleDto vehicleDto);

    Optional<VehicleDto> delete(VehicleDto vehicleDto, String userEmail);
}
