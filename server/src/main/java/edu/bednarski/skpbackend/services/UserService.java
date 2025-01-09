package edu.bednarski.skpbackend.services;

import edu.bednarski.skpbackend.domain.dto.PasswordChangeDto;
import edu.bednarski.skpbackend.domain.dto.UserDetailsDto;
import edu.bednarski.skpbackend.domain.dto.UserUpdatedDto;
import edu.bednarski.skpbackend.security.Role;

import java.util.List;
import java.util.Optional;

public interface UserService {
    Optional<UserDetailsDto> getAccountDetails(String email);

    List<UserDetailsDto> getAllAccountsByRole(String role);

    Optional<UserUpdatedDto> partialUpdate(String email, UserDetailsDto newData);

    Optional<UserDetailsDto> delete(String email, String password);

    Optional<UserDetailsDto> deleteWithoutConfirmation(String email);

    void changePassword(String email, PasswordChangeDto passwordChangeDto);
}
