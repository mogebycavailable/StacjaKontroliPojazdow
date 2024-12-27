package edu.bednarski.skpbackend.mappers.impl;

import edu.bednarski.skpbackend.domain.dto.UserDto;
import edu.bednarski.skpbackend.domain.entities.UserEntity;
import edu.bednarski.skpbackend.mappers.Mapper;
import org.modelmapper.ModelMapper;

public class UserMapper implements Mapper<UserEntity, UserDto> {

    private ModelMapper modelMapper;

    public UserMapper(ModelMapper modelMapper) {
        this.modelMapper = modelMapper;
    }

    @Override
    public UserDto mapTo(UserEntity userEntity) {
        return modelMapper.map(userEntity, UserDto.class);
    }

    @Override
    public UserEntity mapFrom(UserDto userDto) {
        return modelMapper.map(userDto, UserEntity.class);
    }
}
