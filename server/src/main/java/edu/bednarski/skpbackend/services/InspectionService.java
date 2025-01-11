package edu.bednarski.skpbackend.services;

import edu.bednarski.skpbackend.domain.dto.InspectionDetailsDto;
import edu.bednarski.skpbackend.domain.dto.InspectionPreflightDto;
import edu.bednarski.skpbackend.domain.dto.InspectionPreflightResponseDto;
import edu.bednarski.skpbackend.domain.dto.InspectionRequestDto;
import java.util.List;
import java.util.Optional;

public interface InspectionService {

    List<InspectionDetailsDto> findAllInspections();

    List<InspectionDetailsDto> findAllUsersInspections(String email);

    Optional<InspectionDetailsDto> findInspectionById(Long id);

    List<InspectionPreflightResponseDto> findFreeHours(InspectionPreflightDto preflightData);

    Optional<InspectionDetailsDto> createInspection(String email, InspectionRequestDto inspectionData);

    Optional<InspectionDetailsDto> delete(Long inspectionId);

}
