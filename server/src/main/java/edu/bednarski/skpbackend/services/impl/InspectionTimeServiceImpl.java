package edu.bednarski.skpbackend.services.impl;

import edu.bednarski.skpbackend.config.InspectionTimeConfig;
import edu.bednarski.skpbackend.domain.enums.VehicleType;
import edu.bednarski.skpbackend.services.InspectionTimeService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class InspectionTimeServiceImpl implements InspectionTimeService {

    private final InspectionTimeConfig config;

    @Override
    public Integer calculateInspectionTimeMinutes(VehicleType type, Boolean hasLpg) {
        Integer result = config.getDivider();
        if(type == VehicleType.CAR) result*= config.getCarCycles();
        else if(type == VehicleType.MOTORCYCLE) result *= config.getMotorcycleCycles();
        else if(type == VehicleType.TRUCK) result *= config.getTruckCycles();
        else if(type == VehicleType.VINTAGE) result *= config.getVintageCycles();
        else result *= config.getSlowMovingCycles();
        if(hasLpg) result += config.getLpgCycles()*config.getDivider();
        return result;
    }

    @Override
    public Integer getDivider() {
        return config.getDivider();
    }
}
