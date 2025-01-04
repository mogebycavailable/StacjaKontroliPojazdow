package edu.bednarski.skpbackend.services.impl;

import edu.bednarski.skpbackend.domain.dto.StandDto;
import edu.bednarski.skpbackend.domain.entities.StandEntity;
import edu.bednarski.skpbackend.exceptions.DuplicateStandNameException;
import edu.bednarski.skpbackend.mappers.Mapper;
import edu.bednarski.skpbackend.repositories.StandRepository;
import edu.bednarski.skpbackend.services.StandService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class StandServiceImpl implements StandService {

    private final StandRepository standRepository;

    private final Mapper<StandEntity, StandDto> standMapper;


    @Override
    public Optional<StandDto> create(StandDto standDto) throws DuplicateStandNameException {
        Optional<StandEntity> existingStand = standRepository.findByName(standDto.getName());
        if(existingStand.isPresent()) throw new DuplicateStandNameException("Stanowisko o tej nazwie juz istnieje!");
        StandEntity entityToCreate = standMapper.mapFrom(standDto);
        StandEntity savedEntity = standRepository.save(entityToCreate);
        StandDto savedDto = standMapper.mapTo(savedEntity);
        return Optional.ofNullable(savedDto);
    }

    @Override
    public List<StandDto> findAll() {
        List<StandEntity> allStands = standRepository.findAll();
        return allStands
                .stream()
                .map(standMapper::mapTo)
                .collect(Collectors.toList());
    }

    @Override
    public Optional<StandDto> findById(Long standId) {
        Optional<StandEntity> foundStand = standRepository.findById(standId);
        return foundStand.map(standMapper::mapTo);
    }

    @Override
    public Optional<StandDto> partialUpdate(Long standId, StandDto standDto) {
        return Optional.empty();
    }

    @Override
    public Optional<StandDto> delete(Long standId) {
        return Optional.empty();
    }
}
