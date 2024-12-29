package edu.bednarski.skpbackend.mappers.impl;

import edu.bednarski.skpbackend.domain.dto.UserDetailsDto;
import edu.bednarski.skpbackend.domain.entities.UserEntity;
import edu.bednarski.skpbackend.mappers.Mapper;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class UserDetailsMapper implements Mapper<UserEntity, UserDetailsDto> {

    private final ModelMapper modelMapper;

    @Override
    public UserDetailsDto mapTo(UserEntity userEntity) {
        UserDetailsDto mappedUser = modelMapper.map(userEntity, UserDetailsDto.class);
        mappedUser.setPwdHash("x");
        return mappedUser;
    }

    @Override
    public UserEntity mapFrom(UserDetailsDto userDetailsDto) {
        return modelMapper.map(userDetailsDto, UserEntity.class);
    }
}
