package edu.bednarski.skpbackend;

import edu.bednarski.skpbackend.domain.dto.UserDetailsDto;
import edu.bednarski.skpbackend.domain.dto.UserDto;

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
