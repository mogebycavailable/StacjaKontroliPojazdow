package edu.bednarski.skpbackend.services;

import edu.bednarski.skpbackend.domain.dto.JwtTokenDto;
import edu.bednarski.skpbackend.domain.dto.UserDetailsDto;
import edu.bednarski.skpbackend.domain.dto.UserDto;

import java.util.Optional;

public interface AuthenticationService {

    Optional<JwtTokenDto> register(UserDetailsDto userDetailsDto);

    Optional<JwtTokenDto> login(UserDto userDto);

}
