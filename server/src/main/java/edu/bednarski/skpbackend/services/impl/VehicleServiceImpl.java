package edu.bednarski.skpbackend.services.impl;

import edu.bednarski.skpbackend.domain.dto.UserDetailsDto;
import edu.bednarski.skpbackend.domain.dto.VehicleDto;
import edu.bednarski.skpbackend.domain.entities.UserEntity;
import edu.bednarski.skpbackend.domain.entities.VehicleEntity;
import edu.bednarski.skpbackend.exceptions.VehicleNotProvidedException;
import edu.bednarski.skpbackend.mappers.Mapper;
import edu.bednarski.skpbackend.repositories.UserRepository;
import edu.bednarski.skpbackend.repositories.VehicleRepository;
import edu.bednarski.skpbackend.services.VehicleService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class VehicleServiceImpl implements VehicleService {

    private final VehicleRepository vehicleRepository;

    private final UserRepository userRepository;

    private final Mapper<VehicleEntity, VehicleDto> vehicleMapper;


    @Override
    public Optional<VehicleDto> create(VehicleDto vehicleDto, String userEmail) {
        if(vehicleDto==null) throw new VehicleNotProvidedException("Nie otrzymano danych pojazdu!");
        vehicleDto.setId(null);
        Optional<UserEntity> user = userRepository.findByEmail(userEmail);
        return user.map(existingUser -> {
            VehicleEntity vehicleUponCreate = vehicleMapper.mapFrom(vehicleDto);
            vehicleUponCreate.setOwner(existingUser);
            VehicleEntity savedVehicle = vehicleRepository.save(vehicleUponCreate);
            VehicleDto savedVehicleDto = vehicleMapper.mapTo(savedVehicle);
            return Optional.ofNullable(savedVehicleDto);
        }).orElseThrow(() -> new UsernameNotFoundException("Tozsamosc uzytkownika nie jest znana serwerowi!"));
    }

    @Override
    public List<VehicleDto> findAll(String userEmail) throws UsernameNotFoundException {
        Optional<UserEntity> user = userRepository.findByEmail(userEmail);
        return user.map(existingUser -> {
            List<VehicleEntity> userVehicles = vehicleRepository.findByOwner(existingUser);
            return userVehicles.stream().map(vehicleMapper::mapTo).collect(Collectors.toList());
        }).orElseThrow(() -> new UsernameNotFoundException("Tozsamosc uzytkownika nie jest znana serwerowi!"));
    }

    @Override
    public Optional<VehicleDto> find(Long id,String userEmail) {
        Optional<UserEntity> user = userRepository.findByEmail(userEmail);
        VehicleDto toReturn = user.map(existingUser -> {
            Optional<VehicleEntity> vehicle = vehicleRepository.findById(id);
            return vehicle.map(existingVehicle -> {
                if (existingVehicle.getOwner().equals(existingUser)) {
                    return vehicleMapper.mapTo(existingVehicle);
                } else {
                    return null;
                }
            }).orElse(null);
        }).orElseThrow(() -> new UsernameNotFoundException("Tozsamosc uzytkownika nie jest znana serwerowi!"));
        return Optional.ofNullable(toReturn);
    }

    @Override
    public Optional<VehicleDto> partialUpdate(VehicleDto vehicleDto) {
        return Optional.empty();
    }

    @Override
    public Optional<VehicleDto> delete(VehicleDto vehicleDto, String userEmail) {
        Optional<UserEntity> user = userRepository.findByEmail(userEmail);
        return user.map(existingUser -> {
            Optional<VehicleEntity> vehicleToDelete = vehicleRepository.findById(vehicleDto.getId());
            if(vehicleToDelete.isPresent()) {
                if(existingUser.equals(vehicleToDelete.get().getOwner())) {
                    vehicleRepository.deleteById(vehicleToDelete.get().getId());
                    return Optional.ofNullable(vehicleMapper.mapTo(vehicleToDelete.get()));
                }
                else {
                    return Optional.<VehicleDto>empty();
                }
            }
            else {
                return Optional.<VehicleDto>empty();
            }
        }).orElseThrow(() -> new UsernameNotFoundException("Tozsamosc uzytkownika nie jest znana serwerowi!"));
    }
}
