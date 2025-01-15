package edu.bednarski.skpbackend.domain.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class InspectionDetailsDto {

    private Long id;

    private String status;

    private String description;

    private String date;

    private String inspectionStart;

    private String inspectionEnd;

    private VehicleDto vehicle;

    private StandDto stand;

    private String userEmail;

}
