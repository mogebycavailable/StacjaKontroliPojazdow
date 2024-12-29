package edu.bednarski.skpbackend.services;

import edu.bednarski.skpbackend.domain.dto.UserDetailsDto;

import java.util.Optional;

public interface UserService {
    Optional<UserDetailsDto> getAccountDetails(String email);

    Optional<UserDetailsDto> partialUpdate(String email, UserDetailsDto newData);

    Optional<UserDetailsDto> delete(String email);
}
