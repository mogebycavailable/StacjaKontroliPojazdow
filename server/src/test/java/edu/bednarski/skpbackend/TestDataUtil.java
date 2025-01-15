package edu.bednarski.skpbackend;

import edu.bednarski.skpbackend.domain.dto.UserDetailsDto;
import edu.bednarski.skpbackend.domain.dto.UserDto;
import edu.bednarski.skpbackend.domain.entities.UserEntity;
import edu.bednarski.skpbackend.security.Role;

public class TestDataUtil {

    public static UserDetailsDto createTestUserDetailsDto() {
        return UserDetailsDto
                .builder()
                .email("test@skp.pl")
                .pwdHash("testPassword")
                .build();
    }

    public static UserDto createTestLoginRequest(UserDetailsDto forWho) {
        return UserDto
                .builder()
                .email(forWho.getEmail())
                .pwdHash(forWho.getPwdHash())
                .build();
    }

}
