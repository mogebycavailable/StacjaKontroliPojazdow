package edu.bednarski.skpbackend.services.impl;

import edu.bednarski.skpbackend.domain.dto.WorkWeekTemplateDto;
import edu.bednarski.skpbackend.domain.entities.WorkWeekTemplateEntity;
import edu.bednarski.skpbackend.domain.enums.WeekDay;
import edu.bednarski.skpbackend.mappers.Mapper;
import edu.bednarski.skpbackend.repositories.WorkWeekTemplateRepository;
import edu.bednarski.skpbackend.services.WorkWeekTemplateService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class WorkWeekTemplateServiceImpl implements WorkWeekTemplateService {

    private final WorkWeekTemplateRepository repository;

    private final Mapper<WorkWeekTemplateEntity, WorkWeekTemplateDto> mapper;

    @Override
    public List<WorkWeekTemplateDto> findAll() {
        return repository.findAll().stream().map(mapper::mapTo).toList();
    }

    @Override
    public Optional<WorkWeekTemplateDto> create(WorkWeekTemplateDto workWeekTemplateDto) {
        Optional<WorkWeekTemplateEntity> foundRecord = repository.findById(workWeekTemplateDto.getWeekDay());
        return foundRecord.map(existingRecord -> Optional.<WorkWeekTemplateDto>empty())
                .orElseGet(() -> {
                    WorkWeekTemplateEntity savedEntity = repository.save(mapper.mapFrom(workWeekTemplateDto));
                    return Optional.of(mapper.mapTo(savedEntity));
                });
    }

    @Override
    public Optional<WorkWeekTemplateDto> findByWeekDay(WeekDay weekDay) {
        return repository.findById(weekDay).map(mapper::mapTo);
    }

    @Override
    public Optional<WorkWeekTemplateDto> partialUpdate(WeekDay weekDay, WorkWeekTemplateDto workWeekTemplateDto) {
        Optional<WorkWeekTemplateEntity> foundRecord = repository.findById(weekDay);
        return foundRecord.map(weekDayUponEdit -> {
            workWeekTemplateDto.setWeekDay(weekDay);
            WorkWeekTemplateEntity saveData = mapper.mapFrom(workWeekTemplateDto);
            Optional.ofNullable(saveData.getWeekDay()).ifPresent(weekDayUponEdit::setWeekDay);
            Optional.ofNullable(saveData.getIsWorkFree()).ifPresent(weekDayUponEdit::setIsWorkFree);
            Optional.ofNullable(saveData.getWorkStart()).ifPresent(weekDayUponEdit::setWorkStart);
            Optional.ofNullable(saveData.getWorkEnd()).ifPresent(weekDayUponEdit::setWorkEnd);
            WorkWeekTemplateEntity savedChanges = repository.save(weekDayUponEdit);
            return Optional.of(mapper.mapTo(savedChanges));
        }).orElse(Optional.empty());
    }

    @Override
    public Optional<WorkWeekTemplateDto> delete(WeekDay weekDay) {
        Optional<WorkWeekTemplateEntity> foundRecord = repository.findById(weekDay);
        return foundRecord.map(existingRecord -> {
            repository.delete(existingRecord);
            return Optional.of(mapper.mapTo(existingRecord));
        }).orElse(Optional.empty());
    }
}
