package edu.bednarski.skpbackend.domain.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class InspectionPreflightResponseDto {

    private VehicleDto vehicle;

    private List<InspectionPreflightSingleHourDto> hours;

}
