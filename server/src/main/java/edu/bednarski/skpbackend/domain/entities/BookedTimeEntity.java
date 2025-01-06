package edu.bednarski.skpbackend.domain.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalTime;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
@Entity
@Table(name = "booked_times")
public class BookedTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    @Column(name = "id")
    private Long id;

    @Column(name = "booked_time")
    private LocalTime time;

    @ManyToOne(optional = false)
    @JoinColumn(name = "fk_calendar_day")
    private CalendarDateEntity day;

    @ManyToOne(optional = false)
    @JoinColumn(name = "fk_stand")
    private StandEntity stand;

    @ManyToOne(optional = false)
    @JoinColumn(name = "fk_inspection")
    private InspectionEntity inspection;


}
