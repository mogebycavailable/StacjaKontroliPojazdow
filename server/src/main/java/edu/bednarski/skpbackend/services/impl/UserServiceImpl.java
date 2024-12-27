package edu.bednarski.skpbackend.services.impl;

import edu.bednarski.skpbackend.domain.dto.UserDto;
import edu.bednarski.skpbackend.domain.entities.UserEntity;
import edu.bednarski.skpbackend.mappers.Mapper;
import edu.bednarski.skpbackend.mappers.impl.UserMapper;
import edu.bednarski.skpbackend.repositories.UserRepository;
import edu.bednarski.skpbackend.services.UserService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserServiceImpl implements UserService {

    private UserRepository userRepository;

    private Mapper<UserEntity, UserDto> userMapper;

    public UserServiceImpl(UserRepository userRepository, Mapper<UserEntity, UserDto> userMapper) {
        this.userRepository = userRepository;
        this.userMapper = userMapper;
    }

    @Override
    public Optional<UserDto> save(UserDto user) {
        UserEntity userEntity = userMapper.mapFrom(user);
        UserEntity savedUserEntity = userRepository.save(userEntity);
        return Optional.of(userMapper.mapTo(savedUserEntity));
    }

    @Override
    public Optional<UserDto> delete(UserDto user) {
        return Optional.empty();
    }

    @Override
    public Optional<UserDto> findByEmail(String email) {
        Optional<UserEntity> foundUserEntity = userRepository.findByEmail(email);
        return foundUserEntity.map((userEntity)->
                Optional.of(userMapper.mapTo(userEntity)))
                .orElse(Optional.empty()
        );
    }

    @Override
    public List<UserDto> findAll() {
        return null;
    }

    @Override
    public Optional<UserDto> partialUpdate(UserDto user) {
        return Optional.empty();
    }

    @Override
    public boolean isExists(String email) {
        return userRepository.existsByEmail(email);
    }
}
