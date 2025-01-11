package edu.bednarski.skpbackend.domain.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class InspectionRequestDto {

    private Long vehicleId;

    private Long standId;

    private String date;

    private String time;

}
