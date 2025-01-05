package edu.bednarski.skpbackend.domain.dto;

import edu.bednarski.skpbackend.domain.enums.WeekDay;
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
public class CalendarDateDto {

    private WeekDay weekDay;

    private Date date;

    private String description;

    private LocalTime workStart;

    private LocalTime workEnd;

    private Boolean isWorkFree;
}
