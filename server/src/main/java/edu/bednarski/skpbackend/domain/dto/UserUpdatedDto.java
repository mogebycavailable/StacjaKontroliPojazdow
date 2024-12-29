package edu.bednarski.skpbackend.domain.dto;

import lombok.*;

@NoArgsConstructor
@Getter
@Setter
public class UserUpdatedDto extends UserDetailsDto {
    private String refreshToken;

    public UserUpdatedDto(UserDetailsDto userDetailsDto, String refreshToken) {
        super(userDetailsDto.getName(), userDetailsDto.getSurname(), userDetailsDto.getEmail(), userDetailsDto.getPhone(), userDetailsDto.getPwdHash());
        this.refreshToken = refreshToken;
    }
}
