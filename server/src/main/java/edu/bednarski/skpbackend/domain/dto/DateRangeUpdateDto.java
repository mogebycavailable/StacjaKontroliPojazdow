package edu.bednarski.skpbackend.domain.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class DateRangeUpdateDto {

    private String startingDate;

    private String endingDate;

    private CalendarDateDto updateData;
}
