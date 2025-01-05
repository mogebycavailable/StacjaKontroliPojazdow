package edu.bednarski.skpbackend.domain.entities;

import edu.bednarski.skpbackend.domain.enums.WeekDay;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalTime;
import java.util.Date;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
@Entity
@Table(name = "calendar_dates")
public class CalendarDateEntity {

    @Id
    @Column(name = "date")
    private Date date;

    @Column(name = "description")
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(name = "week_day")
    private WeekDay weekDay;

    @Column(name = "work_start")
    private LocalTime workStart;

    @Column(name = "work_end")
    private LocalTime workEnd;

    @Column(name = "is_workfree")
    private Boolean isWorkFree;
}
