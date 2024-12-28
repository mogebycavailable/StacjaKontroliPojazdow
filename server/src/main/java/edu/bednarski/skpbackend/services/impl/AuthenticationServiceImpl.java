package edu.bednarski.skpbackend.services.impl;

import edu.bednarski.skpbackend.domain.dto.JwtTokenDto;
import edu.bednarski.skpbackend.domain.dto.UserDetailsDto;
import edu.bednarski.skpbackend.domain.dto.UserDto;
import edu.bednarski.skpbackend.domain.entities.UserEntity;
import edu.bednarski.skpbackend.mappers.Mapper;
import edu.bednarski.skpbackend.repositories.UserRepository;
import edu.bednarski.skpbackend.security.Role;
import edu.bednarski.skpbackend.services.AuthenticationService;
import edu.bednarski.skpbackend.services.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AuthenticationServiceImpl implements AuthenticationService {

    private final UserRepository userRepository;

    private final Mapper<UserEntity, UserDetailsDto> userDetailsMapper;

    private final JwtService jwtService;

    private final PasswordEncoder passwordEncoder;

    private final AuthenticationManager authenticationManager;

    @Override
    public Optional<JwtTokenDto> register(UserDetailsDto userDetailsDto) {
        if(userRepository.existsByEmail(userDetailsDto.getEmail())) {
            return Optional.empty();
        }
        userDetailsDto.setPwdHash(passwordEncoder.encode(userDetailsDto.getPwdHash()));
        UserEntity userEntity = userDetailsMapper.mapFrom(userDetailsDto);
        userEntity.setRole(Role.CLIENT);
        UserEntity savedUserEntity = userRepository.save(userEntity);
        return Optional.of(JwtTokenDto.builder()
                .accessToken(jwtService.generateAccessToken(savedUserEntity))
                .refreshToken(jwtService.generateRefreshToken(savedUserEntity))
                .role(userEntity.getRole().toString())
                .build());
    }

    @Override
    public Optional<JwtTokenDto> login(UserDto userDto) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        userDto.getEmail(),
                        userDto.getPwdHash()
                )
        );
        Optional<UserEntity> userEntity = userRepository.findByEmail(userDto.getEmail());
        return userEntity.map(entity -> JwtTokenDto.builder()
                .accessToken(jwtService.generateAccessToken(entity))
                .refreshToken(jwtService.generateRefreshToken(entity))
                .role(entity.getRole().toString())
                .build());
    }
}
