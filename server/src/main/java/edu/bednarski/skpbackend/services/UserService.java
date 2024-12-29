package edu.bednarski.skpbackend.services;

import edu.bednarski.skpbackend.domain.dto.PasswordChangeDto;
import edu.bednarski.skpbackend.domain.dto.UserDetailsDto;
import edu.bednarski.skpbackend.domain.dto.UserUpdatedDto;

import java.util.Optional;

public interface UserService {
    Optional<UserDetailsDto> getAccountDetails(String email);

    Optional<UserUpdatedDto> partialUpdate(String email, UserDetailsDto newData);

    Optional<UserDetailsDto> delete(String email);

    void changePassword(String email, PasswordChangeDto passwordChangeDto);
}
