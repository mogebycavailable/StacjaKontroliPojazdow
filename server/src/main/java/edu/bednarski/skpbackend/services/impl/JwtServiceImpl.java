package edu.bednarski.skpbackend.services.impl;

import edu.bednarski.skpbackend.services.JwtService;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.util.Base64;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

@Service
public class JwtServiceImpl implements JwtService {

    private static final String SECRET_KEY = "Y2FwaXRhbGNvYXN0Y2F0Y2h3b3JyaWVkYmxvd2FmdGVybm9vbnBhcmFncmFwaHBhaWRwYXJ0aWNsZXNjbGltYXRld2luZGNvbXBhcmVkZXNjcmliZWluc2lkZWF0ZXNodXRmb3VnaHRzdGVhbXdoZW5ldmVyc3dpbWNvYXRmb3Jnb3R2aWN0b3J5YmFsYW5jZXdvcnNlYXJ0Y29uc2lkZXJhdHRlbnRpb25tb3RvcmNhbG10YWxraGF5b2NjdXJicmVhdGhpbmd0cmliZXBvdGF0b2VzY291bnRyeWNoYW1iZXJiZXlvbmR3b29kbWFjaGluZXBhcnR5ZWZmb3J0bWludXRlbXVzdGJyb3dud3JpdHRlbnJlZmVyZmVhdGhlcnNsYW5kc2lsdmVybWVhbnJlYXJtb3JuaW5nY2xvdGhlc3R3aWNldGVhY2hiYW5kc3RlZWxwcm90ZWN0aW9udG9tb3Jyb3dtZWRldGFpbGJ5Z3Jvd3Rod2VpZ2hleGNlcHRyZWFzb25saWV5b3V0aHdhdmVjYW5hY3R1YWxseW5vd2ZpZ2h0ZmV3YmFja3JlcGVhdGNvcm5maWd1cmVncm93dmFzdGRvbGxnaXJsY2VydGFpbmx5Y29sZGhvbWVjb3JyZWN0bWFzc2FnZWhhdGhpbGx0b3RhbGZvcnR5dG8=";

    @Override
    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    public <T> T extractClaim(String token, Function<Claims,T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    public String generateToken(UserDetails userDetails) {
        return generateToken(new HashMap<>(), userDetails);
    }

    public String generateToken(
            Map<String, Object> extraClaims,
            UserDetails userDetails
    ) {
        return Jwts
                .builder()
                .setClaims(extraClaims)
                .setSubject(userDetails.getUsername())
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + 1000*60*15))
                .signWith(getSignInKey(), SignatureAlgorithm.HS512)
                .compact();
    }

    public boolean isTokenValid(String token, UserDetails userDetails) {
        final String username = extractUsername(token);
        return username.equals(userDetails.getUsername()) && !isTokenExpired(token);
    }

    private boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date(System.currentTimeMillis()));
    }

    private Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    private Claims extractAllClaims(String token) {
        return Jwts
                .parserBuilder()
                .setSigningKey(getSignInKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    private Key getSignInKey() {
        byte[] keyBytes = Decoders.BASE64.decode(SECRET_KEY);
        return Keys.hmacShaKeyFor(keyBytes);
    }
}
