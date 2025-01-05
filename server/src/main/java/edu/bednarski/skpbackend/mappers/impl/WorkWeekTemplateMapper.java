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
        return WorkWeekTemplateDto
                .builder()
                .weekDay(workWeekTemplateEntity.getWeekDay())
                .isWorkFree(workWeekTemplateEntity.getIsWorkFree())
                .workStart(timeFormatter.toStr(workWeekTemplateEntity.getWorkStart()))
                .workEnd(timeFormatter.toStr(workWeekTemplateEntity.getWorkEnd()))
                .build();
    }

    @Override
    public WorkWeekTemplateEntity mapFrom(WorkWeekTemplateDto workWeekTemplateDto) throws BadDateFormatException {
        return WorkWeekTemplateEntity
                .builder()
                .weekDay(workWeekTemplateDto.getWeekDay())
                .isWorkFree(workWeekTemplateDto.getIsWorkFree())
                .workStart(timeFormatter.toLocalTime(workWeekTemplateDto.getWorkStart()))
                .workEnd(timeFormatter.toLocalTime(workWeekTemplateDto.getWorkEnd()))
                .build();
    }
}
