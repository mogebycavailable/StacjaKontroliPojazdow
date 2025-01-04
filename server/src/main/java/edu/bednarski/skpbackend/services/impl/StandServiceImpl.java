package edu.bednarski.skpbackend.services.impl;

import edu.bednarski.skpbackend.domain.dto.StandDto;
import edu.bednarski.skpbackend.domain.entities.StandEntity;
import edu.bednarski.skpbackend.exceptions.DataNotProvidedException;
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
        Optional<StandEntity> existingStand = standRepository.findById(standId);
        if(existingStand.isEmpty()) return Optional.empty();
        if(standDto == null) throw new DataNotProvidedException("Dane do edycji stanowiska nie zostaly podane!");
        StandEntity editData = standMapper.mapFrom(standDto);
        return existingStand.map(dataInDatabase -> {
            Optional.ofNullable(editData.getName()).ifPresent(dataInDatabase::setName);
            Optional.ofNullable(editData.getIsActive()).ifPresent(dataInDatabase::setIsActive);
            StandEntity savedEntity = standRepository.save(dataInDatabase);
            return Optional.ofNullable(standMapper.mapTo(savedEntity));
        }).orElse(Optional.empty());
    }

    @Override
    public Optional<StandDto> delete(Long standId) {
        Optional<StandEntity> existingStand = standRepository.findById(standId);
        if(existingStand.isEmpty()) return Optional.empty();
        standRepository.deleteById(standId);
        return Optional.ofNullable(standMapper.mapTo(existingStand.get()));
    }
}
