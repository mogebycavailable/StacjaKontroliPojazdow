package edu.bednarski.skpbackend;

import edu.bednarski.skpbackend.domain.enums.VehicleType;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter(autoApply = true)
public class VehicleTypeH2Converter implements AttributeConverter<VehicleType, String> {
    @Override
    public String convertToDatabaseColumn(VehicleType vehicleType) {
        return vehicleType != null ? vehicleType.name() : null;
    }

    @Override
    public VehicleType convertToEntityAttribute(String dbData) {
        return dbData != null ? VehicleType.valueOf(dbData) : null;
    }
}
