package edu.bednarski.skpbackend.mappers.impl;

import edu.bednarski.skpbackend.domain.dto.StandDto;
import edu.bednarski.skpbackend.domain.entities.StandEntity;
import edu.bednarski.skpbackend.mappers.Mapper;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class StandMapper implements Mapper<StandEntity, StandDto> {

    private final ModelMapper modelMapper;

    @Override
    public StandDto mapTo(StandEntity standEntity) {
        return modelMapper.map(standEntity, StandDto.class);
    }

    @Override
    public StandEntity mapFrom(StandDto standDto) {
        return modelMapper.map(standDto, StandEntity.class);
    }
}
