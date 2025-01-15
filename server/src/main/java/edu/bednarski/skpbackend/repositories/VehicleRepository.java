package edu.bednarski.skpbackend.repositories;

import edu.bednarski.skpbackend.domain.entities.UserEntity;
import edu.bednarski.skpbackend.domain.entities.VehicleEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface VehicleRepository extends JpaRepository<VehicleEntity,Long> {

    List<VehicleEntity> findByOwner(UserEntity owner);

    Optional<VehicleEntity> findById(Long id);

    Optional<VehicleEntity> findByVehicleIdentificationNumber(String vin);

}
