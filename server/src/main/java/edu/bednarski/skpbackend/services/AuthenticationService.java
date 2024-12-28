package edu.bednarski.skpbackend.services;

import edu.bednarski.skpbackend.domain.dto.JwtTokenDto;
import edu.bednarski.skpbackend.domain.dto.UserDetailsDto;
import edu.bednarski.skpbackend.domain.dto.UserDto;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.util.Optional;

public interface AuthenticationService {

    Optional<JwtTokenDto> register(UserDetailsDto userDetailsDto);

    Optional<JwtTokenDto> login(UserDto userDto);

    Optional<JwtTokenDto> refreshToken(HttpServletRequest request, HttpServletResponse response);

    Optional<UserDetailsDto> registerAdmin(UserDetailsDto userDetailsDto);
}
