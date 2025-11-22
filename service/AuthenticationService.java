package javaSpring.service;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Date;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.nimbusds.jose.JWSAlgorithm;
import com.nimbusds.jose.JWSHeader;
import com.nimbusds.jose.JWSObject;
import com.nimbusds.jose.JWSVerifier;
import com.nimbusds.jose.Payload;
import com.nimbusds.jose.crypto.MACSigner;
import com.nimbusds.jose.crypto.MACVerifier;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.SignedJWT;

import javaSpring.dto.request.AuthenticationRequest;
import javaSpring.dto.request.IntrospectRequest;
import javaSpring.exception.AppException;
import javaSpring.exception.ErrorCode;
import javaSpring.repository.UserRepository;
import javaSpring.response.AuthenticationResponse;
import javaSpring.response.IntrospectResponse;
import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;
import lombok.Generated;

@Service
@FieldDefaults(level= AccessLevel.PRIVATE, makeFinal = true)
public class AuthenticationService {
    private final UserRepository userRepository;
    
    protected static final String SIGNER_KEY = "ddaee6f7247285187375aa970cf42d359f3e686ebe2a9a9900bceaee454979cb";

    @Generated
    public AuthenticationService(final UserRepository userRepository) {
        this.userRepository = userRepository;
    }
    
    public IntrospectResponse introspect(IntrospectRequest request){
        var token = request.getToken();
        
        try {
            JWSVerifier verifier = new MACVerifier(SIGNER_KEY.getBytes());

            SignedJWT signedJWT = SignedJWT.parse(token);

            //ktra token hết hạn chưa
            Date expiryTime = signedJWT.getJWTClaimsSet().getExpirationTime();

            var verified = signedJWT.verify(verifier); // true/false

            IntrospectResponse introspectResponse = new IntrospectResponse(verified && expiryTime.after(new Date()));
            return introspectResponse;
            
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
        
    }
    public AuthenticationResponse authenticate(AuthenticationRequest request){
        var user = userRepository.findByUsername(request.getUsername())
            .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        PasswordEncoder passwordEncoder = new BCryptPasswordEncoder(10);
        boolean authenticated = passwordEncoder.matches(request.getPassword(), user.getPassword());

        if(!authenticated){
            throw new AppException(ErrorCode.UNAUTHENTICATED);
        }

        var token = generateToken(request.getUsername());

        return AuthenticationResponse.builder()
            .token(token)
            .build();
        
    } 

    private String generateToken(String username){
        JWSHeader header = new JWSHeader(JWSAlgorithm.HS512);

        JWTClaimsSet jwtClaimsSet = new JWTClaimsSet.Builder()
            .subject(username)
            .issuer("mlongkk.com")
            .issueTime(new Date())
            .expirationTime(new Date(
                Instant.now().plus(1, ChronoUnit.HOURS).toEpochMilli())
            )
            .claim("CustomClaim", "Custom")
            .build();

        Payload payload = new Payload(jwtClaimsSet.toJSONObject());

        JWSObject jwsObject = new JWSObject(header, payload);
        

        // chữ kí
        try {
            jwsObject.sign(new MACSigner(SIGNER_KEY.getBytes()));
            return jwsObject.serialize();
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
        
    }

   

}


