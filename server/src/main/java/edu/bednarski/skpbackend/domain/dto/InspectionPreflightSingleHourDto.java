package edu.bednarski.skpbackend.domain.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class InspectionPreflightSingleHourDto {

    private String time;

    private StandDto stand;

}
