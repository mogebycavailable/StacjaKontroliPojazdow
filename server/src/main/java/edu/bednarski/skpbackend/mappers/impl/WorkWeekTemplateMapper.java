package edu.bednarski.skpbackend.mappers.impl;

import edu.bednarski.skpbackend.domain.dto.WorkWeekTemplateDto;
import edu.bednarski.skpbackend.domain.entities.WorkWeekTemplateEntity;
import edu.bednarski.skpbackend.exceptions.BadDateFormatException;
import edu.bednarski.skpbackend.mappers.Mapper;
import edu.bednarski.skpbackend.services.AppDatetimeFormatterService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class WorkWeekTemplateMapper implements Mapper<WorkWeekTemplateEntity, WorkWeekTemplateDto> {

    private final AppDatetimeFormatterService timeFormatter;

    @Override
    public WorkWeekTemplateDto mapTo(WorkWeekTemplateEntity workWeekTemplateEntity) {
        WorkWeekTemplateDto result = WorkWeekTemplateDto
                .builder()
                .weekDay(workWeekTemplateEntity.getWeekDay())
                .isWorkFree(workWeekTemplateEntity.getIsWorkFree())
                .build();
        if(workWeekTemplateEntity.getWorkStart() != null)
            result.setWorkStart(timeFormatter.toStr(workWeekTemplateEntity.getWorkStart()));
        if(workWeekTemplateEntity.getWorkEnd() != null)
            result.setWorkEnd(timeFormatter.toStr(workWeekTemplateEntity.getWorkEnd()));
        return result;
    }

    @Override
    public WorkWeekTemplateEntity mapFrom(WorkWeekTemplateDto workWeekTemplateDto) throws BadDateFormatException {
        WorkWeekTemplateEntity result = WorkWeekTemplateEntity
                .builder()
                .weekDay(workWeekTemplateDto.getWeekDay())
                .isWorkFree(workWeekTemplateDto.getIsWorkFree())
                .build();
        if(workWeekTemplateDto.getWorkStart() != null)
            result.setWorkStart(timeFormatter.toLocalTime(workWeekTemplateDto.getWorkStart()));
        if(workWeekTemplateDto.getWorkEnd() != null)
            result.setWorkEnd(timeFormatter.toLocalTime(workWeekTemplateDto.getWorkEnd()));
        return result;
    }
}
