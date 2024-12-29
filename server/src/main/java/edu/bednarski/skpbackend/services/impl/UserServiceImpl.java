package edu.bednarski.skpbackend.services.impl;

import edu.bednarski.skpbackend.domain.dto.UserDetailsDto;
import edu.bednarski.skpbackend.domain.entities.UserEntity;
import edu.bednarski.skpbackend.mappers.Mapper;
import edu.bednarski.skpbackend.repositories.UserRepository;
import edu.bednarski.skpbackend.services.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;

    private final Mapper<UserEntity, UserDetailsDto> userMapper;

    private final PasswordEncoder passwordEncoder;

    @Override
    public Optional<UserDetailsDto> getAccountDetails(String email) {
        Optional<UserEntity> userEntity = userRepository.findByEmail(email);
        if(userEntity.isPresent()) {
            UserDetailsDto mappedUser = userMapper.mapTo(userEntity.get());
            return Optional.of(mappedUser);
        }
        else {
            return Optional.empty();
        }
    }

    @Override
    public Optional<UserDetailsDto> partialUpdate(String email, UserDetailsDto newData) {
        UserEntity updateData = userMapper.mapFrom(newData);
        Optional<UserEntity> userToUpdate = userRepository.findByEmail(email);
        Optional<UserEntity> updatedUser = userToUpdate.map(existingUser -> {
            Optional.ofNullable(updateData.getName()).ifPresent(existingUser::setName);
            Optional.ofNullable(updateData.getSurname()).ifPresent(existingUser::setSurname);
            Optional.ofNullable(updateData.getPhone()).ifPresent(existingUser::setPhone);
            Optional.ofNullable(updateData.getEmail()).ifPresent(existingUser::setEmail);
            Optional.ofNullable(updateData.getPwdHash()).ifPresent((rawPwd) -> {
                existingUser.setPwdHash(passwordEncoder.encode(rawPwd));
            });
            return Optional.of(existingUser);
        }).orElse(Optional.empty());
        if(updatedUser.isPresent()) {
            UserEntity savedUser = userRepository.save(updatedUser.get());
            return Optional.ofNullable(userMapper.mapTo(savedUser));
        }
        else {
            return Optional.empty();
        }
    }

    @Override
    public Optional<UserDetailsDto> delete(String email) {
        Optional<UserEntity> userToDelete = userRepository.findByEmail(email);
        if(userToDelete.isPresent()) {
            userRepository.delete(userToDelete.get());
            return Optional.ofNullable(userMapper.mapTo(userToDelete.get()));
        }
        else return Optional.empty();
    }
}
