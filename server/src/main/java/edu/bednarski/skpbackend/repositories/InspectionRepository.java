package edu.bednarski.skpbackend.repositories;

import edu.bednarski.skpbackend.domain.entities.InspectionEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;

@Repository
public interface InspectionRepository extends JpaRepository<InspectionEntity,Long> {
}
