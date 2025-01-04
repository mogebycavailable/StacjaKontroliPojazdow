package edu.bednarski.skpbackend.services.impl;

import edu.bednarski.skpbackend.config.DateFormatConfig;
import edu.bednarski.skpbackend.domain.dto.VehicleDto;
import edu.bednarski.skpbackend.domain.entities.UserEntity;
import edu.bednarski.skpbackend.domain.entities.VehicleEntity;
import edu.bednarski.skpbackend.domain.enums.VehicleType;
import edu.bednarski.skpbackend.exceptions.BadDateFormatException;
import edu.bednarski.skpbackend.exceptions.DuplicateVinException;
import edu.bednarski.skpbackend.exceptions.UnknownVehicleTypeException;
import edu.bednarski.skpbackend.exceptions.DataNotProvidedException;
import edu.bednarski.skpbackend.mappers.Mapper;
import edu.bednarski.skpbackend.repositories.UserRepository;
import edu.bednarski.skpbackend.repositories.VehicleRepository;
import edu.bednarski.skpbackend.services.VehicleService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class VehicleServiceImpl implements VehicleService {

    private final VehicleRepository vehicleRepository;

    private final UserRepository userRepository;

    private final Mapper<VehicleEntity, VehicleDto> vehicleMapper;

    private final DateFormatConfig globalDateFormat;


    @Override
    public Optional<VehicleDto> create(VehicleDto vehicleDto, String userEmail) throws DuplicateVinException {
        if(vehicleDto==null) throw new DataNotProvidedException("Nie otrzymano danych pojazdu!");
        vehicleDto.setId(null);
        if(vehicleDto.getVehicleIdentificationNumber() != null) {
            Optional<VehicleEntity> duplicateVehicle = vehicleRepository.findByVehicleIdentificationNumber(vehicleDto.getVehicleIdentificationNumber());
            if(duplicateVehicle.isPresent()) {
                throw new DuplicateVinException("Wykryto duplikat numeru VIN. Prosze upewnic sie, czy wprowadzona wartosc jest taka sama jak w Dowodzie Rejestracyjnym.");
            }
        }

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
    public Optional<VehicleDto> partialUpdate(VehicleDto vehicleDto, String userEmail) throws BadDateFormatException, DuplicateVinException, UnknownVehicleTypeException {
        Optional<UserEntity> user = userRepository.findByEmail(userEmail);
        return user.map(existingUser -> {
            Optional<VehicleEntity> currentData = vehicleRepository.findById(vehicleDto.getId());
            VehicleEntity mergedData = currentData.map(
                    existingVehicle -> {
                        if(vehicleDto.getVehicleIdentificationNumber() != null &&(!vehicleDto.getVehicleIdentificationNumber().equals(existingVehicle.getVehicleIdentificationNumber()))) {
                            Optional<VehicleEntity> duplicateVehicle = vehicleRepository.findByVehicleIdentificationNumber(vehicleDto.getVehicleIdentificationNumber());
                            if(duplicateVehicle.isPresent()) {
                                throw new DuplicateVinException("Wykryto duplikat numeru VIN. Prosze upewnic sie, czy wprowadzona wartosc jest taka sama jak w Dowodzie Rejestracyjnym.");
                            }
                        }
                        if(!existingUser.equals(existingVehicle.getOwner())) return null;
                        Optional.ofNullable(vehicleDto.getBrand()).ifPresent(existingVehicle::setBrand);
                        Optional.ofNullable(vehicleDto.getModel()).ifPresent(existingVehicle::setModel);
                        Optional.ofNullable(vehicleDto.getYear()).ifPresent(existingVehicle::setYear);
                        Optional.ofNullable(vehicleDto.getRegistrationNumber()).ifPresent(existingVehicle::setRegistrationNumber);
                        Optional.ofNullable(vehicleDto.getVehicleIdentificationNumber()).ifPresent(existingVehicle::setVehicleIdentificationNumber);
                        Optional.ofNullable(vehicleDto.getHasLpg()).ifPresent(existingVehicle::setHasLpg);
                        Optional.ofNullable(vehicleDto.getVehicleType()).ifPresent(vehicleTypeString -> {
                            try {
                                existingVehicle.setVehicleType(VehicleType.valueOf(vehicleTypeString));
                            } catch (IllegalArgumentException ex) {
                                throw new UnknownVehicleTypeException("Nieprawidlowy typ pojazdu. Dostepne opcje: CAR/TRUCK/MOTORCYCLE/VINTAGE/SLOW_MOVING");
                            }
                        });
                        Optional.ofNullable(vehicleDto.getValidityPeriod()).ifPresent(dateString -> {
                            SimpleDateFormat sdf = new SimpleDateFormat(globalDateFormat.getDate());
                            try {
                                existingVehicle.setValidityPeriod(sdf.parse(dateString));
                            } catch (ParseException ex) {
                                throw new BadDateFormatException(ex.getMessage());
                            }
                        });
                        return existingVehicle;
                    }
            ).orElse(null);
            if(mergedData != null) {
                vehicleRepository.save(mergedData);
                return Optional.of(vehicleMapper.mapTo(mergedData));
            }
            else return Optional.<VehicleDto>empty();
        }).orElseThrow(() -> new UsernameNotFoundException("Tozsamosc uzytkownika nie jest znana serwerowi!"));
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
