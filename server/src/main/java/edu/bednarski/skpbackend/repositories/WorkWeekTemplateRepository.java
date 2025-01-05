package edu.bednarski.skpbackend.repositories;

import edu.bednarski.skpbackend.domain.entities.WorkWeekTemplateEntity;
import edu.bednarski.skpbackend.domain.enums.WeekDay;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface WorkWeekTemplateRepository extends JpaRepository<WorkWeekTemplateEntity, WeekDay> {
}
