package edu.bednarski.skpbackend.services;

import edu.bednarski.skpbackend.domain.dto.StandDto;

import java.util.List;
import java.util.Optional;

public interface StandService {

    Optional<StandDto> create(StandDto standDto);

    List<StandDto> findAll();

    Optional<StandDto> findById(Long standId);

    Optional<StandDto> partialUpdate(Long standId, StandDto standDto);

    Optional<StandDto> delete(Long standId);

}
