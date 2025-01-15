package edu.bednarski.skpbackend.repositories;

import edu.bednarski.skpbackend.domain.entities.InspectionEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface InspectionRepository extends JpaRepository<InspectionEntity,Long> {
}
