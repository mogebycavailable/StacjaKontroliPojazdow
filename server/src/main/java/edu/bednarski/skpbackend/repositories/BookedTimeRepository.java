package edu.bednarski.skpbackend.repositories;

import edu.bednarski.skpbackend.domain.entities.BookedTimeEntity;
import edu.bednarski.skpbackend.domain.entities.CalendarDateEntity;
import edu.bednarski.skpbackend.domain.entities.StandEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalTime;
import java.util.Date;
import java.util.List;

@Repository
public interface BookedTimeRepository extends JpaRepository<BookedTimeEntity,Long> {

    List<BookedTimeEntity> findByDay(CalendarDateEntity day);

    @Query("SELECT bt FROM BookedTimeEntity bt WHERE bt.day.date = :date AND bt.time = :time AND bt.stand.id = :standId")
    List<BookedTimeEntity> findByDateTimeAndStand(Date date, LocalTime time, Long standId);

}
