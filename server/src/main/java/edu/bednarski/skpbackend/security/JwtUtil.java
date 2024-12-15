package edu.bednarski.skpbackend.security;

import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.SignatureException;

import java.util.Date;

public class JwtUtil {

    private static final String SECRET = "36f22270abbd160cf0a1dae559d96d2215ede9cfbba5ee90fbe3f27c0a38134b9359368a09a7de7d3e52f4d95d1ab40d98ac9fb82ad65010d1d94edf7ba3dce22ffba2dc9fbf08a568a6b2c64bb5e5ce2635a7403a0bb1a96ab801b5da603b5b72216a8af85b5b2ed449cb4cdfb9ca4da3fd3bcc647024e4d85c50dbc2594af4";
    private static final long EXP_TIME_15_MINUTES = 900_000;

    public static String generateToken(String username) {
        return Jwts.builder()
                .setSubject(username)
                .setExpiration(new Date(System.currentTimeMillis() + EXP_TIME_15_MINUTES))
                .signWith(SignatureAlgorithm.HS512, SECRET)
                .compact();
    }

    public static String extractUsername(String token) {
        return Jwts.parser()
                .setSigningKey(SECRET)
                .parseClaimsJws(token)
                .getBody()
                .getSubject();
    }

    public static boolean validateToken(String token) throws SignatureException, ExpiredJwtException {
        try {
            Jwts.parser()
                    .setSigningKey(SECRET)
                    .parseClaimsJws(token);
            return true;
        } catch(SignatureException ex) {
            System.out.println("Signature exception");
        } catch(ExpiredJwtException ex) {
            System.out.println("Expired token exception");
        }
        return false;
    }

}

