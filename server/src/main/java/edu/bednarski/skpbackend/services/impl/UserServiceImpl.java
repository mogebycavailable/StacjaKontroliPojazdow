package edu.bednarski.skpbackend.services.impl;

import edu.bednarski.skpbackend.domain.dto.PasswordChangeDto;
import edu.bednarski.skpbackend.domain.dto.UserDetailsDto;
import edu.bednarski.skpbackend.domain.dto.UserUpdatedDto;
import edu.bednarski.skpbackend.domain.entities.UserEntity;
import edu.bednarski.skpbackend.exceptions.BadOldPasswordException;
import edu.bednarski.skpbackend.exceptions.BadPasswordException;
import edu.bednarski.skpbackend.exceptions.DataNotProvidedException;
import edu.bednarski.skpbackend.exceptions.SamePasswordException;
import edu.bednarski.skpbackend.mappers.Mapper;
import edu.bednarski.skpbackend.repositories.UserRepository;
import edu.bednarski.skpbackend.security.Role;
import edu.bednarski.skpbackend.services.JwtService;
import edu.bednarski.skpbackend.services.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;

    private final Mapper<UserEntity, UserDetailsDto> userMapper;

    private final PasswordEncoder passwordEncoder;

    private final JwtService jwtService;

    @Override
    public List<UserDetailsDto> getAllAccountsByRole(String role) {
        Role roleType;
        try {
            roleType = Role.valueOf(role);
        } catch (NullPointerException ex) {
            throw new DataNotProvidedException("Brak danych lub dane w nieprawidlowym formacie!");
        } catch (IllegalArgumentException ex) {
            throw new DataNotProvidedException("Wprowadzona rola jest niepoprawna!");
        }
        List<UserEntity> foundAccounts = userRepository.findByRole(roleType);
        return foundAccounts.stream().map(userMapper::mapTo).collect(Collectors.toList());
    }

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
    public Optional<UserUpdatedDto> partialUpdate(String email, UserDetailsDto newData) {
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
        Optional<UserUpdatedDto> result;
        if(updatedUser.isPresent()) {
            UserEntity savedUser = userRepository.save(updatedUser.get());
            result = Optional.of(new UserUpdatedDto(userMapper.mapTo(savedUser),jwtService.generateRefreshToken(savedUser)));
        }
        else {
            result = Optional.empty();
        }
        return result;
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
    public Optional<UserDetailsDto> delete(String email, String password) {
        Optional<UserEntity> userToDelete = userRepository.findByEmail(email);
        if(userToDelete.isPresent()) {
            if(passwordEncoder.matches(password,userToDelete.get().getPwdHash())) {
                userRepository.delete(userToDelete.get());
                return Optional.ofNullable(userMapper.mapTo(userToDelete.get()));
            }
            else throw new BadPasswordException("Nie mozna usunac konta - nieprawidlowe haslo!");
        }
        else return Optional.empty();
    }

    @Override
    public Optional<UserDetailsDto> deleteWithoutConfirmation(String email) {
        Optional<UserEntity> userToDelete = userRepository.findByEmail(email);
        return userToDelete.map(existingUser -> {
            userRepository.delete(existingUser);
            return Optional.of(userMapper.mapTo(existingUser));
        }).orElse(Optional.empty());
    }
}
