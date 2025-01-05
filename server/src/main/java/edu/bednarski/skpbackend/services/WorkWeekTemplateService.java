package edu.bednarski.skpbackend.services;

import edu.bednarski.skpbackend.domain.dto.WorkWeekTemplateDto;
import edu.bednarski.skpbackend.domain.enums.WeekDay;

import java.util.List;
import java.util.Optional;

public interface WorkWeekTemplateService {

    List<WorkWeekTemplateDto> findAll();

    Optional<WorkWeekTemplateDto> create(WorkWeekTemplateDto workWeekTemplateDto);

    Optional<WorkWeekTemplateDto> findByWeekDay(WeekDay weekDay);

    Optional<WorkWeekTemplateDto> partialUpdate(WeekDay weekDay, WorkWeekTemplateDto workWeekTemplateDto);

    Optional<WorkWeekTemplateDto> delete(WeekDay weekDay);

}
