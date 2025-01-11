package edu.bednarski.skpbackend.services;

import edu.bednarski.skpbackend.domain.enums.VehicleType;

public interface InspectionTimeService {

    Integer calculateInspectionTimeMinutes(VehicleType type, Boolean hasLpg);

    Integer getDivider();

}
