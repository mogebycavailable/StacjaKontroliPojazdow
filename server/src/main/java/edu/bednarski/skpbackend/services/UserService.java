package edu.bednarski.skpbackend.services;

import edu.bednarski.skpbackend.domain.dto.UserDto;

import java.util.List;
import java.util.Optional;

public interface UserService {

    Optional<UserDto> save(UserDto user);

    Optional<UserDto> delete(UserDto user);

    Optional<UserDto> findByEmail(String email);

    List<UserDto> findAll();

    Optional<UserDto> partialUpdate(UserDto user);

    boolean isExists(String email);

}
