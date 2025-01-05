package edu.bednarski.skpbackend.domain.entities;

import edu.bednarski.skpbackend.domain.enums.WeekDay;
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
@Table(name = "work_week_templates")
public class WorkWeekTemplateEntity {

    @Id
    @Enumerated(EnumType.STRING)
    private WeekDay weekDay;

    @Column(name = "work_start")
    private LocalTime workStart;

    @Column(name = "work_end")
    private LocalTime workEnd;

    @Column(name = "is_workfree")
    private Boolean isWorkFree;

}
