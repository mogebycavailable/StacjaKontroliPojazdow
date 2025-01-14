package edu.bednarski.skpbackend.services;

import edu.bednarski.skpbackend.domain.dto.*;

import java.util.List;
import java.util.Optional;

public interface InspectionService {

    List<InspectionDetailsDto> findAllInspections();

    List<InspectionDetailsDto> findAllUsersInspections(String email);

    Optional<InspectionDetailsDto> findInspectionById(Long id);

    InspectionPreflightResponseDto findFreeHours(InspectionPreflightDto preflightData);

    Optional<InspectionDetailsDto> createInspection(String email, InspectionRequestDto inspectionData);

    Optional<InspectionDetailsDto> delete(Long inspectionId);

}
