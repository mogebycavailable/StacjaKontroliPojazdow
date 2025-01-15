package edu.bednarski.skpbackend.domain.dto;

import edu.bednarski.skpbackend.domain.enums.WeekDay;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class WorkWeekTemplateDto {

    private WeekDay weekDay;

    private String workStart;

    private String workEnd;

    private Boolean isWorkFree;
}
