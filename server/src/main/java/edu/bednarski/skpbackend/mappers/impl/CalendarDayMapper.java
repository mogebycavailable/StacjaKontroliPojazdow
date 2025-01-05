package edu.bednarski.skpbackend.mappers.impl;

import edu.bednarski.skpbackend.domain.dto.CalendarDateDto;
import edu.bednarski.skpbackend.domain.entities.CalendarDateEntity;
import edu.bednarski.skpbackend.mappers.Mapper;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class CalendarDayMapper implements Mapper<CalendarDateEntity, CalendarDateDto> {

    private final ModelMapper modelMapper;

    @Override
    public CalendarDateDto mapTo(CalendarDateEntity calendarDateEntity) {
        return modelMapper.map(calendarDateEntity, CalendarDateDto.class);
    }

    @Override
    public CalendarDateEntity mapFrom(CalendarDateDto calendarDateDto) {
        return modelMapper.map(calendarDateDto, CalendarDateEntity.class);
    }
}
