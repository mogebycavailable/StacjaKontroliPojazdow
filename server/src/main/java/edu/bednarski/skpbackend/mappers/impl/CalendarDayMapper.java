package edu.bednarski.skpbackend.mappers.impl;

import edu.bednarski.skpbackend.domain.dto.CalendarDateDto;
import edu.bednarski.skpbackend.domain.entities.CalendarDateEntity;
import edu.bednarski.skpbackend.mappers.Mapper;
import edu.bednarski.skpbackend.services.AppDatetimeFormatterService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class CalendarDayMapper implements Mapper<CalendarDateEntity, CalendarDateDto> {

    private final ModelMapper modelMapper;

    private final AppDatetimeFormatterService dateFormatter;

    @Override
    public CalendarDateDto mapTo(CalendarDateEntity calendarDateEntity) {
        CalendarDateDto result = modelMapper.map(calendarDateEntity, CalendarDateDto.class);
        if(calendarDateEntity.getDate() != null)
            result.setDate(dateFormatter.toStr(calendarDateEntity.getDate()));
        return result;
    }

    @Override
    public CalendarDateEntity mapFrom(CalendarDateDto calendarDateDto) {
        CalendarDateEntity result = modelMapper.map(calendarDateDto, CalendarDateEntity.class);
        if(calendarDateDto.getDate() != null)
            result.setDate(dateFormatter.toDate(calendarDateDto.getDate()));
        return result;
    }
}
