package edu.bednarski.skpbackend.repositories;

import edu.bednarski.skpbackend.domain.entities.StandEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StandRepository extends JpaRepository<StandEntity, Long> {

    Optional<StandEntity> findByName(String name);

    @Query("SELECT s FROM StandEntity s WHERE s.isActive = true")
    List<StandEntity> findAllActive();

}
