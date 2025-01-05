package edu.bednarski.skpbackend.repositories;

import edu.bednarski.skpbackend.domain.entities.CalendarDateEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;
import java.util.Optional;

@Repository
public interface CalendarDateRepository extends JpaRepository<CalendarDateEntity, Date> {

    @Query("SELECT c FROM CalendarDateEntity c WHERE YEAR(c.date) = :year AND MONTH(c.date) = :month")
    List<CalendarDateEntity> findAllByYearAndMonth(int year, int month);

    List<CalendarDateEntity> findByDateBetween(Date startDate, Date endDate);

    Optional<CalendarDateEntity> findByDate(Date date);

}
