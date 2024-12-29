package edu.bednarski.skpbackend.services.impl;

import edu.bednarski.skpbackend.domain.dto.PasswordChangeDto;
import edu.bednarski.skpbackend.domain.dto.UserDetailsDto;
import edu.bednarski.skpbackend.domain.entities.UserEntity;
import edu.bednarski.skpbackend.exceptions.BadOldPasswordException;
import edu.bednarski.skpbackend.exceptions.SamePasswordException;
import edu.bednarski.skpbackend.mappers.Mapper;
import edu.bednarski.skpbackend.repositories.UserRepository;
import edu.bednarski.skpbackend.services.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

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
            Optional.ofNullable(updateData.getPwdHash()).ifPresent((newPassword) -> {
                existingUser.setPwdHash(passwordEncoder.encode(newPassword));
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
    public void changePassword(String email, PasswordChangeDto passwordChangeDto) throws BadOldPasswordException, SamePasswordException {
        Optional<UserEntity> userToUpdate = userRepository.findByEmail(email);
        if(userToUpdate.isPresent()) {
            if(!passwordEncoder.matches(passwordChangeDto.getOldPassword(), userToUpdate.get().getPwdHash())) {
                throw new BadOldPasswordException("Zle stare haslo!");
            }
            if(passwordEncoder.matches(passwordChangeDto.getNewPassword(), userToUpdate.get().getPwdHash())) {
                throw new SamePasswordException("Nowe haslo nie moze byc takie samo jak stare!");
            }
            UserDetailsDto userUponUpdate = userMapper.mapTo(userToUpdate.get());
            userUponUpdate.setPwdHash(passwordChangeDto.getNewPassword());
            this.partialUpdate(email,userUponUpdate);
        }
        else {
            throw new RuntimeException("Tozsamosc uzytkownika nieznana przy probie zmiany hasla!");
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
