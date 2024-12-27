package edu.bednarski.skpbackend.domain.dto;


import lombok.*;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
public class JwtTokenDto {

    private String accessToken;

    private String refreshToken;

    private String role;

}
