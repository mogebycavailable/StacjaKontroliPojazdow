package edu.bednarski.skpbackend.domain.dto;

import edu.bednarski.skpbackend.domain.enums.InspectionStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalTime;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class InspectionDetailsDto {

    private Long id;

    private String status;

    private String inspectionStart;

    private String inspectionEnd;

    private Long vehicleId;

    private Long standId;

    private String userEmail;

}
